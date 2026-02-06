import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <div className="space-y-2 text-gray-400">
            <p><span className="text-white">Email:</span> {user?.email}</p>
            <p><span className="text-white">User ID:</span> {user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
