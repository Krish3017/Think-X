import { motion } from 'framer-motion';
import { Home, FileText, Target, TrendingUp, Bell, Search, Award, Brain, Sparkles, ArrowUp, ChevronRight, AlertTriangle, CheckCircle, ArrowDown, Flame, Code2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { ActivityHeatmap } from '@/components/ui/ActivityHeatmap';

export default function StudentDashboard() {
  const generateHeatmapData = () => {
    const data = [];
    for (let i = 0; i < 84; i++) {
      data.push({ date: `day-${i}`, count: Math.floor(Math.random() * 10) });
    }
    return data;
  };

  const studentData = {
    name: "Alex Johnson",
    readinessScore: 72,
    skillCoverage: 58,
    placementProbability: 68,
    resumeUploaded: true,
    resumeStrength: 72,
    currentSkills: ["Python", "JavaScript", "SQL", "Git", "HTML/CSS"],
    missingSkills: ["React", "AWS", "Docker", "TypeScript", "ML"],
    weakAreas: [
      { skill: "React", impact: "High" },
      { skill: "AWS", impact: "Medium" },
      { skill: "Docker", impact: "Medium" },
    ],
    learningPriority: ["React", "Machine Learning", "AWS"],
    skillProgress: [
      { skill: "React", progress: 0 },
      { skill: "AWS", progress: 15 },
      { skill: "ML", progress: 25 },
    ],
    skillGapData: [
      { skill: "React", current: 0, required: 85 },
      { skill: "ML", current: 25, required: 75 },
      { skill: "AWS", current: 0, required: 70 },
      { skill: "Docker", current: 15, required: 65 },
      { skill: "TypeScript", current: 35, required: 80 },
    ],
    trendData: [
      { month: "Jan", score: 45 },
      { month: "Feb", score: 52 },
      { month: "Mar", score: 58 },
      { month: "Apr", score: 65 },
      { month: "May", score: 72 },
    ],
    leetcodeData: {
      currentStreak: 12,
      longestStreak: 28,
      totalProblems: 156,
      heatmap: generateHeatmapData(),
    },
    githubData: {
      currentStreak: 8,
      longestStreak: 45,
      totalContributions: 342,
      heatmap: generateHeatmapData(),
    },
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "text-emerald-400" };
    if (score >= 60) return { text: "Good", color: "text-blue-400" };
    return { text: "Needs Work", color: "text-amber-400" };
  };

  const level = getReadinessLevel(studentData.readinessScore);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">Think-X</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/student/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
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
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 bg-[#050505] border border-white/[0.06] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
              />
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

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Welcome */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold mb-0.5">Welcome back, {studentData.name}</h1>
              <p className="text-sm text-gray-500">Here's your placement readiness overview</p>
            </div>

            {/* Top Row - Primary Metrics */}
            <div className="grid grid-cols-5 gap-4">
              {/* Placement Readiness */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-medium text-gray-400 mb-0.5">Placement Readiness</h3>
                    <p className={`text-base font-semibold ${level.color}`}>{level.text}</p>
                  </div>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28">
                    <svg className="transform -rotate-90 w-28 h-28">
                      <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/[0.03]" />
                      <circle
                        cx="56" cy="56" r="50" stroke="url(#gaugeGradient)" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - studentData.readinessScore / 100)}`}
                        strokeLinecap="round" filter="url(#glow)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{studentData.readinessScore}</span>
                      <span className="text-[10px] text-gray-500">out of 100</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={studentData.trendData}>
                          <defs>
                            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="url(#trendGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <ArrowUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">+18% this month</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Placement Probability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Placement Probability</h3>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-bold">{studentData.placementProbability}%</span>
                  <ArrowUp className="w-4 h-4 text-emerald-400 mb-1" />
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">Based on similar profiles</p>
              </motion.div>

              {/* Skill Coverage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Skill Coverage</h3>
                  <Target className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-3xl font-bold mb-2">{studentData.skillCoverage}%</div>
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${studentData.skillCoverage}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                    style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}
                  />
                </div>
              </motion.div>

              {/* Resume Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-400">Resume Status</h3>
                  {studentData.resumeUploaded ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">{studentData.resumeStrength}/100</div>
                <Link to="/student/resume">
                  <button className="text-[10px] text-cyan-400 hover:text-cyan-300 transition">Improve Resume →</button>
                </Link>
              </motion.div>
            </div>

            {/* Middle Row - Skills & Priority */}
            <div className="grid grid-cols-3 gap-4">
              {/* Current Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Current Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {studentData.currentSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-medium"
                      style={{ boxShadow: '0 0 12px rgba(16, 185, 129, 0.08)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Skills to Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Skills to Learn</h3>
                <div className="flex flex-wrap gap-1.5">
                  {studentData.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400 font-medium"
                      style={{ boxShadow: '0 0 12px rgba(245, 158, 11, 0.08)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Learning Priority */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Learning Priority</h3>
                <div className="space-y-2">
                  {studentData.learningPriority.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-blue-400 font-semibold">{idx + 1}</span>
                      </div>
                      <span className="text-xs text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row - Analytics */}
            <div className="grid grid-cols-3 gap-4">
              {/* Skill Gap Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="col-span-2 bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Skill Gap Analysis</h3>
                  <div className="flex items-center gap-3 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" style={{ boxShadow: '0 0 6px rgba(59, 130, 246, 0.6)' }}></div>
                      <span className="text-gray-400">Current</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-violet-500" style={{ boxShadow: '0 0 6px rgba(139, 92, 246, 0.6)' }}></div>
                      <span className="text-gray-400">Required</span>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentData.skillGapData} layout="vertical" margin={{ left: 70, right: 10, top: 5, bottom: 5 }}>
                      <XAxis type="number" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} />
                      <YAxis dataKey="skill" type="category" stroke="#333" tick={{ fill: '#999', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0B0B0B', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="current" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                      <Bar dataKey="required" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Right Column - Insights */}
              <div className="space-y-4">
                {/* Top Weak Areas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
                >
                  <h3 className="text-xs font-medium text-gray-400 mb-3">Top Weak Areas</h3>
                  <div className="space-y-2">
                    {studentData.weakAreas.map((area, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">{area.skill}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          area.impact === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {area.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* AI Insight Micro */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-blue-500/20 p-4"
                  style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.08)' }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <h3 className="text-xs font-semibold text-white">AI Insight</h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Improving <span className="text-blue-400 font-semibold">React</span> can increase readiness by{' '}
                    <span className="text-emerald-400 font-bold">14%</span>
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Consistency & Discipline Section */}
            <div className="mt-6">
              <div className="mb-3">
                <h2 className="text-lg font-semibold">Consistency & Discipline</h2>
                <p className="text-xs text-gray-500">Problem-solving and coding activity over time</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* LeetCode Heatmap */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-violet-400" />
                    <h3 className="text-sm font-semibold">LeetCode Problem Solving</h3>
                  </div>
                  <ActivityHeatmap data={studentData.leetcodeData.heatmap} colorScheme="violet" />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                    <div>
                      <p className="text-[10px] text-gray-500">Current Streak</p>
                      <p className="text-sm font-bold text-violet-400">{studentData.leetcodeData.currentStreak} days</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">Longest Streak</p>
                      <p className="text-sm font-bold text-gray-300">{studentData.leetcodeData.longestStreak} days</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">Total Solved</p>
                      <p className="text-sm font-bold text-gray-300">{studentData.leetcodeData.totalProblems}</p>
                    </div>
                  </div>
                </motion.div>

                {/* GitHub Heatmap */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold">GitHub Coding Activity</h3>
                  </div>
                  <ActivityHeatmap data={studentData.githubData.heatmap} colorScheme="cyan" />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                    <div>
                      <p className="text-[10px] text-gray-500">Current Streak</p>
                      <p className="text-sm font-bold text-cyan-400">{studentData.githubData.currentStreak} days</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">Longest Streak</p>
                      <p className="text-sm font-bold text-gray-300">{studentData.githubData.longestStreak} days</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">Total Contributions</p>
                      <p className="text-sm font-bold text-gray-300">{studentData.githubData.totalContributions}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
