import User from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// GET /api/users/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user));
});

// PATCH /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, bio },
    { new: true, runValidators: true }
  );

  res.json(new ApiResponse(200, updated, 'Profile updated successfully'));
});

// PATCH /api/users/profile/image
export const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file provided');

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: req.file.path },
    { new: true }
  );

  res.json(new ApiResponse(200, updated, 'Profile image updated'));
});

// PATCH /api/users/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json(new ApiResponse(200, null, 'Password changed successfully'));
});