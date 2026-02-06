import { studentModel } from '../models/studentModel.js';

export const studentController = {
    // POST /api/student/profile - Save/Update student profile
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { rollNo, name, branch, joinedYear, semester, cgpa } = req.body;

            if (!name || !rollNo || !branch || !joinedYear || !semester) {
                return res.status(400).json({ message: 'rollNo, name, branch, joinedYear, semester are required' });
            }

            await studentModel.upsertProfile({
                userId,
                rollNo,
                name,
                branch,
                joinedYear,
                semester,
                cgpa: cgpa ?? null,
            });

            res.json({ message: 'Profile saved' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Failed to save profile' });
        }
    },

    // POST /api/student/skills - Replace skills (current and learning)
    async updateSkills(req, res) {
        try {
            const userId = req.user.id;
            const {
                currentSkills = [],
                learningSkills = [],
                extractedSkills = [],
                missingSkills = [],
            } = req.body || {};

            // Resolve student_id
            const profile = await studentModel.getProfileByUserId(userId);
            if (!profile) {
                return res.status(404).json({ message: 'Student profile not found' });
            }

            await studentModel.replaceSkills(profile.id, { currentSkills, learningSkills });

            await studentModel.upsertResumeSkills(profile.id, {
                detectedSkills: extractedSkills,
                missingSkills,
            });

            res.json({ message: 'Skills saved' });
        } catch (error) {
            console.error('Update skills error:', error);
            res.status(500).json({ message: 'Failed to save skills' });
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
