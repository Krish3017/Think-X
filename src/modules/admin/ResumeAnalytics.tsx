import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Target, FileText, BarChart3, Search, Bell, Sparkles, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function ResumeAnalytics() {
  const resumeData = {
    avgStrength: 68,
    completionRate: 82,
    atsCompatibilityDist: [
      { range: "80-100%", count: 45, color: "#10b981" },
      { range: "60-79%", count: 78, color: "#3b82f6" },
      { range: "40-59%", count: 42, color: "#f59e0b" },
      { range: "0-39%", count: 15, color: "#ef4444" },
    ],
    commonWeaknesses: [
      { issue: "Missing quantifiable metrics", count: 128, severity: "High" },
      { issue: "Weak action verbs", count: 98, severity: "Medium" },
      { issue: "No GitHub/Portfolio links", count: 86, severity: "High" },
      { issue: "Poor formatting", count: 72, severity: "Medium" },
      { issue: "Incomplete project descriptions", count: 64, severity: "High" },
    ],
    sectionCompleteness: [
      { section: "Skills", completion: 92 },
      { section: "Projects", completion: 78 },
      { section: "Experience", completion: 65 },
      { section: "Education", completion: 98 },
      { section: "Certifications", completion: 48 },
    ],
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "High") return "text-red-400 bg-red-500/10";
    return "text-amber-400 bg-amber-500/10";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-semibold block">HireLens</span>
              <span className="text-[10px] text-gray-500">Admin Panel</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Overview</span>
            </div>
          </Link>
          <Link to="/admin/students">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Student Analytics</span>
            </div>
          </Link>
          <Link to="/admin/skills">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Skill Analysis</span>
            </div>
          </Link>
          <Link to="/admin/resumes">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Resume Analytics</span>
            </div>
          </Link>
          <Link to="/admin/reports">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Reports</span>
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
              <input type="text" placeholder="Search resumes..." className="w-full h-10 pl-10 pr-4 bg-[#050505] border border-white/[0.06] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-lg bg-[#050505] border border-white/[0.06] flex items-center justify-center hover:border-blue-500/30 transition">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-sm font-semibold">TP</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold mb-0.5">Resume Quality Analytics</h1>
              <p className="text-sm text-gray-500">Overall resume health of the batch</p>
            </div>

            {/* Top Row - Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {/* Average Resume Strength */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Average Resume Strength</h3>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold mb-2">{resumeData.avgStrength}/100</div>
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${resumeData.avgStrength}%` }} />
                </div>
              </motion.div>

              {/* Resume Completion Rate */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Resume Completion Rate</h3>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold mb-2">{resumeData.completionRate}%</div>
                <p className="text-[10px] text-gray-500">Students with complete resumes</p>
              </motion.div>

              {/* Critical Issues */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B0B0B] rounded-2xl border border-red-500/10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Critical Issues</h3>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-red-400 mb-2">278</div>
                <p className="text-[10px] text-gray-500">High-severity resume problems</p>
              </motion.div>
            </div>

            {/* Middle Row - ATS Distribution & Section Completeness */}
            <div className="grid grid-cols-2 gap-4">
              {/* ATS Compatibility Distribution */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-semibold mb-3">ATS Compatibility Distribution</h3>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={resumeData.atsCompatibilityDist} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="count">
                          {resumeData.atsCompatibilityDist.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {resumeData.atsCompatibilityDist.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs text-gray-300">{item.range}</span>
                        </div>
                        <span className="text-sm font-bold">{item.count} students</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Section Completeness */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-semibold mb-3">Section Completeness</h3>
                <div className="space-y-3">
                  {resumeData.sectionCompleteness.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-300">{item.section}</span>
                        <span className="text-xs text-gray-500">{item.completion}%</span>
                      </div>
                      <div className="relative h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className={`absolute inset-y-0 left-0 rounded-full ${item.completion >= 80 ? 'bg-emerald-500' : item.completion >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                          }`} style={{ width: `${item.completion}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Common Resume Weaknesses */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold">Common Resume Weaknesses</h3>
              </div>
              <div className="space-y-2">
                {resumeData.commonWeaknesses.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                        <span className="text-xs text-red-400 font-semibold">{idx + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.issue}</h4>
                        <p className="text-xs text-gray-400">{item.count} students affected</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-blue-500/20 p-4" style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">AI-Generated Recommendations</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300">Resume quality is the biggest bottleneck for <span className="text-red-400 font-bold">28%</span> of batch</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300">Conduct workshop on <span className="text-blue-400 font-bold">quantifiable achievements</span> to improve resume strength</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
