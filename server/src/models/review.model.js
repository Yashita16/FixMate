import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation',
      required: true,
      unique: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ expert: 1 });
reviewSchema.index({ consultation: 1 }, { unique: true });

// After saving, update expert's average rating
reviewSchema.post('save', async function () {
  const Expert = mongoose.model('Expert');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { expert: this.expert } },
    { $group: { _id: '$expert', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Expert.findByIdAndUpdate(this.expert, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count,
    });
  }
});

export default mongoose.model('Review', reviewSchema);