import express from 'express';
import { createReview, getExpertReviews } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/expert/:expertId', getExpertReviews);

export default router;