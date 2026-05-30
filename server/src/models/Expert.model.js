import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    experience: { type: Number, required: true, min: 0, default: 0 },
    skills: [{ type: String, trim: true }],
    bio: { type: String, maxlength: 500, default: '' },
    hourlyRate: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    successScore: { type: Number, default: 0, min: 0, max: 100 },
    totalEarnings: { type: Number, default: 0 },
    consultationsCompleted: { type: Number, default: 0 },
    languages: [{ type: String }],
    linkedIn: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  { timestamps: true }
);

expertSchema.index({ isAvailable: 1, isApproved: 1, rating: -1 });
expertSchema.index({ categories: 1, isAvailable: 1 });
expertSchema.index({ rating: -1, experience: -1 });

export default mongoose.model('Expert', expertSchema);