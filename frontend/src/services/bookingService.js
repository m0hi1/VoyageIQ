import apiService from './apiService';

/**
 * BookingService for booking related API calls
 */
class BookingService {
  /**
   * Get all bookings for current user
   * @returns {Promise<Object>} User bookings
   */
  async getMyBookings() {
    return apiService.get('/bookings/my-bookings');
  }
  
  /**
   * Get all bookings (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} All bookings
   */
  async getAllBookings(params = {}) {
    return apiService.get('/bookings', params);
  }
  
  /**
   * Get a specific booking
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Booking data
   */
  async getBooking(id) {
    return apiService.get(`/bookings/${id}`);
  }
  
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    return apiService.post('/bookings', bookingData);
  }
  
  /**
   * Update a booking (admin only)
   * @param {string} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise<Object>} Updated booking
   */
  async updateBooking(id, bookingData) {
    return apiService.put(`/bookings/${id}`, bookingData);
  }
  
  /**
   * Cancel a booking
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Cancellation confirmation
   */
  async cancelBooking(id) {
    return apiService.delete(`/bookings/${id}`);
  }
}

export default new BookingService();
