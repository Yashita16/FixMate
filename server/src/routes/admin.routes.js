import express from 'express';
import {
  getDashboardStats, getAllUsers, getPendingExperts,
  approveExpert, rejectExpert, toggleUserActive,
  getAllConsultations, createCategory, getAllCategoriesAdmin,
  updateCategory, deleteCategory
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect, requireRole('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-active', toggleUserActive);
router.get('/experts/pending', getPendingExperts);
router.patch('/experts/:id/approve', approveExpert);
router.patch('/experts/:id/reject', rejectExpert);
router.get('/consultations', getAllConsultations);
router.get('/categories', getAllCategoriesAdmin);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;