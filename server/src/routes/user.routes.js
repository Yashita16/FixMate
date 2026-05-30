import express from 'express';
import { getProfile, updateProfile, updateProfileImage, changePassword } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/profile/image', uploadSingle('profileImage'), updateProfileImage);
router.patch('/change-password', changePassword);

export default router;