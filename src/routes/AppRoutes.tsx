import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn/SignIn';
import SignUp from '@/pages/SignUp/SignUp';
import Dashboard from '@/pages/Dashboard';
import StudentDashboard from '@/modules/student/StudentDashboard';
import ResumeInsights from '@/modules/student/ResumeInsights';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/resume" element={<ResumeInsights />} />
      </Routes>
    </BrowserRouter>
  );
}
