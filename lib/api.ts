import axios from 'axios';

// Use API Gateway in Docker, local Next.js API routes in dev
// In browser, use relative URLs to hit Next.js API routes which proxy to API Gateway
const API_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
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

// Messages API
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  readAt?: string;
  createdAt: string;
  isFromCurrentUser?: boolean;
}

export interface Conversation {
  userId: number;
  firstName?: string;
  lastName?: string;
  email: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
}

export interface ConversationDetail {
  user: User;
  messages: Message[];
}

export const messagesAPI = {
  send: async (receiverId: number, content: string): Promise<Message> => {
    const response = await api.post('/api/messages', { receiverId, content });
    return response.data;
  },

  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    const response = await api.get('/api/messages/conversations');
    return response.data;
  },

  getConversation: async (userId: number): Promise<ConversationDetail> => {
    const response = await api.get(`/api/messages/${userId}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/api/messages/unread/count');
    return response.data;
  },
};

export default api;
