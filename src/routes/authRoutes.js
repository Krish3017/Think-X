import express from 'express';
import { authController } from '.bin/src/controllers/authController.js';
import { authMiddleware } from '.bin/src/middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);

export default router;
