import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, TrendingUp, Target, Download, Sparkles } from 'lucide-react';

export default function ResumeInsights() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock AI analysis data
  const analysisData = {
    detectedSkills: ["Python", "JavaScript", "SQL", "Git", "HTML/CSS"],
    experienceLevel: "Intermediate",
    education: "B.Tech Computer Science, 3rd Year",
    skillMatch: 62,
    missingSkills: ["React", "AWS", "Docker", "TypeScript", "Machine Learning"],
    strengthScore: 68,
    insights: [
      "Add React projects to improve frontend profile",
      "Mention cloud experience for better placement chances",
      "Include quantifiable achievements in project descriptions",
      "Add certifications section to boost credibility"
    ],
    keywordMatch: 45,
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PDF or DOCX file');
      return;
    }
    
    setFile(file);
    setUploading(true);
    
    // Simulate upload and analysis
    setTimeout(() => {
      setUploading(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0E1117]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Resume Insights</h1>
              <p className="text-sm text-gray-400 mt-0.5">Upload your resume to get AI-powered skill analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative bg-[#0E1117] rounded-xl border-2 border-dashed transition-all ${
              dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10'
            } ${file ? 'border-emerald-500/30' : ''}`}
          >
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleChange}
            />
            
            {!file ? (
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center py-16 cursor-pointer"
              >
                <motion.div
                  animate={{ y: dragActive ? -5 : 0 }}
                  className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4"
                >
                  <Upload className="w-8 h-8 text-indigo-400" />
                </motion.div>
                <p className="text-lg font-medium text-white mb-2">
                  Drag & drop your resume or click to upload
                </p>
                <p className="text-sm text-gray-400 mb-1">Supported formats: PDF, DOCX</p>
                <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
              </label>
            ) : (
              <div className="py-12 px-6">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4"></div>
                    <p className="text-sm text-gray-400">Analyzing your resume...</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        setAnalyzed(false);
                      }}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analyzed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Resume Summary & Strength Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Resume Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="md:col-span-2 bg-[#0E1117] rounded-xl border border-white/5 p-6"
                >
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Resume Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Detected Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.detectedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Experience Level</p>
                        <p className="text-sm text-white font-medium">{analysisData.experienceLevel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Education</p>
                        <p className="text-sm text-white font-medium">{analysisData.education}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Resume Strength Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0E1117] rounded-xl border border-white/5 p-6"
                >
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Resume Strength</h3>
                  <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28 mb-3">
                      <svg className="transform -rotate-90 w-28 h-28">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/5"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 48}`}
                          strokeDashoffset={`${2 * Math.PI * 48 * (1 - analysisData.strengthScore / 100)}`}
                          className="text-indigo-500"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{analysisData.strengthScore}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">Good resume structure with room for improvement</p>
                  </div>
                </motion.div>
              </div>

              {/* Skill Match & Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skill Match */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#0E1117] rounded-xl border border-white/5 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Resume Skill Match</h3>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="mb-3">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-bold">{analysisData.skillMatch}%</span>
                      <span className="text-sm text-gray-400 pb-1">match with placed students</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisData.skillMatch}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Based on analysis of 500+ placed students</p>
                </motion.div>

                {/* Keyword Match */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0E1117] rounded-xl border border-white/5 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Keyword Match</h3>
                    <Target className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mb-3">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-bold">{analysisData.keywordMatch}%</span>
                      <span className="text-sm text-gray-400 pb-1">job market alignment</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisData.keywordMatch}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Add industry-relevant keywords to improve</p>
                </motion.div>
              </div>

              {/* Missing Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#0E1117] rounded-xl border border-white/5 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-medium text-gray-400">Missing Skills from Resume</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisData.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">AI-Powered Recommendations</h3>
                    <p className="text-xs text-gray-400">Personalized suggestions to improve your resume</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {analysisData.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Download Report */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center"
              >
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-all">
                  <Download className="w-4 h-4" />
                  Download Improvement Report
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
