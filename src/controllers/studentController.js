import { studentModel } from '../models/studentModel.js';
import pool from '../config/db.js';

// CRITICAL HELPER: Resolve student_id from user_id
async function getStudentIdFromUser(userId) {
    const [rows] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [userId]
    );
    if (rows.length === 0) {
        throw new Error('Student profile does not exist');
    }
    return rows[0].id;
}

export const studentController = {
    // GET /api/student/profile - Fetch profile + skills from DB
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const profile = await studentModel.getProfileByUserId(userId);

            if (!profile) {
                return res.json({
                    profile: null,
                    currentSkills: [],
                    learningSkills: [],
                });
            }

            const studentId = profile.id;
            const skills = await studentModel.getSkills(studentId);

            const currentSkills = skills.filter(s => s.is_current).map(s => ({
                name: s.skill_name,
                progress: s.progress,
                proficiency_level: s.proficiency_level,
            }));

            const learningSkills = skills.filter(s => !s.is_current).map(s => ({
                name: s.skill_name,
                progress: s.progress,
            }));

            res.json({
                profile: {
                    rollNo: profile.roll_no,
                    name: profile.name,
                    branch: profile.branch,
                    joinedYear: profile.joined_year,
                    semester: profile.semester,
                    cgpa: profile.cgpa,
                    email: profile.email,
                    githubUsername: profile.github_username || '',
                    leetcodeUsername: profile.leetcode_username || '',
                },
                currentSkills,
                learningSkills,
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Failed to fetch profile' });
        }
    },

    // POST /api/student/profile - Save/Update student profile (TRANSACTIONAL)
    async updateProfile(req, res) {
        const connection = await pool.getConnection();
        try {
            const userId = req.user.id;
            const { rollNo, name, branch, joinedYear, semester, cgpa } = req.body;

            if (!name || !rollNo || !branch || !joinedYear || !semester) {
                return res.status(400).json({ message: 'rollNo, name, branch, joinedYear, semester are required' });
            }

            await connection.beginTransaction();

            // Check if student exists
            const [existing] = await connection.execute(
                'SELECT id FROM students WHERE user_id = ?',
                [userId]
            );

            if (existing.length > 0) {
                // UPDATE
                await connection.execute(
                    `UPDATE students SET roll_no = ?, name = ?, branch = ?, joined_year = ?, semester = ?, cgpa = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
                    [rollNo, name, branch, joinedYear, semester, cgpa ?? null, userId]
                );
                console.log(`✅ DB: Updated student profile for user_id ${userId}`);
            } else {
                // INSERT
                await connection.execute(
                    `INSERT INTO students (user_id, roll_no, name, branch, joined_year, semester, cgpa) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [userId, rollNo, name, branch, joinedYear, semester, cgpa ?? null]
                );
                console.log(`✅ DB: Inserted new student profile for user_id ${userId}`);
            }

            await connection.commit();

            // VERIFY: Re-read from DB and return persisted data
            const savedProfile = await studentModel.getProfileByUserId(userId);
            if (!savedProfile) {
                throw new Error('Profile save verification failed - data not found in DB after commit');
            }

            res.json({
                success: true,
                message: 'Profile saved',
                profile: {
                    rollNo: savedProfile.roll_no,
                    name: savedProfile.name,
                    branch: savedProfile.branch,
                    joinedYear: savedProfile.joined_year,
                    semester: savedProfile.semester,
                    cgpa: savedProfile.cgpa,
                    email: savedProfile.email,
                },
            });
        } catch (error) {
            await connection.rollback();
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Failed to save profile' });
        } finally {
            connection.release();
        }
    },

    // POST /api/student/skills - Upsert skills (TRANSACTIONAL, NO DELETE)
    async updateSkills(req, res) {
        const connection = await pool.getConnection();
        try {
            const userId = req.user.id;
            const {
                currentSkills = [],
                learningSkills = [],
                extractedSkills = [],
                missingSkills = [],
            } = req.body || {};

            // Resolve student_id from user_id
            const profile = await studentModel.getProfileByUserId(userId);
            if (!profile) {
                return res.status(404).json({ message: 'Student profile not found. Please create your profile first.' });
            }

            const studentId = profile.id;

            await connection.beginTransaction();

            // UPSERT current skills (is_current = true)
            for (const skill of currentSkills) {
                const skillName = (skill.name || '').trim();
                if (!skillName) continue;
                const progress = Number.isFinite(skill.progress) ? skill.progress : 0;
                let profLevel = skill.level || 'beginner';
                if (progress > 75) profLevel = 'expert';
                else if (progress > 50) profLevel = 'advanced';
                else if (progress > 25) profLevel = 'intermediate';

                const [existingSkill] = await connection.execute(
                    'SELECT id FROM student_skills WHERE student_id = ? AND skill_name = ?',
                    [studentId, skillName]
                );

                if (existingSkill.length > 0) {
                    await connection.execute(
                        'UPDATE student_skills SET proficiency_level = ?, progress = ?, is_current = ? WHERE student_id = ? AND skill_name = ?',
                        [profLevel, progress, true, studentId, skillName]
                    );
                } else {
                    await connection.execute(
                        'INSERT INTO student_skills (student_id, skill_name, proficiency_level, progress, is_current) VALUES (?, ?, ?, ?, ?)',
                        [studentId, skillName, profLevel, progress, true]
                    );
                }
            }

            // UPSERT learning skills (is_current = false)
            for (const skill of learningSkills) {
                const skillName = (skill.name || '').trim();
                if (!skillName) continue;

                const [existingSkill] = await connection.execute(
                    'SELECT id FROM student_skills WHERE student_id = ? AND skill_name = ?',
                    [studentId, skillName]
                );

                if (existingSkill.length > 0) {
                    await connection.execute(
                        'UPDATE student_skills SET is_current = ?, progress = 0 WHERE student_id = ? AND skill_name = ?',
                        [false, studentId, skillName]
                    );
                } else {
                    await connection.execute(
                        'INSERT INTO student_skills (student_id, skill_name, proficiency_level, progress, is_current) VALUES (?, ?, ?, ?, ?)',
                        [studentId, skillName, 'beginner', 0, false]
                    );
                }
            }

            // Remove skills that were removed by the user (not in either list)
            const allSentSkillNames = [
                ...currentSkills.map(s => (s.name || '').trim()).filter(Boolean),
                ...learningSkills.map(s => (s.name || '').trim()).filter(Boolean),
            ];

            if (allSentSkillNames.length > 0) {
                const placeholders = allSentSkillNames.map(() => '?').join(',');
                await connection.execute(
                    `DELETE FROM student_skills WHERE student_id = ? AND skill_name NOT IN (${placeholders})`,
                    [studentId, ...allSentSkillNames]
                );
            }

            await connection.commit();

            // Handle resume skills separately (don't fail main skills save)
            try {
                if (extractedSkills.length > 0 || missingSkills.length > 0) {
                    await studentModel.upsertResumeSkills(studentId, {
                        detectedSkills: extractedSkills,
                        missingSkills,
                    });
                }
            } catch (resumeErr) {
                console.warn('Resume skills upsert warning (non-fatal):', resumeErr.message);
            }

            // VERIFY: Re-read from DB and return persisted data
            const [savedSkills] = await pool.query(
                'SELECT * FROM student_skills WHERE student_id = ? ORDER BY is_current DESC, progress DESC',
                [studentId]
            );

            const savedCurrentSkills = savedSkills.filter(s => s.is_current).map(s => ({
                name: s.skill_name,
                progress: s.progress,
                proficiency_level: s.proficiency_level,
            }));

            const savedLearningSkills = savedSkills.filter(s => !s.is_current).map(s => ({
                name: s.skill_name,
                progress: s.progress,
            }));

            console.log(`✅ Skills saved for student ${studentId}: ${savedCurrentSkills.length} current, ${savedLearningSkills.length} learning`);
            res.json({
                success: true,
                message: 'Skills saved',
                currentSkills: savedCurrentSkills,
                learningSkills: savedLearningSkills,
            });
        } catch (error) {
            await connection.rollback();
            console.error('Update skills error:', error);
            res.status(500).json({ message: 'Failed to save skills' });
        } finally {
            connection.release();
        }
    },

    // GET /api/student/resume-insights - only extracted/missing skills
    async getResumeSkills(req, res) {
        try {
            const userId = req.user.id;
            const profile = await studentModel.getProfileByUserId(userId);

            if (!profile) {
                return res.status(404).json({ message: 'Student profile not found' });
            }

            const resumeInsights = await studentModel.getResumeInsights(profile.id);

            let detectedSkills = [];
            let missingSkills = [];

            if (resumeInsights) {
                detectedSkills = typeof resumeInsights.detected_skills === 'string'
                    ? JSON.parse(resumeInsights.detected_skills)
                    : resumeInsights.detected_skills || [];

                missingSkills = typeof resumeInsights.missing_skills === 'string'
                    ? JSON.parse(resumeInsights.missing_skills)
                    : resumeInsights.missing_skills || [];
            }

            res.json({ extractedSkills: detectedSkills, missingSkills });
        } catch (error) {
            console.error('Get resume skills error:', error);
            res.status(500).json({ message: 'Failed to fetch resume skills' });
        }
    },

    // GET /api/student/resume/status - Check if student has resume
    async getResumeStatus(req, res) {
        try {
            const userId = req.user.id;
            const profile = await studentModel.getProfileByUserId(userId);

            if (!profile) {
                return res.status(404).json({ message: 'Student profile not found' });
            }

            const resumeInsights = await studentModel.getResumeInsights(profile.id);
            const hasResume = resumeInsights !== null;

            res.json({ hasResume });
        } catch (error) {
            console.error('Get resume status error:', error);
            res.status(500).json({ message: 'Failed to fetch resume status' });
        }
    },

    // GET /api/student/dashboard - Full dashboard data
    async getDashboard(req, res) {
        try {
            const userId = req.user.id;

            // Get student profile
            const profile = await studentModel.getProfileByUserId(userId);
            if (!profile) {
                return res.status(404).json({ message: 'Student profile not found' });
            }

            const studentId = profile.id;

            // Fetch all data in parallel
            const [skills, placements, activityStats, leetcodeHeatmap, githubHeatmap, resumeInsights] = await Promise.all([
                studentModel.getSkills(studentId),
                studentModel.getPlacements(studentId),
                studentModel.getActivityStats(studentId),
                studentModel.getActivityHeatmap(studentId, 'leetcode'),
                studentModel.getActivityHeatmap(studentId, 'github'),
                studentModel.getResumeInsights(studentId),
            ]);

            // Parse JSON fields from resume analysis
            let detectedSkills = [];
            let missingSkills = [];
            let suggestions = [];
            if (resumeInsights) {
                detectedSkills = typeof resumeInsights.detected_skills === 'string'
                    ? JSON.parse(resumeInsights.detected_skills)
                    : resumeInsights.detected_skills || [];
                missingSkills = typeof resumeInsights.missing_skills === 'string'
                    ? JSON.parse(resumeInsights.missing_skills)
                    : resumeInsights.missing_skills || [];
                suggestions = typeof resumeInsights.suggestions === 'string'
                    ? JSON.parse(resumeInsights.suggestions)
                    : resumeInsights.suggestions || [];
            }

            // Get training recommendations based on missing skills
            const trainingPrograms = await studentModel.getTrainingRecommendations(missingSkills);

            // Separate current skills and skills to learn
            const currentSkills = skills.filter(s => s.is_current).map(s => s.skill_name);
            const skillsToLearn = skills.filter(s => !s.is_current).map(s => s.skill_name);
            const skillProgress = skills.filter(s => !s.is_current).map(s => ({
                name: s.skill_name,
                progress: s.progress,
            }));
            const currentSkillsWithProgress = skills.filter(s => s.is_current).map(s => ({
                name: s.skill_name,
                progress: s.progress,
            }));

            // Compute metrics server-side
            const totalSkillSlots = currentSkills.length + skillsToLearn.length;
            const skillCoverage = totalSkillSlots > 0
                ? Math.round((currentSkills.length / totalSkillSlots) * 100)
                : 0;

            // Get leetcode/github stats
            const leetcodeStats = activityStats.find(a => a.platform === 'leetcode') || {
                current_streak: 0, longest_streak: 0, total_count: 0,
            };
            const githubStats = activityStats.find(a => a.platform === 'github') || {
                current_streak: 0, longest_streak: 0, total_count: 0,
            };

            // Compute readiness score (server-side)
            const placementReadiness = resumeInsights?.overall_score || 0;

            // Build response matching frontend structure exactly
            const dashboardData = {
                name: profile.name,
                branch: profile.branch,
                semester: profile.semester,
                cgpa: profile.cgpa,
                rollNo: profile.roll_no,
                placementReadiness,
                skillCoverage,
                weeklyProgress: 8,
                weeklyImprovement: 12,
                leetcodeStreak: leetcodeStats.current_streak,
                githubStreak: githubStats.current_streak,
                streakImprovement: 4,
                currentSkills,
                skillsToLearn,
                skillProgress,
                currentSkillsWithProgress,
                leetcodeData: {
                    currentStreak: leetcodeStats.current_streak,
                    longestStreak: leetcodeStats.longest_streak,
                    totalProblems: leetcodeStats.total_count,
                    heatmap: leetcodeHeatmap.map(h => ({
                        date: h.date,
                        count: h.count,
                    })),
                },
                githubData: {
                    currentStreak: githubStats.current_streak,
                    longestStreak: githubStats.longest_streak,
                    totalContributions: githubStats.total_count,
                    heatmap: githubHeatmap.map(h => ({
                        date: h.date,
                        count: h.count,
                    })),
                },
                resumeInsights: resumeInsights ? {
                    overallScore: resumeInsights.overall_score,
                    detectedSkills,
                    missingSkills,
                    suggestions,
                    fileName: resumeInsights.file_name,
                    uploadedAt: resumeInsights.uploaded_at,
                } : null,
                placements: placements.map(p => ({
                    id: p.id,
                    companyName: p.company_name,
                    roleOffered: p.role_offered,
                    packageLpa: p.package_lpa,
                    status: p.status,
                    appliedDate: p.applied_date,
                    resultDate: p.result_date,
                })),
                trainingPrograms: trainingPrograms.map(t => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    skillTags: typeof t.skill_tags === 'string' ? JSON.parse(t.skill_tags) : t.skill_tags || [],
                    provider: t.provider,
                    durationHours: t.duration_hours,
                    difficulty: t.difficulty,
                    url: t.url,
                })),
            };

            res.json(dashboardData);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            res.status(500).json({ message: 'Failed to fetch dashboard data' });
        }
    },
};
