import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', default: null },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    roomId: { type: String, unique: true, sparse: true },
    scheduledAt: { type: Date, default: null },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    userNotes: { type: String, maxlength: 500, default: '' },
    expertNotes: { type: String, maxlength: 500, default: '' },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

consultationSchema.index({ user: 1, status: 1 });
consultationSchema.index({ expert: 1, status: 1 });
consultationSchema.index({ roomId: 1 });

export default mongoose.model('Consultation', consultationSchema);