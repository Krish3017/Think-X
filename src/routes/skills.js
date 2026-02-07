import express from 'express';
import { saveSkill, getSkills } from '../controllers/skillsController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Individual skill save (used by frontend for single skill operations)
router.post('/skill', authMiddleware, requireRole('student'), saveSkill);
// GET skills (used by StudentDashboard to fetch current_skills and skills_to_learn)
router.get('/skills-list', authMiddleware, requireRole('student'), getSkills);

export default router;
