import { motion } from 'framer-motion';
import { Home, FileText, Target, TrendingUp, Bell, Search, Sparkles, ArrowUp, Flame, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActivityHeatmap } from '@/components/ui/ActivityHeatmap';
import { LeetCodeHeatmap } from '@/components/ui/LeetCodeHeatmap';
import { GitHubHeatmap } from '@/components/ui/GitHubHeatmap';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: leetcodeData } = useLeetCodeStats('sarthak131');

  const { data: studentData, isLoading, isError } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => apiService.getStudentDashboard(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (isError || !studentData) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-red-400">Failed to load dashboard data.</div>
      </div>
    );
  }

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
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/signin';
              }}
              className="px-4 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition"
            >
              Logout
            </button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-sm font-semibold">{studentData.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Welcome */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold mb-0.5">What should I do today?</h1>
              <p className="text-sm text-gray-500">Live performance & day-to-day progress</p>
            </div>

            {/* Top Row - Live Metrics */}
            <div className="grid grid-cols-4 gap-4">
              {/* Live Readiness */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Live Readiness</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90">
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <circle cx="56" cy="56" r="50" stroke="#1a1a1a" strokeWidth="8" fill="none" />
                      <circle
                        cx="56" cy="56" r="50" stroke="url(#gradient)" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - studentData.placementReadiness / 100)}`}
                        strokeLinecap="round" filter="url(#glow)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{studentData.placementReadiness}</span>
                      <span className="text-[10px] text-gray-500">/ 100</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Weekly Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Weekly Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-emerald-400">+{studentData.weeklyProgress}</span>
                    <span className="text-xs text-gray-400 mb-1">points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">{studentData.weeklyImprovement}% improvement</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Best week in 30 days</p>
                </div>
              </motion.div>

              {/* Consistency Momentum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Consistency Momentum</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">LeetCode</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-violet-400">{leetcodeData?.currentStreak || studentData.leetcodeStreak}d</span>
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">GitHub</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-cyan-400">{studentData.githubStreak}d</span>
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400 mt-3">+{studentData.streakImprovement} days vs last week</p>
              </motion.div>

              {/* Next 7-Day Focus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-blue-500/20 p-4"
                style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.08)' }}
              >
                <h3 className="text-xs font-medium text-blue-400 mb-3">Next 7-Day Focus</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-500">Priority Skill</p>
                      <p className="text-xs text-white font-semibold">React Hooks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-500">Activity Goal</p>
                      <p className="text-xs text-white font-semibold">15 LeetCode problems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-500">Resume Task</p>
                      <p className="text-xs text-white font-semibold">Add project metrics</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Middle Row - Skills */}
            <div className="grid grid-cols-4 gap-4">
              {/* Skill Coverage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Skill Coverage</h3>
                <div className="space-y-3">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">{studentData.skillCoverage}%</span>
                    <span className="text-xs text-emerald-400 mb-1">+5%</span>
                  </div>
                  <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${studentData.skillCoverage}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                      style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">7 of 12 core skills</p>
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
                  {studentData.skillsToLearn.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-3">5 skills for 100%</p>
              </motion.div>

              {/* Skill Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="col-span-2 bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
              >
                <h3 className="text-xs font-medium text-gray-400 mb-3">Skill Progress Tracker</h3>
                <div className="space-y-2">
                  {studentData.skillProgress.map((skill: { name: string; progress: number }, idx: number) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-300">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.progress}%</span>
                      </div>
                      <div className="relative h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                          style={{ width: `${skill.progress}%`, boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Insight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
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

            {/* Consistency & Discipline */}
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
                  transition={{ delay: 0.8 }}
                  className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold">LeetCode Activity</h3>
                    </div>
                    <p className="text-xs text-gray-500">Daily problem-solving consistency</p>
                  </div>
                  <LeetCodeHeatmap />
                </motion.div>

                {/* GitHub Heatmap */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-4"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold">GitHub Contributions</h3>
                    </div>
                    <p className="text-xs text-gray-500">Daily coding activity on GitHub</p>
                  </div>
                  <GitHubHeatmap />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
