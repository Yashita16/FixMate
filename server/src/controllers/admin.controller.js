import User from '../models/User.model.js';
import Expert from '../models/Expert.model.js';
import Consultation from '../models/Consultation.model.js';
import Category from '../models/Category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../services/notification.service.js';

// GET /api/admin/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalExperts, pendingExperts, totalConsultations, completedConsultations] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      Expert.countDocuments({ isApproved: true }),
      Expert.countDocuments({ isApproved: false }),
      Consultation.countDocuments(),
      Consultation.countDocuments({ status: 'completed' }),
    ]);

  const revenueData = await Consultation.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  res.json(new ApiResponse(200, {
    totalUsers,
    totalExperts,
    pendingExperts,
    totalConsultations,
    completedConsultations,
    totalRevenue: revenueData[0]?.total || 0,
  }));
});

// GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, {
    users,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  }));
});

// GET /api/admin/experts/pending
export const getPendingExperts = asyncHandler(async (req, res) => {
  const experts = await Expert.find({ isApproved: false })
    .populate('user', 'name email profileImage createdAt')
    .populate('categories', 'name icon')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, experts));
});

// PATCH /api/admin/experts/:id/approve
export const approveExpert = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id).populate('user', '_id name');
  if (!expert) throw new ApiError(404, 'Expert not found');

  expert.isApproved = true;
  await expert.save();

  // Update user role to 'expert'
  await User.findByIdAndUpdate(expert.user._id, { role: 'expert' });

  await createNotification({
    recipient: expert.user._id,
    type: 'expert_approved',
    title: 'Your Expert Account is Approved! 🎉',
    message: 'Congratulations! You can now set your availability and accept consultations.',
    relatedId: expert._id,
    relatedModel: 'Expert',
  });

  res.json(new ApiResponse(200, expert, 'Expert approved successfully'));
});

// PATCH /api/admin/experts/:id/reject
export const rejectExpert = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const expert = await Expert.findById(req.params.id).populate('user', '_id name');
  if (!expert) throw new ApiError(404, 'Expert not found');

  await createNotification({
    recipient: expert.user._id,
    type: 'expert_rejected',
    title: 'Expert Application Update',
    message: reason || 'Your expert application was not approved at this time.',
    relatedId: expert._id,
    relatedModel: 'Expert',
  });

  await Expert.findByIdAndDelete(expert._id);

  res.json(new ApiResponse(200, null, 'Expert application rejected'));
});

// PATCH /api/admin/users/:id/toggle-active
export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(403, 'Cannot deactivate an admin');

  user.isActive = !user.isActive;
  await user.save();

  res.json(new ApiResponse(200, { isActive: user.isActive },
    `User ${user.isActive ? 'activated' : 'deactivated'}`));
});

// GET /api/admin/consultations
export const getAllConsultations = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const [consultations, total] = await Promise.all([
    Consultation.find(filter)
      .populate('user', 'name email')
      .populate({ path: 'expert', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Consultation.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, {
    consultations,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  }));
});

// POST /api/admin/categories
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, description } = req.body;
  if (!name) throw new ApiError(400, 'Category name is required');

  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const category = await Category.create({ name, slug, icon, description });

  res.status(201).json(new ApiResponse(201, category, 'Category created'));
});

// GET /api/admin/categories
export const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(new ApiResponse(200, categories));
});

// PATCH /api/admin/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(new ApiResponse(200, category, 'Category updated'));
});

// DELETE /api/admin/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(new ApiResponse(200, null, 'Category deleted'));
});