import { motion } from 'framer-motion';
import { LayoutDashboard, Users, TrendingUp, AlertTriangle, Award, Target, Brain, Search, Bell, Sparkles, FileText, BarChart3, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const dashboardData = {
    placementRate: 68,
    yoyChange: 12,
    avgPackage: "8.5 LPA",
    highestPackage: "24 LPA",
    totalStudents: 180,
    atRiskCount: 42,
    readinessDistribution: [
      { name: "Excellent", value: 28, color: "#10b981" },
      { name: "Good", value: 72, color: "#3b82f6" },
      { name: "Needs Work", value: 80, color: "#f59e0b" },
    ],
    topHiringSkills: [
      { skill: "React", demand: 85 },
      { skill: "Python", demand: 78 },
      { skill: "AWS", demand: 72 },
      { skill: "Node.js", demand: 68 },
      { skill: "SQL", demand: 65 },
    ],
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
              <span className="text-lg font-semibold block">Think-X</span>
              <span className="text-[10px] text-gray-500">Admin Panel</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
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
              <input type="text" placeholder="Search students..." className="w-full h-10 pl-10 pr-4 bg-[#050505] border border-white/[0.06] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30" />
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

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold mb-0.5">Batch Performance Overview</h1>
              <p className="text-sm text-gray-500">High-level placement analytics for AY 2023-24</p>
            </div>

            {/* Top Row - Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              {/* Placement Rate */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Placement Rate</h3>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{dashboardData.placementRate}%</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{dashboardData.yoyChange}% YoY</span>
                </div>
              </motion.div>

              {/* Average Package */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Average Package</h3>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{dashboardData.avgPackage}</div>
                <p className="text-[10px] text-gray-500">Across all placements</p>
              </motion.div>

              {/* Highest Package */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Highest Package</h3>
                  <Award className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{dashboardData.highestPackage}</div>
                <p className="text-[10px] text-gray-500">Top offer this year</p>
              </motion.div>

              {/* At-Risk Students */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B0B0B] rounded-2xl border border-red-500/10 p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">At-Risk Students</h3>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-red-400 mb-1">{dashboardData.atRiskCount}</div>
                <p className="text-[10px] text-gray-500">Below readiness threshold</p>
              </motion.div>
            </div>

            {/* Middle Row - Distribution & Skills */}
            <div className="grid grid-cols-3 gap-4">
              {/* Readiness Distribution */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-2 bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-semibold mb-3">Placement Readiness Distribution</h3>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dashboardData.readinessDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                          {dashboardData.readinessDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {dashboardData.readinessDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs text-gray-300">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.value}</span>
                          <span className="text-xs text-gray-500">({Math.round((item.value / dashboardData.totalStudents) * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Top Hiring Skills */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-semibold mb-3">Top Hiring Skills</h3>
                <div className="space-y-3">
                  {dashboardData.topHiringSkills.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-300">{item.skill}</span>
                        <span className="text-xs text-gray-500">{item.demand}%</span>
                      </div>
                      <div className="relative h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${item.demand}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-blue-500/20 p-4" style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">AI-Generated Insights</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300">React & AWS training could increase placement rate by <span className="text-emerald-400 font-bold">19%</span></p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300"><span className="text-red-400 font-bold">42 students</span> are below readiness threshold</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300">Resume quality is the biggest bottleneck for <span className="text-amber-400 font-bold">28%</span> of batch</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all">
                <Download className="w-4 h-4" />
                Export Batch Report
              </button>
              <Link to="/admin/students">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg text-sm font-medium transition-all">
                  View Student Analytics
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
