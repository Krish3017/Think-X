import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// New endpoints
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// Legacy endpoints (keep for backward compat)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);

export default router;
