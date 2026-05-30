import crypto from 'crypto';
import User from '../models/User.model.js';
import Expert from '../models/Expert.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, 'Email already in use');

  // Prevent self-assigning admin role
  const assignedRole = role === 'admin' ? 'user' : role || 'user';

  const user = await User.create({ name, email, password, role: assignedRole });

  // If registering as expert, create expert profile
  if (assignedRole === 'expert') {
    await Expert.create({ user: user._id, experience: 0 });
  }

  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage },
    }, 'Registration successful')
  );
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Your account has been deactivated. Contact support.');

  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  res.json(
    new ApiResponse(200, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profileImage: user.profileImage },
    }, 'Login successful')
  );
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(new ApiResponse(200, user));
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'No user found with that email address');

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'FixMate – Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password. This link expires in 10 minutes.</p>
        <a href="${resetURL}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
    res.json(new ApiResponse(200, null, 'Password reset email sent'));
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Email could not be sent. Try again later.');
  }
});

// PATCH /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Token is invalid or has expired');

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.json(new ApiResponse(200, { token }, 'Password reset successful'));
});