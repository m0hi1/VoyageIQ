/**
 * Token utility functions for authentication
 * Handles token storage, retrieval, and validation
 */
import { jwtDecode } from 'jwt-decode';

// Constants for localStorage keys
const AUTH_TOKEN_KEY = 'token';
const USER_INFO_KEY = 'user';

/**
 * Get user information from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getUserFromLocalStorage = () => {
  const userJson = localStorage.getItem(USER_INFO_KEY);
  if (!userJson) {
    return null;
  }
  
  try {
    const userData = JSON.parse(userJson);
    if (typeof userData === 'object' && userData !== null) {
      return userData;
    }
    // If data is not a valid object (e.g. parsed "null" or other primitives)
    localStorage.removeItem(USER_INFO_KEY);
    return null;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    localStorage.removeItem(USER_INFO_KEY); // Corrupted data
    return null;
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} Token or null if not found
 */
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Save user information to localStorage
 * @param {Object} user - User object to save
 */
export const saveUserToLocalStorage = (user) => {
  if (!user) {
    localStorage.removeItem(USER_INFO_KEY);
    return;
  }
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
};

/**
 * Save authentication token to localStorage
 * @param {string} token - Token to save
 */
export const saveTokenToLocalStorage = (token) => {
  if (!token) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
};

/**
 * Check if a token is expired
 * @param {string} token - Token to check
 * @param {number} bufferSeconds - Buffer time in seconds before actual expiration
 * @returns {boolean} Whether token is expired
 */
export const isTokenExpired = (token, bufferSeconds = 60) => {
  if (!token) return true;
    try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp < (currentTime + bufferSeconds);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true;
  }
};

/**
 * Get token expiration date
 * @param {string} token - Token to check
 * @returns {Date|null} Expiration date or null if invalid
 */
export const getTokenExpirationDate = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwt_decode(token);
    if (!decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get remaining time until token expires (in seconds)
 * @param {string} token - Token to check
 * @returns {number} Seconds until expiration (0 if expired)
 */
export const getTokenRemainingTime = (token) => {
  if (!token) return 0;
  
  try {
    const decoded = jwt_decode(token);
    if (!decoded.exp) return 0;
    
    const currentTime = Date.now() / 1000;
    const remainingTime = decoded.exp - currentTime;
    
    return remainingTime > 0 ? Math.floor(remainingTime) : 0;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return 0;
  }
};

/**
 * Extract user information from token
 * @param {string} token - Token to decode
 * @returns {Object|null} User information or null if invalid
 */
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    return jwt_decode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Create authorization header with bearer token
 * @param {string} token - Token to include in header
 * @returns {Object} Header object
 */
export const createAuthHeader = (token) => {
  return {
    Authorization: `Bearer ${token || getTokenFromLocalStorage()}`
  };
};