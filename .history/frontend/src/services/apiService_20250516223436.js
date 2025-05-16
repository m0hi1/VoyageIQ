import axios from 'axios';
import { getTokenFromLocalStorage } from '../utils/token.js';

/**
 * Base API service to handle API requests
 */
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3050/api/v1';
    this.axios = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    
    // Request interceptor for adding auth token
    this.axios.interceptors.request.use(
      (config) => {
        const token = getTokenFromLocalStorage();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor for handling errors
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle specific errors (e.g., 401 for auth issues)
        if (error.response && error.response.status === 401) {
          // Redirect to login or refresh token logic
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Generic request methods
  async get(endpoint, params = {}) {
    try {
      const response = await this.axios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async post(endpoint, data = {}) {
    try {
      const response = await this.axios.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async put(endpoint, data = {}) {
    try {
      const response = await this.axios.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async delete(endpoint) {
    try {
      const response = await this.axios.delete(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  // Error handling
  handleError(error) {
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
    console.error('API Error:', errorMessage);
    // You can implement global error handling here (e.g., toast notifications)
    return errorMessage;
  }
}

export default new ApiService();
