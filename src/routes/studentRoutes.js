import express from 'express';
import { studentController } from '../controllers/studentController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All student routes require authentication + student role
router.get('/profile', authMiddleware, requireRole('student'), studentController.getProfile);
router.post('/profile', authMiddleware, requireRole('student'), studentController.updateProfile);
router.post('/skills', authMiddleware, requireRole('student'), studentController.updateSkills);
router.get('/dashboard', authMiddleware, requireRole('student'), studentController.getDashboard);
router.get('/resume-insights', authMiddleware, requireRole('student'), studentController.getResumeSkills);
router.get('/resume/status', authMiddleware, requireRole('student'), studentController.getResumeStatus);

export default router;
