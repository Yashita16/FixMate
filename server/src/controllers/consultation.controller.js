import mongoose from 'mongoose';
import Consultation from '../models/Consultation.model.js';
import Expert from '../models/Expert.model.js';
import Issue from '../models/Issue.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateZegoToken } from '../services/zego.service.js';
import { createNotification } from '../services/notification.service.js';

const generateRoomId = () =>
  `fixmate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// POST /api/consultations/request
export const requestConsultation = asyncHandler(async (req, res) => {
  const { expertId, issueId, userNotes } = req.body;

  if (!expertId) throw new ApiError(400, 'expertId is required');

  const expert = await Expert.findById(expertId).populate('user', '_id name');
  if (!expert) throw new ApiError(404, 'Expert not found');
  if (!expert.isApproved) throw new ApiError(400, 'This expert is not yet approved');
  if (!expert.isAvailable) throw new ApiError(400, 'This expert is currently unavailable');

  // Prevent duplicate pending requests
  const existing = await Consultation.findOne({
    user: req.user._id,
    expert: expertId,
    status: 'pending',
  });
  if (existing) throw new ApiError(409, 'You already have a pending request with this expert');

  const consultation = await Consultation.create({
    user: req.user._id,
    expert: expertId,
    issue: issueId || null,
    roomId: generateRoomId(),
    amount: expert.hourlyRate,
    userNotes: userNotes || '',
  });

  await createNotification({
    recipient: expert.user._id,
    type: 'consultation_request',
    title: 'New Consultation Request',
    message: `${req.user.name} wants to consult with you.`,
    relatedId: consultation._id,
    relatedModel: 'Consultation',
  });

  res.status(201).json(new ApiResponse(201, consultation, 'Consultation request sent successfully'));
});

// PATCH /api/consultations/:id/respond
export const respondToConsultation = asyncHandler(async (req, res) => {
  const { action } = req.body; // 'accept' | 'reject'
  if (!['accept', 'reject'].includes(action)) throw new ApiError(400, "Action must be 'accept' or 'reject'");

  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) throw new ApiError(404, 'Consultation not found');
  if (consultation.status !== 'pending') throw new ApiError(400, 'This consultation has already been responded to');

  const expert = await Expert.findOne({ user: req.user._id });
  if (!expert || consultation.expert.toString() !== expert._id.toString()) {
    throw new ApiError(403, 'Not authorized to respond to this consultation');
  }

  consultation.status = action === 'accept' ? 'accepted' : 'rejected';
  if (action === 'accept') consultation.startedAt = new Date();
  await consultation.save();

  await createNotification({
    recipient: consultation.user,
    type: action === 'accept' ? 'consultation_accepted' : 'consultation_rejected',
    title: `Consultation ${action === 'accept' ? 'Accepted ✅' : 'Rejected ❌'}`,
    message:
      action === 'accept'
        ? 'Your consultation was accepted! You can now join the video session.'
        : 'Your consultation request was declined. Please try another expert.',
    relatedId: consultation._id,
    relatedModel: 'Consultation',
  });

  res.json(new ApiResponse(200, consultation, `Consultation ${action}ed`));
});

// GET /api/consultations/:id/token  — get ZegoCloud video token
export const getVideoToken = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) throw new ApiError(404, 'Consultation not found');
  if (consultation.status !== 'accepted') throw new ApiError(400, 'Consultation is not in accepted state');

  const expert = await Expert.findOne({ user: req.user._id });
  const isUser = consultation.user.toString() === req.user._id.toString();
  const isExpert = expert && consultation.expert.toString() === expert._id.toString();

  if (!isUser && !isExpert) throw new ApiError(403, 'You are not a participant in this consultation');

  const token = generateZegoToken(req.user._id.toString(), consultation.roomId);

  res.json(new ApiResponse(200, { token, roomId: consultation.roomId, appId: Number(process.env.ZEGO_APP_ID) }));
});

// PATCH /api/consultations/:id/complete
export const completeConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) throw new ApiError(404, 'Consultation not found');

  const expert = await Expert.findOne({ user: req.user._id });
  const isParticipant =
    consultation.user.toString() === req.user._id.toString() ||
    (expert && consultation.expert.toString() === expert._id.toString());

  if (!isParticipant) throw new ApiError(403, 'Not authorized');

  consultation.status = 'completed';
  consultation.endedAt = new Date();
  if (consultation.startedAt) {
    consultation.durationMinutes = Math.round(
      (consultation.endedAt - consultation.startedAt) / 60000
    );
  }
  await consultation.save();

  // Update expert stats
  if (expert) {
    await Expert.findByIdAndUpdate(expert._id, {
      $inc: { consultationsCompleted: 1, totalEarnings: consultation.amount },
    });
  }

  await createNotification({
    recipient: consultation.user,
    type: 'consultation_completed',
    title: 'Consultation Completed',
    message: 'Your consultation is complete. Please rate your experience!',
    relatedId: consultation._id,
    relatedModel: 'Consultation',
  });

  res.json(new ApiResponse(200, consultation, 'Consultation marked as completed'));
});

// PATCH /api/consultations/:id/cancel
export const cancelConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) throw new ApiError(404, 'Consultation not found');
  if (!['pending', 'accepted'].includes(consultation.status)) {
    throw new ApiError(400, 'Cannot cancel a consultation that is completed or rejected');
  }
  if (consultation.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the user can cancel a consultation');
  }

  consultation.status = 'cancelled';
  await consultation.save();

  const expert = await Expert.findById(consultation.expert).populate('user', '_id');
  if (expert) {
    await createNotification({
      recipient: expert.user._id,
      type: 'system',
      title: 'Consultation Cancelled',
      message: `${req.user.name} has cancelled their consultation request.`,
      relatedId: consultation._id,
      relatedModel: 'Consultation',
    });
  }

  res.json(new ApiResponse(200, consultation, 'Consultation cancelled'));
});

// GET /api/consultations/my  — user's own consultations
export const getMyConsultations = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const [consultations, total] = await Promise.all([
    Consultation.find(filter)
      .populate({ path: 'expert', populate: { path: 'user', select: 'name profileImage' } })
      .populate('issue', 'title category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Consultation.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, {
    consultations,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  }));
});

// GET /api/consultations/expert  — expert's incoming consultations
export const getExpertConsultations = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const expert = await Expert.findOne({ user: req.user._id });
  if (!expert) throw new ApiError(404, 'Expert profile not found');

  const filter = { expert: expert._id };
  if (status) filter.status = status;

  const [consultations, total] = await Promise.all([
    Consultation.find(filter)
      .populate('user', 'name profileImage email')
      .populate('issue', 'title category urgency')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Consultation.countDocuments(filter),
  ]);

  res.json(new ApiResponse(200, {
    consultations,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  }));
});

// GET /api/consultations/:id
export const getConsultationById = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id)
    .populate('user', 'name profileImage email')
    .populate({ path: 'expert', populate: { path: 'user', select: 'name profileImage' } })
    .populate('issue');

  if (!consultation) throw new ApiError(404, 'Consultation not found');

  const expert = await Expert.findOne({ user: req.user._id });
  const isUser = consultation.user._id.toString() === req.user._id.toString();
  const isExpert = expert && consultation.expert._id.toString() === expert._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isUser && !isExpert && !isAdmin) throw new ApiError(403, 'Not authorized');

  res.json(new ApiResponse(200, consultation));
});