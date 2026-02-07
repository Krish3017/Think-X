import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Target, FileText, BarChart3, Search, Bell, Sparkles, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

export default function StudentAnalytics() {
  const studentsData = [
    { name: "Rahul Sharma", readiness: 88, probability: 92, risk: "Low", consistency: 85 },
    { name: "Priya Patel", readiness: 82, probability: 86, risk: "Low", consistency: 78 },
    { name: "Amit Kumar", readiness: 76, probability: 78, risk: "Medium", consistency: 72 },
    { name: "Sneha Reddy", readiness: 72, probability: 68, risk: "Medium", consistency: 65 },
    { name: "Vikram Singh", readiness: 58, probability: 52, risk: "High", consistency: 48 },
    { name: "Anjali Gupta", readiness: 54, probability: 48, risk: "High", consistency: 42 },
    { name: "Rohan Mehta", readiness: 48, probability: 42, risk: "High", consistency: 38 },
  ];

  const readinessDistribution = [
    { range: "80-100", count: 28 },
    { range: "60-79", count: 72 },
    { range: "40-59", count: 58 },
    { range: "0-39", count: 22 },
  ];

  const topPerformers = studentsData.slice(0, 3);
  const lowPerformers = studentsData.slice(-3).reverse();

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-emerald-400 bg-emerald-500/10";
    if (risk === "Medium") return "text-amber-400 bg-amber-500/10";
    return "text-red-400 bg-red-500/10";
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
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

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold mb-0.5">Student Performance Analytics</h1>
              <p className="text-sm text-gray-500">Identify strong and weak students across the batch</p>
            </div>

            {/* Top Row - Distribution & Rankings */}
            <div className="grid grid-cols-3 gap-4">
              {/* Readiness Distribution */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-semibold mb-3">Readiness Score Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={readinessDistribution} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                      <XAxis dataKey="range" stroke="#333" tick={{ fill: '#999', fontSize: 10 }} />
                      <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Top Performers */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold">Top Performers</h3>
                </div>
                <div className="space-y-2">
                  {topPerformers.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <span className="text-xs text-emerald-400 font-semibold">{idx + 1}</span>
                        </div>
                        <span className="text-xs text-gray-300">{student.name}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{student.readiness}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Low Performers */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold">Low Performers</h3>
                </div>
                <div className="space-y-2">
                  {lowPerformers.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs text-gray-300">{student.name}</span>
                      </div>
                      <span className="text-sm font-bold text-red-400">{student.readiness}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Student Performance Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold mb-3">Student Performance Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-xs font-medium text-gray-400 pb-3">Student Name</th>
                      <th className="text-center text-xs font-medium text-gray-400 pb-3">Readiness Score</th>
                      <th className="text-center text-xs font-medium text-gray-400 pb-3">Placement Probability</th>
                      <th className="text-center text-xs font-medium text-gray-400 pb-3">Consistency</th>
                      <th className="text-center text-xs font-medium text-gray-400 pb-3">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData.map((student, idx) => (
                      <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                        <td className="py-3 text-sm text-gray-300">{student.name}</td>
                        <td className="py-3 text-center">
                          <span className="text-sm font-semibold">{student.readiness}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="text-sm font-semibold">{student.probability}%</span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{ width: `${student.consistency}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{student.consistency}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded ${getRiskColor(student.risk)}`}>
                            {student.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
