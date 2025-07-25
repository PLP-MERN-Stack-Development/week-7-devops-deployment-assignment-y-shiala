import axios from 'axios';

// API configuration
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
       localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface BlogPost {
  id: number;
  title: string;
  body: string;
  userId: number;
  author?: string;
  createdAt?: string;
  readTime?: string;
  tags?: string[];
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// API functions
export const blogAPI = {
  // Posts
  getPosts: async (): Promise<BlogPost[]> => {
    const response = await api.get('/posts');
    return response.data.map((post: any) => ({
      ...post,
      author: 'Anonymous Author',
      createdAt: new Date().toISOString(),
      readTime: '5 min read',
      tags: ['Technology', 'Web Development']
    }));
  },

  getPost: async (id: number): Promise<BlogPost> => {
    const response = await api.get(`/posts/${id}`);
    return {
      ...response.data,
      author: 'Anonymous Author',
      createdAt: new Date().toISOString(),
      readTime: '5 min read',
      tags: ['Technology', 'Web Development']
    };
  },

  createPost: async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  updatePost: async (id: number, post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  // Comments
  getPostComments: async (postId: number): Promise<Comment[]> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (comment: Omit<Comment, 'id'>): Promise<Comment> => {
    const response = await api.post('/comments', comment);
    return response.data;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export default api;