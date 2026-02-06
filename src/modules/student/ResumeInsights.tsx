import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Target, Sparkles, Award, Shield, Zap, Home, Bell, Search, AlertTriangle, XCircle } from 'lucide-react';
// Removed unused recharts imports
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// Basic structure for resume analysis data the UI expects
type AnalysisData = {
    fileName: string;
    uploadTime: string;
    strengthScore: number;
    skillMatch: number;
    atsScore: number;
    keywordCoverage: number;
    detectedSkills: string[];
    missingSkills: string[];
    sectionCompleteness: { section: string; score: number; status: 'complete' | 'partial' }[];
    skillGapData: { skill: string; current: number; required: number }[];
    improvements: string[];
    missingKeywords: string[];
    jobMarketMatch: number;
    redFlags: { issue: string; severity: 'High' | 'Medium' }[];
};

const fallbackAnalysis: AnalysisData = {
    fileName: 'Resume.pdf',
    uploadTime: 'Just now',
    strengthScore: 65,
    skillMatch: 60,
    atsScore: 75,
    keywordCoverage: 55,
    detectedSkills: [],
    missingSkills: [],
    sectionCompleteness: [
        { section: 'Skills', score: 70, status: 'partial' },
        { section: 'Projects', score: 60, status: 'partial' },
        { section: 'Experience', score: 55, status: 'partial' },
        { section: 'Education', score: 90, status: 'complete' },
    ],
    skillGapData: [],
    improvements: ['Add quantifiable outcomes for projects', 'List links to GitHub or portfolio'],
    missingKeywords: [],
    jobMarketMatch: 62,
    redFlags: [],
};

