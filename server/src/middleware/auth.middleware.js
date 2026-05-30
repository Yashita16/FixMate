import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.model.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

  if (!token) throw new ApiError(401, 'Not authorized, no token provided');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) throw new ApiError(401, 'User belonging to this token no longer exists');
  if (!req.user.isActive) throw new ApiError(403, 'Your account has been deactivated');

  next();
});