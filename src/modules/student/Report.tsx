import { motion } from 'framer-motion';
import { Home, FileText, Target, Bell, Search, Award, Brain, Sparkles, TrendingUp, Shield, Flame, Download, Share2, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Report() {
  const reportData = {
    student: {
      name: "Alex Johnson",
      branch: "Computer Science",
      year: "3rd Year",
      profileCompleteness: 85,
    },
    reportDate: "May 15, 2024",
    readinessScore: 72,
    placementProbability: 68,
    resumeStrength: 72,
    consistencyScore: 78,
    skillCoverage: 58,
    topSkillGaps: ["React", "AWS", "Machine Learning"],
    leetcodeStreak: 12,
    githubStreak: 8,
    insights: [
      "Improving React & AWS increases placement probability by 28%",
      "Resume lacks measurable project outcomes",
      "Consistency score is above batch average (+12%)",
    ],
    actionPlan: [
      { step: 1, action: "Complete React course and build 2 projects", priority: "High" },
      { step: 2, action: "Add quantifiable achievements to resume", priority: "High" },
      { step: 3, action: "Maintain 15+ day coding streak", priority: "Medium" },
    ],
    riskFactors: [
      { risk: "Missing critical frontend skills (React, TypeScript)", severity: "High" },
      { risk: "Resume lacks quantifiable project outcomes", severity: "High" },
      { risk: "Limited cloud platform experience", severity: "Medium" },
    ],
    strengths: [
      "Strong consistency in problem-solving (12-day LeetCode streak)",
      "Above-average GitHub activity and project contributions",
      "Solid foundation in Python, JavaScript, and SQL",
      "Resume is 82% ATS-compatible",
    ],
    finalRecommendation: {
      status: "Almost Ready",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      message: "Strong foundation with key gaps. Focus on React & AWS for 4-6 weeks to become placement-ready.",
    },
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "text-emerald-400" };
    if (score >= 60) return { text: "Good", color: "text-blue-400" };
    return { text: "Needs Work", color: "text-amber-400" };
  };

  const level = getScoreLevel(reportData.readinessScore);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">HireLens</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/student/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
          </Link>
          <Link to="/student/resume">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Resume Insights</span>
            </div>
          </Link>
          <Link to="/student/report">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Report</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="h-16 bg-[#0A0A0A] border-b border-white/[0.06] flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search..." className="w-full h-10 pl-10 pr-4 bg-[#050505] border border-white/[0.06] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-lg bg-[#050505] border border-white/[0.06] flex items-center justify-center hover:border-blue-500/30 transition">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-sm font-semibold">AJ</span>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Page Header */}
            <div className="mb-3">
              <h1 className="text-2xl font-semibold mb-0.5">Am I placement-ready overall?</h1>
              <p className="text-sm text-gray-500 mb-3">Final executive summary & decision-making view</p>
              <div className="flex items-center gap-6 text-xs text-gray-400">
                <span>{reportData.student.name}</span>
                <span>•</span>
                <span>{reportData.student.branch} • {reportData.student.year}</span>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{reportData.reportDate}</span>
                </div>
                <span>•</span>
                <span>Profile: {reportData.student.profileCompleteness}%</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="grid grid-cols-4 gap-4">
              {/* Overall Readiness */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-medium text-gray-400 mb-0.5">Overall Readiness</h3>
                    <p className={`text-sm font-semibold ${level.color}`}>{level.text}</p>
                  </div>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <defs>
                      <linearGradient id="reportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-white/[0.03]" />
                    <circle cx="40" cy="40" r="36" stroke="url(#reportGradient)" strokeWidth="6" fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - reportData.readinessScore / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{reportData.readinessScore}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 text-center">Final assessment score</p>
              </motion.div>

              {/* Placement Probability */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Placement Probability</h3>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{reportData.placementProbability}%</div>
                <p className="text-[10px] text-gray-500 mb-2">vs placed students</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8% this month</span>
                </div>
              </motion.div>

              {/* Resume Strength Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Resume Strength</h3>
                  <FileText className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{reportData.resumeStrength}</div>
                <p className="text-[10px] text-gray-500 mb-2">out of 100</p>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400">82% ATS compatible</span>
                </div>
              </motion.div>

              {/* Consistency Score */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Consistency Score</h3>
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-3xl font-bold mb-2">{reportData.consistencyScore}%</div>
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${reportData.consistencyScore}%`, boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)' }} />
                </div>
                <p className="text-[10px] text-gray-500">Aggregated activity</p>
              </motion.div>
            </div>

            {/* Skill Analysis Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold mb-3">Skill Analysis Summary</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Coverage: {reportData.skillCoverage}% (vs 72% average)</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-gray-500">Top 3 Gaps:</span>
                    {reportData.topSkillGaps.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-32 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${reportData.skillCoverage}%` }} />
                </div>
              </div>
            </motion.div>

            {/* Risk Factors & Strengths */}
            <div className="grid grid-cols-2 gap-4">
              {/* Risk Factors */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold">Risk Factors</h3>
                </div>
                <div className="space-y-2">
                  {reportData.riskFactors.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                      <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-300">{item.risk}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded flex-shrink-0 ${item.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                        {item.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Strength Highlights */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold">Strength Highlights</h3>
                </div>
                <div className="space-y-2">
                  {reportData.strengths.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-blue-500/20 p-4" style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">Key AI Insights</h3>
              </div>
              <div className="space-y-2">
                {reportData.insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-300 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Final Recommendation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className={`${reportData.finalRecommendation.bgColor} rounded-2xl border ${reportData.finalRecommendation.borderColor} p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold">Final Recommendation</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 ${reportData.finalRecommendation.bgColor} border ${reportData.finalRecommendation.borderColor} rounded-lg`}>
                  <span className={`text-lg font-bold ${reportData.finalRecommendation.color}`}>{reportData.finalRecommendation.status}</span>
                </div>
                <p className="text-sm text-gray-300 flex-1">{reportData.finalRecommendation.message}</p>
              </div>
            </motion.div>

            {/* Action Plan */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold">Recommended Action Plan</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {reportData.actionPlan.map((item) => (
                  <div key={item.step} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <span className="text-xs text-blue-400 font-semibold">{item.step}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${item.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.action}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Export Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex items-center justify-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all">
                <Download className="w-4 h-4" />
                Download Report (PDF)
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg text-sm font-medium transition-all">
                <Share2 className="w-4 h-4" />
                Share with T&P Cell
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
