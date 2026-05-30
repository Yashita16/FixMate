import mongoose from 'mongoose';
import Expert from '../models/Expert.model.js';

/**
 * Finds best-matching experts for a given category.
 * Scoring (out of 100):
 *   Rating       → 40 pts  (rating / 5 * 40)
 *   Experience   → 30 pts  (min(exp,10) / 10 * 30)
 *   SuccessScore → 30 pts  (successScore / 100 * 30)
 */
export const findMatchingExperts = async (categoryId, limit = 5) => {
  const objectId =
    typeof categoryId === 'string'
      ? new mongoose.Types.ObjectId(categoryId)
      : categoryId;

  const experts = await Expert.aggregate([
    { $match: { categories: objectId, isAvailable: true, isApproved: true } },
    {
      $addFields: {
        matchScore: {
          $add: [
            { $multiply: [{ $divide: ['$rating', 5] }, 40] },
            { $multiply: [{ $divide: [{ $min: ['$experience', 10] }, 10] }, 30] },
            { $multiply: [{ $divide: ['$successScore', 100] }, 30] },
          ],
        },
      },
    },
    { $sort: { matchScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    {
      $project: {
        matchScore: 1,
        rating: 1,
        experience: 1,
        isAvailable: 1,
        hourlyRate: 1,
        bio: 1,
        skills: 1,
        consultationsCompleted: 1,
        'userDetails._id': 1,
        'userDetails.name': 1,
        'userDetails.profileImage': 1,
        'categoryDetails.name': 1,
        'categoryDetails.icon': 1,
      },
    },
  ]);

  return experts;
};