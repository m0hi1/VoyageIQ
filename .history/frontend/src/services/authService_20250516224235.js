import apiService from './apiService';

/**
 * AuthService for authentication related API calls
 */
class AuthService {
  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    return apiService.post('/auth/login', credentials);
  }
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  async register(userData) {
    return apiService.post('/auth/register', userData);
  }
  
  /**
   * Logout the current user
   * @returns {Promise<Object>} Logout confirmation
   */
  async logout() {
    return apiService.post('/auth/logout');
  }
  
  /**
   * Request a password reset
   * @param {Object} emailData - Object containing email address
   * @returns {Promise<Object>} Reset confirmation
   */
  async forgotPassword(emailData) {
    return apiService.post('/auth/forgot-password', emailData);
  }
  
  /**
   * Reset password using token
   * @param {string} token - Reset token
   * @param {Object} passwordData - New password data
   * @returns {Promise<Object>} Reset confirmation
   */
  async resetPassword(token, passwordData) {
    return apiService.post(`/auth/reset-password/${token}`, passwordData);
  }
  
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getCurrentUser() {
    return apiService.get('/auth/me');
  }
}

export default new AuthService();
