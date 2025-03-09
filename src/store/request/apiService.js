import axios from 'axios';
import axiosRetry from 'axios-retry';
import { toast } from 'react-toastify';
import { mockPosts } from '../mockData';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // 8 second timeout
});

// Configure retry logic for failed requests
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500;
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = getErrorMessage(error);
    // Show toast notification for errors
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Helper function to extract meaningful error messages
const getErrorMessage = (error) => {
  let errorMessage = 'Произошла ошибка при выполнении запроса';
  
  if (error.code === 'ECONNABORTED') {
    errorMessage = 'Превышено время ожидания запроса. Проверьте подключение к интернету.';
  } else if (error.response) {
    switch (error.response.status) {
      case 400:
        errorMessage = error.response.data?.message || 'Неверный запрос';
        break;
      case 401:
        errorMessage = 'Необходима авторизация';
        break;
      case 403:
        errorMessage = 'Доступ запрещен';
        break;
      case 404:
        errorMessage = 'Ресурс не найден';
        break;
      case 500:
        errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
        break;
      default:
        errorMessage = error.response.data?.message || errorMessage;
    }
  } else if (error.request) {
    errorMessage = 'Нет ответа от сервера. Проверьте подключение к интернету.';
  }
  
  return errorMessage;
};

// API service functions
const apiService = {
  // User related endpoints
  user: {
    login: async (credentials) => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    register: async (userData) => {
      try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    getProfile: async () => {
      try {
        const response = await apiClient.get('/user/profile');
        return response.data;
      } catch (error) {
        console.error('Get profile error:', error);
        throw error;
      }
    },
    updateProfile: async (profileData) => {
      try {
        const response = await apiClient.put('/user/profile', profileData);
        return response.data;
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    },
  },
  
  // Friends related endpoints
  friends: {
    getAll: async () => {
      try {
        const response = await apiClient.get('/friends');
        return response.data;
      } catch (error) {
        console.error('Get friends error:', error);
        // Return mock data if API fails
        return [
          {
            id: 1,
            name: 'Анна Смирнова',
            avatar: 'https://i.pravatar.cc/150?img=1',
            status: 'online'
          },
          {
            id: 2,
            name: 'Иван Петров',
            avatar: 'https://i.pravatar.cc/150?img=2',
            status: 'offline'
          },
          {
            id: 3,
            name: 'Елена Иванова',
            avatar: 'https://i.pravatar.cc/150?img=3',
            status: 'online'
          }
        ];
      }
    },
    addFriend: async (friendId) => {
      try {
        const response = await apiClient.post(`/friends/${friendId}`);
        return response.data;
      } catch (error) {
        console.error('Add friend error:', error);
        throw error;
      }
    },
    removeFriend: async (friendId) => {
      try {
        const response = await apiClient.delete(`/friends/${friendId}`);
        return response.data;
      } catch (error) {
        console.error('Remove friend error:', error);
        throw error;
      }
    },
    getRecommendations: async () => {
      try {
        const response = await apiClient.get('/recommendations/friends');
        return response.data;
      } catch (error) {
        console.error('Get friend recommendations error:', error);
        throw error;
      }
    },
  },
  
  // Posts related endpoints
  posts: {
    getAll: async () => {
      try {
        const response = await apiClient.get('/posts');
        return response.data;
      } catch (error) {
        console.error('Get posts error:', error);
        // Return mock data if API fails
        return mockPosts;
      }
    },
    getById: async (postId) => {
      try {
        const response = await apiClient.get(`/posts/${postId}`);
        return response.data;
      } catch (error) {
        console.error(`Get post ${postId} error:`, error);
        // Return a mock post if API fails
        return mockPosts.find(post => post.id === parseInt(postId)) || null;
      }
    },
    create: async (postData) => {
      try {
        const response = await apiClient.post('/posts', postData);
        return response.data;
      } catch (error) {
        console.error('Create post error:', error);
        throw error;
      }
    },
    update: async (postId, postData) => {
      try {
        const response = await apiClient.put(`/posts/${postId}`, postData);
        return response.data;
      } catch (error) {
        console.error('Update post error:', error);
        throw error;
      }
    },
    delete: async (postId) => {
      try {
        const response = await apiClient.delete(`/posts/${postId}`);
        return response.data;
      } catch (error) {
        console.error('Delete post error:', error);
        throw error;
      }
    },
    like: async (postId) => {
      try {
        const response = await apiClient.post(`/posts/${postId}/like`);
        return response.data;
      } catch (error) {
        console.error('Like post error:', error);
        throw error;
      }
    },
    unlike: async (postId) => {
      try {
        const response = await apiClient.delete(`/posts/${postId}/like`);
        return response.data;
      } catch (error) {
        console.error('Unlike post error:', error);
        throw error;
      }
    },
    getComments: async (postId) => {
      try {
        const response = await apiClient.get(`/posts/${postId}/comments`);
        return response.data;
      } catch (error) {
        console.error('Get comments error:', error);
        throw error;
      }
    },
    addComment: async (postId, commentData) => {
      try {
        const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
        return response.data;
      } catch (error) {
        console.error('Add comment error:', error);
        throw error;
      }
    },
    search: async (query) => {
      try {
        const response = await apiClient.get(`/posts/search?q=${encodeURIComponent(query)}`);
        return response.data;
      } catch (error) {
        console.error('Search posts error:', error);
        // Return filtered mock data if API fails
        return mockPosts.filter(post => 
          post.description.toLowerCase().includes(query.toLowerCase())
        );
      }
    },
    getRecommendations: async () => {
      try {
        const response = await apiClient.get('/recommendations/posts');
        return response.data;
      } catch (error) {
        console.error('Get post recommendations error:', error);
        throw error;
      }
    },
  },
  
  // Messages related endpoints
  messages: {
    getConversation: async (friendId) => {
      try {
        const response = await apiClient.get(`/messages/${friendId}`);
        return response.data;
      } catch (error) {
        console.error('Get conversation error:', error);
        throw error;
      }
    },
    sendMessage: async (friendId, messageData) => {
      try {
        const response = await apiClient.post(`/messages/${friendId}`, messageData);
        return response.data;
      } catch (error) {
        console.error('Send message error:', error);
        throw error;
      }
    },
    deleteMessage: async (messageId) => {
      try {
        const response = await apiClient.delete(`/messages/${messageId}`);
        return response.data;
      } catch (error) {
        console.error('Delete message error:', error);
        throw error;
      }
    },
  },
};

export default apiService;