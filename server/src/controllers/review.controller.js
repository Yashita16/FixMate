import Review from '../models/Review.model.js';
import Consultation from '../models/Consultation.model.js';
import Expert from '../models/Expert.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../services/notification.service.js';

// POST /api/reviews
export const createReview = asyncHandler(async (req, res) => {
  const { consultationId, rating, comment } = req.body;

  if (!consultationId || !rating) throw new ApiError(400, 'consultationId and rating are required');

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) throw new ApiError(404, 'Consultation not found');
  if (consultation.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the user of this consultation can leave a review');
  }
  if (consultation.status !== 'completed') {
    throw new ApiError(400, 'Can only review completed consultations');
  }
  if (consultation.isReviewed) throw new ApiError(409, 'This consultation has already been reviewed');

  const review = await Review.create({
    user: req.user._id,
    expert: consultation.expert,
    consultation: consultationId,
    rating,
    comment: comment || '',
  });

  consultation.isReviewed = true;
  await consultation.save();

  // Update expert success score based on rating
  const expert = await Expert.findById(consultation.expert);
  if (expert) {
    const successDelta = rating >= 4 ? 2 : rating === 3 ? 0 : -1;
    expert.successScore = Math.min(100, Math.max(0, expert.successScore + successDelta));
    await expert.save();

    await createNotification({
      recipient: expert.user,
      type: 'new_review',
      title: 'New Review Received ⭐',
      message: `You received a ${rating}-star review from ${req.user.name}.`,
      relatedId: review._id,
      relatedModel: 'Review',
    });
  }

  res.status(201).json(new ApiResponse(201, review, 'Review submitted successfully'));
});

// GET /api/reviews/expert/:expertId
export const getExpertReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const [reviews, total] = await Promise.all([
    Review.find({ expert: req.params.expertId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Review.countDocuments({ expert: req.params.expertId }),
  ]);

  res.json(new ApiResponse(200, {
    reviews,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  }));
});