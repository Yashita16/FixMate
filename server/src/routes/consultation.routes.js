import express from 'express';
import {
  requestConsultation, respondToConsultation, getVideoToken,
  completeConsultation, cancelConsultation, getMyConsultations,
  getExpertConsultations, getConsultationById
} from '../controllers/consultation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/request', requestConsultation);
router.get('/my', getMyConsultations);
router.get('/expert', getExpertConsultations);
router.get('/:id', getConsultationById);
router.patch('/:id/respond', respondToConsultation);
router.get('/:id/token', getVideoToken);
router.patch('/:id/complete', completeConsultation);
router.patch('/:id/cancel', cancelConsultation);

export default router;