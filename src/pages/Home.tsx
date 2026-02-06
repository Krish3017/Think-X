import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Think-X</h1>
        <p className="text-gray-400 mb-8">Welcome to Think-X Platform</p>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-white">Hello, {user?.name}!</p>
            <Link to="/dashboard">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link to="/signin">
              <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
