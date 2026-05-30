import express from 'express';
import {
  getAllExperts, getExpertById, getMyExpertProfile,
  updateExpertProfile, toggleAvailability
} from '../controllers/expert.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllExperts);
router.get('/me', protect, getMyExpertProfile);
router.patch('/me', protect, updateExpertProfile);
router.patch('/me/availability', protect, toggleAvailability);
router.get('/:id', getExpertById);

export default router;