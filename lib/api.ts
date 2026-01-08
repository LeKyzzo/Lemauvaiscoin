import axios from 'axios';

// Use API Gateway (Tier 2) - falls back to local routes for SSR
const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://api-gateway:3001');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
}

export interface Ad {
  id: number;
  userId?: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  location?: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
}

export interface AdCreate {
  title: string;
  description?: string;
  price: number;
  category?: string;
  location?: string;
  imageUrl?: string;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, firstName?: string, lastName?: string, phone?: string) => {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      firstName,
      lastName,
      phone,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Ads API
export const adsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const response = await api.get('/api/ads', { params });
    return response.data;
  },

  getById: async (id: string | number): Promise<Ad> => {
    const response = await api.get(`/api/ads/${id}`);
    return response.data;
  },

  create: async (ad: AdCreate): Promise<Ad> => {
    const response = await api.post('/api/ads', ad);
    return response.data;
  },

  update: async (id: string | number, ad: Partial<AdCreate>): Promise<Ad> => {
    const response = await api.put(`/api/ads/${id}`, ad);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/api/ads/${id}`);
    return response.data;
  },

  getByUser: async (userId: number) => {
    const response = await api.get(`/api/ads/user/${userId}`);
    return response.data;
  },
};

export default api;
