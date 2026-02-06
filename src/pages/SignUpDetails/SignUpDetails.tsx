import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientBars } from '@/components/ui/GradientBars';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

export default function SignUpDetails() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [rollNo, setRollNo] = useState('');
    const [name, setName] = useState('');
    const [branch, setBranch] = useState('');
    const [joinedYear, setJoinedYear] = useState('');
    const [semester, setSemester] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'student')) {
            navigate('/signin', { replace: true });
        }
        if (user?.name) {
            setName(user.name);
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!rollNo || !name || !branch || !joinedYear || !semester) {
            setError('Please fill all required fields');
            return;
        }

        setSaving(true);
        try {
            await apiService.saveStudentProfile({
                rollNo,
                name,
                branch,
                joinedYear: Number(joinedYear),
                semester: Number(semester),
                cgpa: cgpa ? Number(cgpa) : undefined,
            });
            navigate('/signup/skills');
        } catch (err: any) {
            setError(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative">
            <GradientBars />
            <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-6 w-[360px] shadow-2xl z-10 relative">
                <h1 className="text-2xl font-bold text-white text-center">Complete Profile</h1>
                <p className="text-gray-400 text-center text-sm mt-1">Just once, to personalize your dashboard</p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                    <input
                        className="w-full h-10 px-3 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                        placeholder="Roll Number"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                    />
                    <input
                        className="w-full h-10 px-3 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full h-10 px-3 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                        placeholder="Branch (e.g., CSE)"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                    />
                    <input
                        className="w-full h-10 px-3 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                        placeholder="Joined Year (e.g., 2021)"
                        value={joinedYear}
                        onChange={(e) => setJoinedYear(e.target.value)}
                        type="number"
                    />
                    <input
                        className="w-full h-10 px-3 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                        placeholder="Semester (e.g., 6)"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        type="number"
                    />
                    <input
                        className="w-full h-10 px-3 rounded-lg bg-[#0f0f0f] border border-white/15 text-white text-sm outline-none"
                        placeholder="CGPA (optional)"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        type="number"
                        step="0.01"
                    />

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
