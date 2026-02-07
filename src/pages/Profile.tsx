import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Target, Sparkles, Bell, Search, Save, Plus, X, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

interface StrongestSkill {
  name: string;
  progress: number;
}

interface LearningSkill {
  name: string;
}

function getSkillLevel(progress: number): string {
  if (progress <= 25) return 'beginner';
  if (progress <= 50) return 'intermediate';
  if (progress <= 75) return 'advanced';
  return 'expert';
}

function getLevelBadge(progress: number) {
  const level = getSkillLevel(progress);
  const colors = {
    beginner: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    expert: 'bg-green-500/10 text-green-400 border-green-500/20',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs border ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

export default function Profile() {
  const { user } = useAuth();

  // Profile state
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [joinedYear, setJoinedYear] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Skills state
  const [strongestSkills, setStrongestSkills] = useState<StrongestSkill[]>([]);
  const [learningSkills, setLearningSkills] = useState<LearningSkill[]>([]);
  const [newLearningSkill, setNewLearningSkill] = useState('');
  const [newCurrentSkill, setNewCurrentSkill] = useState('');
  const [skillsSaving, setSkillsSaving] = useState(false);

  // RULE #1: On mount, fetch profile AND skills from DB (single source of truth)
  useEffect(() => {
    fetchProfileFromDB();
  }, []);

  const fetchProfileFromDB = async () => {
    setProfileLoading(true);
    try {
      const data = await apiService.getStudentProfile();

      if (data.profile) {
        setRollNo(data.profile.rollNo || '');
        setName(data.profile.name || '');
        setBranch(data.profile.branch || '');
        setJoinedYear(data.profile.joinedYear?.toString() || '');
        setSemester(data.profile.semester?.toString() || '');
        setCgpa(data.profile.cgpa?.toString() || '');
        setGithubUsername(data.profile.githubUsername || '');
        setLeetcodeUsername(data.profile.leetcodeUsername || '');
      }

      // Current skills (is_current = true) → strongest skills with progress
      if (data.currentSkills && data.currentSkills.length > 0) {
        setStrongestSkills(data.currentSkills.map(s => ({
          name: s.name,
          progress: s.progress,
        })));
      }

      // Learning skills (is_current = false)
      if (data.learningSkills && data.learningSkills.length > 0) {
        setLearningSkills(data.learningSkills.map(s => ({ name: s.name })));
      }
    } catch (error) {
      console.log('Profile not found, user can create one');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const response = await apiService.saveStudentProfile({
        rollNo,
        name,
        branch,
        joinedYear: Number(joinedYear),
        semester: Number(semester),
        cgpa: cgpa ? Number(cgpa) : undefined,
      });

      // RULE #2: Update UI with PERSISTED data from backend response
      if (response.profile) {
        setRollNo(response.profile.rollNo || rollNo);
        setName(response.profile.name || name);
        setBranch(response.profile.branch || branch);
        setJoinedYear(response.profile.joinedYear?.toString() || joinedYear);
        setSemester(response.profile.semester?.toString() || semester);
        setCgpa(response.profile.cgpa?.toString() || cgpa);
      }

      alert('Profile saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSkillsSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSkillsSaving(true);
    try {
      const currentSkillsPayload = strongestSkills.map(s => ({
        name: s.name,
        progress: s.progress,
        level: getSkillLevel(s.progress)
      }));

      const learningSkillsPayload = learningSkills.map(s => ({
        name: s.name,
        progress: 0,
        level: 'beginner'
      }));

      const response = await apiService.saveStudentSkills({
        currentSkills: currentSkillsPayload,
        learningSkills: learningSkillsPayload,
        extractedSkills: [],
        missingSkills: [],
      });

      // RULE #2: Update UI with PERSISTED data from backend response
      if (response.currentSkills) {
        setStrongestSkills(response.currentSkills.map((s: any) => ({
          name: s.name,
          progress: s.progress,
        })));
      }
      if (response.learningSkills) {
        setLearningSkills(response.learningSkills.map((s: any) => ({
          name: s.name,
        })));
      }

      alert('Skills saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save skills');
    } finally {
      setSkillsSaving(false);
    }
  };

  const addLearningSkill = () => {
    if (newLearningSkill.trim()) {
      setLearningSkills([...learningSkills, { name: newLearningSkill.trim() }]);
      setNewLearningSkill('');
    }
  };

  const removeLearningSkill = (index: number) => {
    setLearningSkills(learningSkills.filter((_, i) => i !== index));
  };

  const addCurrentSkill = () => {
    if (newCurrentSkill.trim() && !strongestSkills.find(s => s.name.toLowerCase() === newCurrentSkill.trim().toLowerCase())) {
      setStrongestSkills([...strongestSkills, { name: newCurrentSkill.trim(), progress: 50 }]);
      setNewCurrentSkill('');
    }
  };

  const removeCurrentSkill = (index: number) => {
    setStrongestSkills(strongestSkills.filter((_, i) => i !== index));
  };

  const updateStrongestSkillProgress = (index: number, progress: number) => {
    const updated = [...strongestSkills];
    updated[index].progress = progress;
    setStrongestSkills(updated);
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
            <span className="text-lg font-semibold">Think-X</span>
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-gray-400 hover:text-white transition cursor-pointer">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Report</span>
            </div>
          </Link>
          <Link to="/student/profile">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Profile</span>
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
            <Link to="/student/profile">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <span className="text-sm font-semibold">{user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-auto p-6">
          {profileLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading profile from database...</div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-semibold mb-1">Profile</h1>
                <p className="text-sm text-gray-500">Manage your profile and learning goals</p>
              </div>

              {/* Profile Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Roll Number *</label>
                      <input
                        type="text"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        placeholder="CS2021001"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Branch *</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Computer Science"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Joined Year *</label>
                      <input
                        type="number"
                        value={joinedYear}
                        onChange={(e) => setJoinedYear(e.target.value)}
                        placeholder="2021"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Semester *</label>
                      <input
                        type="number"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="6"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        placeholder="8.5"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">GitHub Username</label>
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="johndoe"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">LeetCode Username</label>
                      <input
                        type="text"
                        value={leetcodeUsername}
                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                        placeholder="johndoe"
                        className="w-full h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="w-full h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </motion.div>

              {/* Skills to Learn Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Skills to Learn</h2>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLearningSkill}
                      onChange={(e) => setNewLearningSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningSkill())}
                      placeholder="Enter skill name (e.g., AWS, Docker)"
                      className="flex-1 h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30"
                    />
                    <button
                      type="button"
                      onClick={addLearningSkill}
                      className="px-4 h-11 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {learningSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {learningSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 bg-[#050505] border border-white/[0.06] rounded-lg flex items-center gap-2 group hover:border-red-500/30 transition"
                        >
                          <span className="text-sm text-gray-300">{skill.name}</span>
                          <button
                            onClick={() => removeLearningSkill(index)}
                            className="text-gray-500 hover:text-red-400 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {learningSkills.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No learning goals yet. Add skills you want to learn.</p>
                  )}
                </div>
              </motion.div>

              {/* Skill Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0B0B0B] rounded-2xl border border-white/[0.06] p-6"
              >
                <h2 className="text-lg font-semibold mb-2">Skill Progress Tracker</h2>
                <p className="text-sm text-gray-500 mb-4">Add your current skills and track progress with the slider</p>

                {/* Add new current skill */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newCurrentSkill}
                    onChange={(e) => setNewCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCurrentSkill())}
                    placeholder="Add a skill (e.g., React, Python)"
                    className="flex-1 h-11 px-4 bg-[#050505] border border-white/[0.06] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/30"
                  />
                  <button
                    type="button"
                    onClick={addCurrentSkill}
                    className="px-4 h-11 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/20 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-3">
                  {strongestSkills.map((skill, index) => (
                    <div key={index} className="bg-[#050505] border border-white/[0.06] rounded-xl p-4 space-y-3 hover:border-white/[0.1] transition">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-blue-400 tabular-nums w-10 text-right">{skill.progress}%</span>
                          {getLevelBadge(skill.progress)}
                          <button
                            onClick={() => removeCurrentSkill(index)}
                            className="ml-1 text-gray-600 hover:text-red-400 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {/* Progress bar visual */}
                      <div className="h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      {/* Visible range slider */}
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={skill.progress}
                        onChange={(e) => updateStrongestSkillProgress(index, Number(e.target.value))}
                        className="w-full h-2 appearance-none bg-transparent cursor-pointer accent-blue-500"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${skill.progress}%, #1a1a1a ${skill.progress}%, #1a1a1a 100%)`,
                          borderRadius: '9999px',
                        }}
                      />
                    </div>
                  ))}

                  {strongestSkills.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No skills tracked yet.</p>
                      <p className="text-xs text-gray-600 mt-1">Add skills above or upload your resume to get started.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Strongest Skills Highlight */}
              {strongestSkills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-500/10 to-violet-600/10 rounded-2xl border border-blue-500/20 p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-lg font-semibold">Top 3 Strongest Skills</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[...strongestSkills]
                      .sort((a, b) => b.progress - a.progress)
                      .slice(0, 3)
                      .map((skill, index) => (
                        <div
                          key={index}
                          className="bg-[#0B0B0B]/80 border border-white/[0.08] rounded-xl p-4 text-center space-y-2"
                        >
                          <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                          <span className="text-sm font-semibold text-white block">{skill.name}</span>
                          <span className="text-xs font-bold text-blue-400">{skill.progress}%</span>
                          <div>{getLevelBadge(skill.progress)}</div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Save Skills Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={handleSkillsSubmit}
                  disabled={skillsSaving}
                  className="w-full h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {skillsSaving ? 'Saving...' : 'Save All Skills'}
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
