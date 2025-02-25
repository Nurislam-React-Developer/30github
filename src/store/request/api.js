import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry logic
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 500;
  },
});

// Posts API
export const getPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch posts. Please try again later.';
    console.error('Error fetching posts:', error);
    throw new Error(errorMessage);
  }
};

export const likePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to like post. Please try again.';
    console.error('Error liking post:', error);
    throw new Error(errorMessage);
  }
};

// Comments API
export const getComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch comments. Please try again.';
    console.error('Error fetching comments:', error);
    throw new Error(errorMessage);
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to add comment. Please try again.';
    console.error('Error adding comment:', error);
    throw new Error(errorMessage);
  }
};