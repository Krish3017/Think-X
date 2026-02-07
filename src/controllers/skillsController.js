import pool from '../config/db.js';

// CRITICAL HELPER: Resolve student_id from user_id (JWT gives us user_id, NOT student_id)
async function getStudentIdFromUser(userId) {
    const [rows] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [userId]
    );
    if (rows.length === 0) {
        throw new Error('Student profile does not exist for this user');
    }
    return rows[0].id;
}

export const saveSkill = async (req, res) => {
    try {
        const userId = req.user.id;
        // FIXED: Resolve actual student_id from user_id
        let studentId;
        try {
            studentId = await getStudentIdFromUser(userId);
        } catch (e) {
            return res.status(404).json({ message: 'Student profile not found. Please create your profile first.' });
        }

        const { skill_name, progress, is_current } = req.body;

        if (!skill_name) {
            return res.status(400).json({ message: 'Skill name required' });
        }

        const actualProgress = is_current ? (progress || 0) : 0;
        let proficiency_level = 'beginner';
        if (actualProgress > 75) proficiency_level = 'expert';
        else if (actualProgress > 50) proficiency_level = 'advanced';
        else if (actualProgress > 25) proficiency_level = 'intermediate';

        const [existing] = await pool.query(
            'SELECT id FROM student_skills WHERE student_id = ? AND skill_name = ?',
            [studentId, skill_name]
        );

        if (existing.length > 0) {
            await pool.query(
                'UPDATE student_skills SET proficiency_level = ?, progress = ?, is_current = ? WHERE student_id = ? AND skill_name = ?',
                [proficiency_level, actualProgress, is_current, studentId, skill_name]
            );
        } else {
            await pool.query(
                'INSERT INTO student_skills (student_id, skill_name, proficiency_level, progress, is_current) VALUES (?, ?, ?, ?, ?)',
                [studentId, skill_name, proficiency_level, actualProgress, is_current]
            );
        }

        // FIXED: Verify write by re-reading from DB and returning persisted data
        const [savedSkills] = await pool.query(
            'SELECT skill_name, proficiency_level, progress, is_current FROM student_skills WHERE student_id = ?',
            [studentId]
        );

        const current_skills = savedSkills.filter(s => s.is_current).map(skill => ({
            skill_name: skill.skill_name,
            progress: skill.progress,
            proficiency_level: skill.proficiency_level
        }));

        const skills_to_learn = savedSkills.filter(s => !s.is_current).map(skill => ({
            skill_name: skill.skill_name
        }));

        console.log(`✅ Skill upserted for student_id ${studentId}: ${skill_name}`);
        res.json({ success: true, message: 'Skill saved successfully', current_skills, skills_to_learn });
    } catch (error) {
        console.error('Save skill error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSkills = async (req, res) => {
    try {
        const userId = req.user.id;
        // FIXED: Resolve actual student_id from user_id
        let studentId;
        try {
            studentId = await getStudentIdFromUser(userId);
        } catch (e) {
            return res.status(404).json({ message: 'Student profile not found. Please create your profile first.' });
        }

        const [skills] = await pool.query(
            'SELECT skill_name, proficiency_level, progress, is_current FROM student_skills WHERE student_id = ?',
            [studentId]
        );

        const current_skills = skills.filter(s => s.is_current).map(skill => ({
            skill_name: skill.skill_name,
            progress: skill.progress,
            proficiency_level: skill.proficiency_level
        }));

        const skills_to_learn = skills.filter(s => !s.is_current).map(skill => ({
            skill_name: skill.skill_name
        }));

        res.json({ current_skills, skills_to_learn });
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
