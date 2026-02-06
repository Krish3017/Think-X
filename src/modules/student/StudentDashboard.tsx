import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, BookOpen, Brain, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export default function StudentDashboard() {
  const studentData = {
    name: "Alex Johnson",
    branch: "Computer Science",
    year: "3rd Year",
    readinessScore: 68,
    currentSkills: ["Python", "JavaScript", "SQL", "HTML/CSS", "Git"],
    missingSkills: ["React", "Machine Learning", "AWS", "Docker", "TypeScript"],
    skillGapData: [
      { skill: "React", current: 0, required: 85 },
      { skill: "Machine Learning", current: 20, required: 75 },
      { skill: "AWS", current: 0, required: 70 },
      { skill: "Docker", current: 10, required: 65 },
      { skill: "TypeScript", current: 30, required: 80 },
    ],
    placedStudentsAvg: 8.5,
    skillCoverage: 45,
    trend: "+12%",
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "text-emerald-400" };
    if (score >= 60) return { text: "Good", color: "text-blue-400" };
    return { text: "Needs Work", color: "text-amber-400" };
  };

  const readinessLevel = getReadinessLevel(studentData.readinessScore);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0E1117]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                Welcome back, {studentData.name}
              </h1>
              <p className="text-sm text-gray-400">
                {studentData.branch} • {studentData.year}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-lg font-semibold">AJ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Placement Readiness - Main Focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-[#0E1117] rounded-xl border border-white/5 p-6 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Placement Readiness</h3>
                <p className="text-xs text-gray-500">Your overall readiness score</p>
              </div>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex items-end gap-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/5"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - studentData.readinessScore / 100)}`}
                    className="text-indigo-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{studentData.readinessScore}</span>
                </div>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">{studentData.trend}</span>
                </div>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </motion.div>

          {/* Your Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0E1117] rounded-xl border border-white/5 p-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{studentData.currentSkills.length}</div>
            <p className="text-sm text-gray-400 mb-1">Your Skills</p>
            <p className="text-xs text-gray-500">Avg: {studentData.placedStudentsAvg} skills</p>
          </motion.div>

          {/* Skills to Learn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0E1117] rounded-xl border border-white/5 p-6 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{studentData.missingSkills.length}</div>
            <p className="text-sm text-gray-400 mb-1">Skills to Learn</p>
            <p className="text-xs text-gray-500">Based on AI analysis</p>
          </motion.div>

          {/* Readiness Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0E1117] rounded-xl border border-white/5 p-6 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className={`text-2xl font-bold mb-1 ${readinessLevel.color}`}>
              {readinessLevel.text}
            </div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <p className="text-xs text-gray-500">Score: {studentData.readinessScore}/100</p>
          </motion.div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0E1117] rounded-xl border border-white/5 p-6"
          >
            <h3 className="text-sm font-medium text-gray-400 mb-4">Current Skills</h3>
            <div className="flex flex-wrap gap-2">
              {studentData.currentSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Missing Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0E1117] rounded-xl border border-white/5 p-6"
          >
            <h3 className="text-sm font-medium text-gray-400 mb-4">Skills to Learn</h3>
            <div className="flex flex-wrap gap-2">
              {studentData.missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skill Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#0E1117] rounded-xl border border-white/5 p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold">Skill Gap Analysis</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentData.skillGapData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1f2e" />
                <XAxis type="number" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis dataKey="skill" type="category" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 13 }} />
                <Bar dataKey="current" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="required" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-400">Current Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded"></div>
              <span className="text-xs text-gray-400">Required Level</span>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">AI Insight</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Based on similar placed students, improving <span className="text-indigo-400 font-medium">React</span> and{' '}
                <span className="text-indigo-400 font-medium">AWS</span> can increase your placement probability by{' '}
                <span className="text-emerald-400 font-semibold">34%</span>. Focus on these skills in the next 2 months.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
