import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: {
      type: String,
      enum: ['open', 'matched', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    attachments: [{ type: String }],
    matchedExperts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expert' }],
  },
  { timestamps: true }
);

issueSchema.index({ user: 1, status: 1 });
issueSchema.index({ category: 1, status: 1 });

export default mongoose.model('Issue', issueSchema);