import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientBars } from '@/components/ui/GradientBars';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

// Helper to parse comma or newline separated skills, with optional progress like "React:30"
function parseSkillList(input: string) {
    return input
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(entry => {
            const [namePart, progPart] = entry.split(':').map(p => p.trim());
            const progress = progPart ? Number(progPart) : undefined;
            return { name: namePart, progress: Number.isFinite(progress) ? progress : undefined };
        });
}

// Helper for plain skill names (no progress parsing)
function parseSkillNames(input: string) {
    return input
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(Boolean);
}

export default function SignUpSkills() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [currentSkillsRaw, setCurrentSkillsRaw] = useState('Python, JavaScript, SQL');
    const [learningSkillsRaw, setLearningSkillsRaw] = useState('React:20, AWS:15, Docker:10');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedSkillsRaw, setExtractedSkillsRaw] = useState('Python, JavaScript, SQL');
    const [missingSkillsRaw, setMissingSkillsRaw] = useState('React, AWS, Docker');

    useEffect(() => {
        if (!loading && (!user || user.role !== 'student')) {
            navigate('/signin', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const currentSkills = parseSkillList(currentSkillsRaw);
            const learningSkills = parseSkillList(learningSkillsRaw);
            const extractedSkills = parseSkillNames(extractedSkillsRaw);
            const missingSkills = parseSkillNames(missingSkillsRaw);

            await apiService.saveStudentSkills({
                currentSkills,
                learningSkills,
                extractedSkills,
                missingSkills,
            });
            navigate('/student/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to save skills');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative">
            <GradientBars />
            <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-6 w-[380px] shadow-2xl z-10 relative">
                <h1 className="text-2xl font-bold text-white text-center">Add Your Skills</h1>
                <p className="text-gray-400 text-center text-sm mt-1">Current skills and skills to learn (for dashboard)</p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Current skills (comma or new line, optional progress as name:percent)</label>
                        <textarea
                            className="w-full min-h-[90px] px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                            value={currentSkillsRaw}
                            onChange={(e) => setCurrentSkillsRaw(e.target.value)}
                            placeholder="Python:80, JavaScript:65, SQL:60"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Skills to learn (comma or new line, optional progress as name:percent)</label>
                        <textarea
                            className="w-full min-h-[90px] px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                            value={learningSkillsRaw}
                            onChange={(e) => setLearningSkillsRaw(e.target.value)}
                            placeholder="React:20, AWS:15, Docker:10"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Your strongest skills (comma or new line)</label>
                        <textarea
                            className="w-full min-h-[70px] px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                            value={extractedSkillsRaw}
                            onChange={(e) => setExtractedSkillsRaw(e.target.value)}
                            placeholder="Python, JavaScript, SQL"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Skills you are missing (comma or new line)</label>
                        <textarea
                            className="w-full min-h-[70px] px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                            value={missingSkillsRaw}
                            onChange={(e) => setMissingSkillsRaw(e.target.value)}
                            placeholder="React, AWS, Docker"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                        type="submit"
                        disabled={saving}
                        className="relative group w-full h-10 rounded-lg mt-2 text-white bg-[#0f0f10] text-sm font-medium border-white/15 border transition-all overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10">{saving ? 'Saving...' : 'Save & Continue'}</span>
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#38BDF8]/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-[1600ms] ease-[cubic-bezier(0.45,0,0.2,1)] transition blur-sm" />
                    </button>
                </form>
            </div>
        </div>
    );
}
