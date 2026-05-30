import Issue from '../models/Issue.model.js';
import { findMatchingExperts } from '../services/matching.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// POST /api/issues
export const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, urgency } = req.body;
  if (!title || !description || !category) {
    throw new ApiError(400, 'title, description and category are required');
  }

  const issue = await Issue.create({
    user: req.user._id,
    title,
    description,
    category,
    urgency: urgency || 'medium',
  });

  // Auto-match experts
  const matchedExperts = await findMatchingExperts(category, 5);
  if (matchedExperts.length > 0) {
    issue.matchedExperts = matchedExperts.map((e) => e._id);
    issue.status = 'matched';
    await issue.save();
  }

  await issue.populate('category', 'name icon');

  res.status(201).json(new ApiResponse(201, { issue, matchedExperts }, 'Issue submitted and experts matched'));
});

// GET /api/issues/my
export const getMyIssues = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate('category', 'name icon')
      .populate('matchedExperts', 'rating experience')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Issue.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, {
    issues,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  }));
});

// GET /api/issues/:id
export const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate('category', 'name icon')
    .populate({ path: 'matchedExperts', populate: { path: 'user', select: 'name profileImage' } });

  if (!issue) throw new ApiError(404, 'Issue not found');
  if (issue.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  res.json(new ApiResponse(200, issue));
});