import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Target, FileText, BarChart3, Search, Bell, Sparkles, Download, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

export default function Reports() {
  const historicalData = [
    { year: "2020", placementRate: 58, avgPackage: 6.2 },
    { year: "2021", placementRate: 62, avgPackage: 6.8 },
    { year: "2022", placementRate: 65, avgPackage: 7.5 },
    { year: "2023", placementRate: 68, avgPackage: 8.5 },
  ];

  const reports = [
    {
      title: "Batch Placement Report",
      description: "Complete placement analytics for AY 2023-24",
      type: "Batch Overview",
      lastGenerated: "2 hours ago",
      size: "2.4 MB",
    },
    {
      title: "Skill Gap Analysis Report",
      description: "Department-wise skill deficiency analysis",
      type: "Skill Analysis",
      lastGenerated: "5 hours ago",
      size: "1.8 MB",
    },
    {
      title: "Student Risk Assessment",
      description: "High-risk students requiring intervention",
      type: "Risk Analysis",
      lastGenerated: "1 day ago",
      size: "1.2 MB",
    },
    {
      title: "Resume Quality Report",
      description: "Batch-wide resume health metrics",
      type: "Resume Analytics",
      lastGenerated: "3 days ago",
      size: "1.5 MB",
    },
  ];

  const quickStats = {
    totalReports: 24,
    lastExport: "2 hours ago",
    avgGenerationTime: "3.2 sec",
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Resume Analytics</span>
            </div>
          </Link>
          <Link to="/admin/reports">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
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
              <input type="text" placeholder="Search reports..." className="w-full h-10 pl-10 pr-4 bg-[#050505] border border-white/[0.06] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30" />
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
              <h1 className="text-2xl font-semibold mb-0.5">Placement Reports & Export</h1>
              <p className="text-sm text-gray-500">Decision-ready outputs and historical comparisons</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Total Reports</h3>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{quickStats.totalReports}</div>
                <p className="text-[10px] text-gray-500">Generated this year</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Last Export</h3>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold mb-1">{quickStats.lastExport}</div>
                <p className="text-[10px] text-gray-500">Batch placement report</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Avg Generation Time</h3>
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-3xl font-bold mb-1">{quickStats.avgGenerationTime}</div>
                <p className="text-[10px] text-gray-500">Per report</p>
              </motion.div>
            </div>

            {/* Historical Trends */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold mb-3">Historical Placement Trends (Year-wise)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Placement Rate Trend</p>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <XAxis dataKey="year" stroke="#333" tick={{ fill: '#999', fontSize: 10 }} />
                        <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="placementRate" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Average Package Trend</p>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <XAxis dataKey="year" stroke="#333" tick={{ fill: '#999', fontSize: 10 }} />
                        <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="avgPackage" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Available Reports */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold mb-3">Available Reports</h3>
              <div className="space-y-3">
                {reports.map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:border-blue-500/20 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-0.5">{report.title}</h4>
                        <p className="text-xs text-gray-400 mb-1">{report.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                          <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded">{report.type}</span>
                          <span>•</span>
                          <span>Last generated: {report.lastGenerated}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Generate New Report */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-blue-500/20 p-4" style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.08)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Generate Custom Report</h3>
                  <p className="text-xs text-gray-400">Create a new report with custom parameters and filters</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all">
                  <Sparkles className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
