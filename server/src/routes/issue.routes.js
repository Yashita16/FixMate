import express from 'express';
import { createIssue, getMyIssues, getIssueById } from '../controllers/issue.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createIssue);
router.get('/my', getMyIssues);
router.get('/:id', getIssueById);

export default router;