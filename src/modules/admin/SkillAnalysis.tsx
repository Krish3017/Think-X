import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Target, FileText, BarChart3, Search, Bell, Sparkles, Brain, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Link } from 'react-router-dom';

export default function SkillAnalysis() {
  const demandedSkills = [
    { skill: "React", frequency: 92 },
    { skill: "Python", frequency: 88 },
    { skill: "AWS", frequency: 82 },
    { skill: "Node.js", frequency: 78 },
    { skill: "TypeScript", frequency: 75 },
    { skill: "Docker", frequency: 72 },
    { skill: "MongoDB", frequency: 68 },
    { skill: "Machine Learning", frequency: 65 },
  ];

  const skillGapHeatmap = [
    { skill: "React", gap: 85, students: 142 },
    { skill: "AWS", gap: 78, students: 156 },
    { skill: "TypeScript", gap: 72, students: 128 },
    { skill: "Docker", gap: 68, students: 145 },
    { skill: "ML", gap: 65, students: 138 },
  ];

  const skillPlacementCorrelation = [
    { skill: "React", avgPackage: 9.2, placementRate: 85 },
    { skill: "AWS", avgPackage: 10.5, placementRate: 88 },
    { skill: "Python", avgPackage: 8.5, placementRate: 78 },
    { skill: "ML", avgPackage: 11.2, placementRate: 92 },
    { skill: "Node.js", avgPackage: 8.8, placementRate: 80 },
  ];

  const trainingPriority = [
    { skill: "React", priority: "Critical", impact: "28% placement increase", students: 142 },
    { skill: "AWS", priority: "Critical", impact: "24% placement increase", students: 156 },
    { skill: "Machine Learning", priority: "High", impact: "19% placement increase", students: 138 },
    { skill: "Docker", priority: "Medium", impact: "12% placement increase", students: 145 },
  ];

  const getPriorityColor = (priority: string) => {
    if (priority === "Critical") return "text-red-400 bg-red-500/10 border-red-500/20";
    if (priority === "High") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-blue-400 bg-blue-500/10 border-blue-500/20";
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
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
              <input type="text" placeholder="Search skills..." className="w-full h-10 pl-10 pr-4 bg-[#050505] border border-white/[0.06] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30" />
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
              <h1 className="text-2xl font-semibold mb-0.5">Skill Demand & Gap Analysis</h1>
              <p className="text-sm text-gray-500">Training & curriculum planning insights</p>
            </div>

            {/* Top Row - Demanded Skills & Gap Heatmap */}
            <div className="grid grid-cols-2 gap-4">
              {/* Most Demanded Skills */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-semibold mb-3">Most Demanded Skills (Industry)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demandedSkills} layout="vertical" margin={{ left: 80, right: 10, top: 5, bottom: 5 }}>
                      <XAxis type="number" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} />
                      <YAxis dataKey="skill" type="category" stroke="#333" tick={{ fill: '#999', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="frequency" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Batch Skill Gap Heatmap */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-semibold mb-3">Batch Skill Gap Heatmap</h3>
                <div className="space-y-3">
                  {skillGapHeatmap.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-300">{item.skill}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{item.students} students</span>
                          <span className="text-xs font-bold text-red-400">{item.gap}% gap</span>
                        </div>
                      </div>
                      <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-amber-500 rounded-full" style={{ width: `${item.gap}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Skill vs Placement Correlation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold mb-3">Skill vs Placement Correlation</h3>
              <div className="grid grid-cols-5 gap-3">
                {skillPlacementCorrelation.map((item, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-blue-400 mb-2">{item.skill}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">Avg Package</span>
                        <span className="text-xs font-bold text-emerald-400">{item.avgPackage} LPA</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">Placement Rate</span>
                        <span className="text-xs font-bold">{item.placementRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Training Priority List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold">Training Priority List</h3>
              </div>
              <div className="space-y-2">
                {trainingPriority.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:border-blue-500/20 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <span className="text-xs text-blue-400 font-semibold">{idx + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.skill}</h4>
                        <p className="text-xs text-gray-400">{item.students} students need training</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-emerald-400 font-semibold">{item.impact}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-blue-500/20 p-4" style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">AI-Generated Recommendations</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300">Prioritize <span className="text-blue-400 font-bold">React & AWS</span> training for maximum placement impact</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300">Students with <span className="text-emerald-400 font-bold">ML skills</span> have 11.2 LPA average package</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
