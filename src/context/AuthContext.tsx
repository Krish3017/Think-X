import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      setUser(null);
      return;
    }

    try {
      // Trust stored user data - don't depend on API
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Background refresh: try to update user data without blocking auth
      apiService.getMe()
        .then(response => {
          // Only update if response is valid
          if (response?.user?.id) {
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
          }
        })
        .catch((error) => {
          // Log error but don't logout user
          if (import.meta.env.DEV) {
            console.warn('Background user refresh failed:', error.message);
          }
          // Keep user logged in with stored data
        });
    } catch (error) {
      // Only clear if stored data is corrupted (JSON parse error)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      // Clear any existing invalid data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      throw error; // Re-throw to let the component handle the error
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    // Call logout API but don't wait for it
    apiService.logout().catch(() => {});
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user && !loading,
    loading,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};