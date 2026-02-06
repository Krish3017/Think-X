import pool from '../config/db.js';

export const studentModel = {
    // Upsert student profile by user_id
    async upsertProfile({ userId, rollNo, name, branch, joinedYear, semester, cgpa }) {
        // Try update first
        const [updateResult] = await pool.execute(
            `UPDATE students SET roll_no = ?, name = ?, branch = ?, joined_year = ?, semester = ?, cgpa = ?, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?`,
            [rollNo, name, branch, joinedYear, semester, cgpa, userId]
        );

        if (updateResult.affectedRows === 0) {
            // Insert if not exists
            await pool.execute(
                `INSERT INTO students (user_id, roll_no, name, branch, joined_year, semester, cgpa)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, rollNo, name, branch, joinedYear, semester, cgpa]
            );
        }
    },

    // Get student profile by user_id
    async getProfileByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT s.*, u.email, u.role FROM students s JOIN users u ON s.user_id = u.id WHERE s.user_id = ?',
            [userId]
        );
        return rows[0] || null;
    },

    // Get student skills by student_id
    async getSkills(studentId) {
        const [rows] = await pool.execute(
            'SELECT * FROM student_skills WHERE student_id = ? ORDER BY is_current DESC, progress DESC',
            [studentId]
        );
        return rows;
    },

    // Replace all skills for a student (current and to-learn)
    async replaceSkills(studentId, { currentSkills = [], learningSkills = [] }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            await conn.execute('DELETE FROM student_skills WHERE student_id = ?', [studentId]);

            const insertSkill = async (skill, isCurrent) => {
                const name = (skill.name || '').trim();
                if (!name) return;
                const progress = Number.isFinite(skill.progress) ? skill.progress : 0;
                const level = skill.level || 'beginner';
                await conn.execute(
                    'INSERT INTO student_skills (student_id, skill_name, proficiency_level, progress, is_current) VALUES (?, ?, ?, ?, ?)',
                    [studentId, name, level, progress, isCurrent]
                );
            };

            for (const s of currentSkills) {
                await insertSkill(s, true);
            }
            for (const s of learningSkills) {
                await insertSkill(s, false);
            }

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    // Get placements by student_id
    async getPlacements(studentId) {
        const [rows] = await pool.execute(
            'SELECT * FROM placements WHERE student_id = ? ORDER BY applied_date DESC',
            [studentId]
        );
        return rows;
    },

    // Get activity stats by student_id (summary rows without activity_date)
    async getActivityStats(studentId) {
        const [rows] = await pool.execute(
            `SELECT platform, MAX(current_streak) as current_streak, MAX(longest_streak) as longest_streak, MAX(total_count) as total_count
       FROM student_activity 
       WHERE student_id = ? AND activity_date IS NULL
       GROUP BY platform`,
            [studentId]
        );
        return rows;
    },

    // Get activity heatmap data by student_id and platform
    async getActivityHeatmap(studentId, platform) {
        const [rows] = await pool.execute(
            `SELECT activity_date as date, daily_count as count 
       FROM student_activity 
       WHERE student_id = ? AND platform = ? AND activity_date IS NOT NULL
       ORDER BY activity_date ASC`,
            [studentId, platform]
        );
        return rows;
    },

    // Get resume insights by student_id
    async getResumeInsights(studentId) {
        const [rows] = await pool.execute(
            `SELECT sr.id as resume_id, sr.file_url, sr.file_name, sr.uploaded_at,
              ra.overall_score, ra.detected_skills, ra.missing_skills, ra.suggestions, ra.analyzed_at
       FROM student_resumes sr
       LEFT JOIN resume_analysis ra ON sr.id = ra.resume_id
       WHERE sr.student_id = ?
       ORDER BY sr.uploaded_at DESC
       LIMIT 1`,
            [studentId]
        );
        return rows[0] || null;
    },

    // Ensure a resume record exists for a student (used for self-reported skills)
    async ensureResumeRecord(studentId) {
        const [existing] = await pool.execute(
            'SELECT id FROM student_resumes WHERE student_id = ? ORDER BY uploaded_at DESC LIMIT 1',
            [studentId]
        );

        if (existing.length > 0) {
            return existing[0].id;
        }

        const [insertResult] = await pool.execute(
            'INSERT INTO student_resumes (student_id, file_url, file_name) VALUES (?, NULL, ?)',
            [studentId, 'Self-reported skills']
        );

        return insertResult.insertId;
    },

    // Upsert detected/missing skills into resume_analysis for the student's resume
    async upsertResumeSkills(studentId, { detectedSkills = [], missingSkills = [] }) {
        const resumeId = await this.ensureResumeRecord(studentId);

        const [existing] = await pool.execute(
            'SELECT id FROM resume_analysis WHERE resume_id = ? LIMIT 1',
            [resumeId]
        );

        const detectedJson = JSON.stringify(detectedSkills || []);
        const missingJson = JSON.stringify(missingSkills || []);

        if (existing.length > 0) {
            await pool.execute(
                'UPDATE resume_analysis SET detected_skills = ?, missing_skills = ?, analyzed_at = CURRENT_TIMESTAMP WHERE id = ?',
                [detectedJson, missingJson, existing[0].id]
            );
        } else {
            await pool.execute(
                'INSERT INTO resume_analysis (resume_id, overall_score, detected_skills, missing_skills, suggestions) VALUES (?, 0, ?, ?, JSON_ARRAY())',
                [resumeId, detectedJson, missingJson]
            );
        }

        return resumeId;
    },

    // Get training recommendations based on missing skills
    async getTrainingRecommendations(missingSkills) {
        if (!missingSkills || missingSkills.length === 0) return [];

        // Build query to find programs matching any missing skill
        const placeholders = missingSkills.map(() => '?').join(', ');
        const likeConditions = missingSkills.map(() => 'JSON_CONTAINS(skill_tags, JSON_QUOTE(?))').join(' OR ');

        const [rows] = await pool.execute(
            `SELECT * FROM training_programs WHERE ${likeConditions} ORDER BY difficulty ASC`,
            missingSkills
        );
        return rows;
    },
};
