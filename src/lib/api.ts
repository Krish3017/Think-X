import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const apiService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signin', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async getMe(): Promise<{ user: AuthResponse['user'] }> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    }
  },

  async saveStudentProfile(data: {
    rollNo: string;
    name: string;
    branch: string;
    joinedYear: number;
    semester: number;
    cgpa?: number;
  }): Promise<{ message: string }> {
    try {
      const response = await api.post('/student/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to save profile');
    }
  },

  async saveStudentSkills(data: {
    currentSkills: { name: string; progress?: number; level?: string }[];
    learningSkills: { name: string; progress?: number; level?: string }[];
    extractedSkills?: string[];
    missingSkills?: string[];
  }): Promise<{ message: string }> {
    try {
      const response = await api.post('/student/skills', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to save skills');
    }
  },

  async getResumeInsights(): Promise<{ extractedSkills: string[]; missingSkills: string[] }> {
    try {
      const response = await api.get('/student/resume-insights');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resume insights');
    }
  },

  async getStudentDashboard(): Promise<any> {
    try {
      const response = await api.get('/student/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  },
};
