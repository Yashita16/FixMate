import Expert from '../models/Expert.model.js';
import User from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// GET /api/experts  — browse all approved experts with filters
export const getAllExperts = asyncHandler(async (req, res) => {
  const { category, minRating, available, minExperience, search, page = 1, limit = 12, sort = '-rating' } = req.query;

  const filter = { isApproved: true };
  if (category) filter.categories = category;
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (available === 'true') filter.isAvailable = true;
  if (minExperience) filter.experience = { $gte: Number(minExperience) };

  let query = Expert.find(filter)
    .populate('user', 'name profileImage email')
    .populate('categories', 'name icon slug')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Search by user name — requires a separate lookup
  let experts = await query;

  if (search) {
    experts = experts.filter((e) =>
      e.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );
  }

  const total = await Expert.countDocuments(filter);

  res.json(new ApiResponse(200, {
    experts,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  }));
});

// GET /api/experts/:id
export const getExpertById = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id)
    .populate('user', 'name profileImage email bio')
    .populate('categories', 'name icon slug');

  if (!expert) throw new ApiError(404, 'Expert not found');
  res.json(new ApiResponse(200, expert));
});

// GET /api/experts/me  — expert's own profile
export const getMyExpertProfile = asyncHandler(async (req, res) => {
  const expert = await Expert.findOne({ user: req.user._id })
    .populate('categories', 'name icon slug');

  if (!expert) throw new ApiError(404, 'Expert profile not found');
  res.json(new ApiResponse(200, expert));
});

// PATCH /api/experts/me  — update expert profile
export const updateExpertProfile = asyncHandler(async (req, res) => {
  const { bio, experience, skills, hourlyRate, categories, isAvailable, languages, linkedIn, portfolio } = req.body;

  const expert = await Expert.findOneAndUpdate(
    { user: req.user._id },
    { bio, experience, skills, hourlyRate, categories, isAvailable, languages, linkedIn, portfolio },
    { new: true, runValidators: true }
  ).populate('categories', 'name icon');

  if (!expert) throw new ApiError(404, 'Expert profile not found');
  res.json(new ApiResponse(200, expert, 'Expert profile updated'));
});

// PATCH /api/experts/me/availability
export const toggleAvailability = asyncHandler(async (req, res) => {
  const expert = await Expert.findOne({ user: req.user._id });
  if (!expert) throw new ApiError(404, 'Expert profile not found');
  if (!expert.isApproved) throw new ApiError(403, 'Your account is pending admin approval');

  expert.isAvailable = !expert.isAvailable;
  await expert.save();

  res.json(new ApiResponse(200, { isAvailable: expert.isAvailable },
    `You are now ${expert.isAvailable ? 'available' : 'unavailable'}`));
});