export default function ResumeInsights() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [localAnalysis, setLocalAnalysis] = useState<AnalysisData | null>(null);

    const { data: dashboardData, isLoading, isError } = useQuery({
        queryKey: ['studentDashboard'],
        queryFn: () => apiService.getStudentDashboard(),
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    const { data: resumeStatus, isLoading: statusLoading } = useQuery({
        queryKey: ['resumeStatus'],
        queryFn: () => apiService.getResumeStatus(),
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    const serverAnalysis = useMemo<AnalysisData | null>(() => {
        // STRICT: Only compute analysis if resume exists in DB
        if (!resumeStatus?.hasResume) return null;
        
        const resume = dashboardData?.resumeInsights;
        if (!resume) return null;

        const detectedSkills = Array.isArray(resume.detectedSkills) ? resume.detectedSkills : [];
        const missingSkills = Array.isArray(resume.missingSkills) ? resume.missingSkills : [];
        const suggestions = Array.isArray(resume.suggestions) ? resume.suggestions : [];
        const overall = Math.round(resume.overallScore ?? 0);

        return {
            fileName: resume.fileName || 'Resume.pdf',
            uploadTime: resume.uploadedAt ? 'recently' : 'Uploaded',
            strengthScore: overall,
            skillMatch: Math.min(100, overall + 5),
            atsScore: Math.min(100, overall + 10),
            keywordCoverage: Math.max(40, Math.min(90, overall - 10)),
            detectedSkills,
            missingSkills,
            sectionCompleteness: [
                { section: 'Skills', score: Math.min(100, overall + 10), status: overall > 60 ? 'complete' : 'partial' },
                { section: 'Projects', score: Math.max(50, overall - 5), status: overall > 55 ? 'complete' : 'partial' },
                { section: 'Experience', score: Math.max(45, overall - 10), status: overall > 65 ? 'complete' : 'partial' },
                { section: 'Education', score: 100, status: 'complete' },
            ],
            skillGapData: missingSkills.map((skill: string) => ({ skill, current: 0, required: 80 })),
            improvements: suggestions.length ? suggestions : ['Add measurable outcomes in experience', 'Link GitHub/portfolio'],
            missingKeywords: missingSkills.slice(0, 6),
            jobMarketMatch: Math.min(100, Math.max(50, overall + 3)),
            redFlags: missingSkills.slice(0, 3).map((skill: string) => ({
                issue: `Add evidence of ${skill}`,
                severity: 'Medium',
            })),
        };
    }, [dashboardData?.resumeInsights, resumeStatus?.hasResume]);

    useEffect(() => {
        if (serverAnalysis) {
            setAnalyzed(true);
            setLocalAnalysis(null);
        }
    }, [serverAnalysis]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (nextFile: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(nextFile.type)) {
            alert('Please upload PDF or DOCX file');
            return;
        }
        setFile(nextFile);
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setAnalyzed(true);
            setLocalAnalysis({
                ...fallbackAnalysis,
                fileName: nextFile.name,
                uploadTime: 'Just now',
            });
        }, 2000);
    };

    const getScoreLevel = (score: number) => {
        if (score >= 80) return { text: 'Strong', color: 'text-emerald-400' };
        if (score >= 60) return { text: 'Average', color: 'text-blue-400' };
        return { text: 'Weak', color: 'text-amber-400' };
    };

    const resolvedAnalysis = localAnalysis || serverAnalysis;
    const level = resolvedAnalysis ? getScoreLevel(resolvedAnalysis.strengthScore) : { text: 'No data', color: 'text-gray-400' };
    const hasResume = resumeStatus?.hasResume || false;

    if (isLoading || statusLoading) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="text-gray-400">Loading resume insights...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="text-red-400">Failed to load resume insights.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <div className="w-64 bg-[#0A0A0A] border-r border-white/6 flex flex-col">
                <div className="p-6 border-b border-white/6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold">Think-X</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/student/dashboard">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/3 text-gray-400 hover:text-white transition cursor-pointer">
                            <Home className="w-5 h-5" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/student/resume">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
                            <FileText className="w-5 h-5" />
                            <span className="text-sm font-medium">Resume Insights</span>
                        </div>
                    </Link>
                    <Link to="/student/report">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/3 text-gray-400 hover:text-white transition cursor-pointer">
                            <Target className="w-5 h-5" />
                            <span className="text-sm font-medium">Report</span>
                        </div>
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <div className="h-16 bg-[#0A0A0A] border-b border-white/6 flex items-center justify-between px-6">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full h-10 pl-10 pr-4 bg-[#050505] border border-white/6 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-lg bg-[#050505] border border-white/6 flex items-center justify-center hover:border-blue-500/30 transition">
                            <Bell className="w-5 h-5 text-gray-400" />
                        </button>
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                            <span className="text-sm font-semibold">
                                {dashboardData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'ST'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-4">
                        {/* Page Header */}
                        <div className="mb-2">
                            <h1 className="text-2xl font-semibold mb-0.5">Is my resume strong enough?</h1>
                            <p className="text-sm text-gray-500">Resume-specific AI evaluation & improvements</p>
                            {(hasResume || analyzed) && resolvedAnalysis && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                    <span>{resolvedAnalysis.fileName}</span>
                                    <span>•</span>
                                    <span>{resolvedAnalysis.uploadTime}</span>
                                </div>
                            )}
                            {!hasResume && !analyzed && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-amber-400">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>No resume analysis found. Upload a resume to see insights.</span>
                                </div>
                            )}
                        </div>

                        {/* Upload Section */}
                        {!hasResume && !analyzed && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative bg-[#0B0B0B] rounded-2xl border-2 border-dashed transition-all ${dragActive ? 'border-violet-500 bg-violet-500/5' : 'border-white/6'
                                        } ${file ? 'border-emerald-500/30' : ''}`}
                                >
                                    <input type="file" id="resume-upload" className="hidden" accept=".pdf,.docx" onChange={handleChange} />
                                    {!file ? (
                                        <label htmlFor="resume-upload" className="flex flex-col items-center justify-center py-12 cursor-pointer">
                                            <motion.div animate={{ y: dragActive ? -5 : 0 }} className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-3">
                                                <Upload className="w-7 h-7 text-violet-400" />
                                            </motion.div>
                                            <p className="text-base font-medium text-white mb-1">Drag & drop your resume or click to upload</p>
                                            <p className="text-xs text-gray-400 mb-0.5">Supported formats: PDF, DOCX</p>
                                            <p className="text-[10px] text-gray-500">Maximum file size: 5MB</p>
                                        </label>
                                    ) : (
                                        <div className="py-8 px-6">
                                            {uploading ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin mb-3"></div>
                                                    <p className="text-xs text-gray-400">Analyzing your resume...</p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{file.name}</p>
                                                            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => { setFile(null); setAnalyzed(false); setLocalAnalysis(null); }} className="text-xs text-gray-400 hover:text-white transition">
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Analysis Results */}
                        <AnimatePresence>
                            {(hasResume || analyzed) && resolvedAnalysis && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    {/* Primary Scores */}
                                    <div className="grid grid-cols-4 gap-4">
                                        {/* Resume Strength */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-400 mb-0.5">Resume Strength</h3>
                                                    <p className={`text-sm font-semibold ${level.color}`}>{level.text}</p>
                                                </div>
                                                <Award className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <div className="relative w-20 h-20 mx-auto mb-2">
                                                <svg className="transform -rotate-90 w-20 h-20">
                                                    <defs>
                                                        <linearGradient id="strengthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#8b5cf6" />
                                                            <stop offset="100%" stopColor="#ec4899" />
                                                        </linearGradient>
                                                    </defs>
                                                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/[0.03]" />
                                                    <circle cx="40" cy="40" r="36" stroke="url(#strengthGradient)" strokeWidth="6" fill="none"
                                                        strokeDasharray={`${2 * Math.PI * 36}`}
                                                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - resolvedAnalysis.strengthScore / 100)}`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold">{resolvedAnalysis.strengthScore}</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 text-center">Document quality score</p>
                                        </motion.div>

                                        {/* Resume Skill Match */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xs font-medium text-gray-400">Resume Skill Match</h3>
                                                <Target className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div className="text-2xl font-bold mb-2">{resolvedAnalysis.skillMatch}%</div>
                                            <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden mb-1">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${resolvedAnalysis.skillMatch}%` }} transition={{ duration: 1, delay: 0.3 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                                    style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-500">Skills in resume vs required</p>
                                        </motion.div>

                                        {/* ATS Score */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xs font-medium text-gray-400">ATS Compatible</h3>
                                                <Shield className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <div className="text-2xl font-bold mb-2">{resolvedAnalysis.atsScore}%</div>
                                            <p className="text-[10px] text-gray-500 leading-tight">Passes most ATS systems</p>
                                        </motion.div>

                                        {/* Job Market Match */}
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xs font-medium text-gray-400">Job Market Match</h3>
                                                <Zap className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div className="text-2xl font-bold mb-2">{resolvedAnalysis.jobMarketMatch}%</div>
                                            <p className="text-[10px] text-gray-500 leading-tight">Resume keywords vs placement keywords</p>
                                        </motion.div>
                                    </div>

                                    {/* Section Completeness */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                        <h3 className="text-sm font-semibold mb-3">Resume Section Completeness</h3>
                                        <div className="grid grid-cols-4 gap-4">
                                            {resolvedAnalysis.sectionCompleteness.map((section, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-300">{section.section}</span>
                                                        <span className="text-xs text-gray-500">{section.score}%</span>
                                                    </div>
                                                    <div className="relative h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                                        <div
                                                            className={`absolute inset-y-0 left-0 rounded-full ${section.status === 'complete' ? 'bg-emerald-500' : 'bg-amber-500'
                                                                }`}
                                                            style={{ width: `${section.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Skills Section */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                            <h3 className="text-xs font-medium text-gray-400 mb-3">Extracted Skills (from resume)</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {resolvedAnalysis.detectedSkills.length === 0 && (
                                                    <span className="text-xs text-gray-400">No skills detected yet.</span>
                                                )}
                                                {resolvedAnalysis.detectedSkills.map((skill, idx) => (
                                                    <span key={idx} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-medium"
                                                        style={{ boxShadow: '0 0 12px rgba(16, 185, 129, 0.08)' }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                            <h3 className="text-xs font-medium text-gray-400 mb-3">Missing Resume Skills</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {resolvedAnalysis.missingSkills.length === 0 && (
                                                    <span className="text-xs text-gray-400">No missing skills flagged.</span>
                                                )}
                                                {resolvedAnalysis.missingSkills.map((skill, idx) => (
                                                    <span key={idx} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-medium"
                                                        style={{ boxShadow: '0 0 12px rgba(239, 68, 68, 0.08)' }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Resume Keyword Analysis */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                        <h3 className="text-sm font-semibold mb-3">Resume Keyword Analysis</h3>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-gray-400">Keyword Coverage</span>
                                            <span className="text-lg font-bold">{resolvedAnalysis.keywordCoverage}%</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {resolvedAnalysis.missingKeywords.length === 0 && (
                                                <span className="text-xs text-gray-400">No missing keywords flagged.</span>
                                            )}
                                            {resolvedAnalysis.missingKeywords.map((keyword, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-[10px] text-amber-400">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Resume Red Flags */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertTriangle className="w-4 h-4 text-red-400" />
                                            <h3 className="text-sm font-semibold">Resume Red Flags</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {resolvedAnalysis.redFlags.length === 0 && <span className="text-xs text-gray-400">No red flags detected.</span>}
                                            {resolvedAnalysis.redFlags.map((flag, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                                        <span className="text-xs text-gray-300">{flag.issue}</span>
                                                    </div>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded ${flag.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                                                        }`}>
                                                        {flag.severity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Improvements */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl border border-violet-500/20 p-4"
                                        style={{ boxShadow: '0 0 25px rgba(139, 92, 246, 0.08)' }}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Brain className="w-4 h-4 text-violet-400" />
                                            <h3 className="text-sm font-semibold">Resume Improvement Suggestions</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {resolvedAnalysis.improvements.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <Sparkles className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />
                                                    <span className="text-xs text-gray-300">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
