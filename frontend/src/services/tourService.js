import apiService from './apiService';

/**
 * TourService for tour related API calls
 */
class TourService {
  /**
   * Get all tours with optional filters
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Object>} Tours data
   */
  async getAllTours(params = {}) {
    return apiService.get('/tours', params);
  }
  
  /**
   * Get a specific tour by ID
   * @param {string} id - Tour ID
   * @returns {Promise<Object>} Tour data
   */
  async getTourById(id) {
    return apiService.get(`/tours/${id}`);
  }
  
  /**
   * Create a new tour (admin only)
   * @param {Object} tourData - Tour data
   * @returns {Promise<Object>} Created tour
   */
  async createTour(tourData) {
    return apiService.post('/tours', tourData);
  }
  
  /**
   * Update an existing tour (admin only)
   * @param {string} id - Tour ID
   * @param {Object} tourData - Updated tour data
   * @returns {Promise<Object>} Updated tour
   */
  async updateTour(id, tourData) {
    return apiService.put(`/tours/${id}`, tourData);
  }
  
  /**
   * Delete a tour (admin only)
   * @param {string} id - Tour ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteTour(id) {
    return apiService.delete(`/tours/${id}`);
  }
  
  /**
   * Search for tours
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async searchTours(searchParams) {
    return apiService.get('/tours/search', searchParams);
  }
  
  /**
   * Get top rated tours
   * @param {number} limit - Number of tours to return
   * @returns {Promise<Object>} Top rated tours
   */
  async getTopRatedTours(limit = 5) {
    return apiService.get('/tours/top-rated', { limit });
  }
}

export default new TourService();
