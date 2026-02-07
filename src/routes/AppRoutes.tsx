import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn/SignIn';
import SignUp from '@/pages/SignUp/SignUp';
import SignUpDetails from '@/pages/SignUpDetails/SignUpDetails';
import SignUpSkills from '@/pages/SignUpSkills/SignUpSkills';
import Dashboard from '@/pages/Dashboard';
import StudentDashboard from '@/modules/student/StudentDashboard';
import ResumeInsights from '@/modules/student/ResumeInsights';
import Report from '@/modules/student/Report';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/modules/admin/AdminDashboard';
import StudentAnalytics from '@/modules/admin/StudentAnalytics';
import SkillAnalysis from '@/modules/admin/SkillAnalysis';
import ResumeAnalytics from '@/modules/admin/ResumeAnalytics';
import Reports from '@/modules/admin/Reports';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/details" element={<SignUpDetails />} />
        <Route path="/signup/skills" element={<SignUpSkills />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/resume" element={<ResumeInsights />} />
        <Route path="/student/report" element={<Report />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentAnalytics />} />
        <Route path="/admin/skills" element={<SkillAnalysis />} />
        <Route path="/admin/resumes" element={<ResumeAnalytics />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}
