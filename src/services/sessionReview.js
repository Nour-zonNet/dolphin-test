import api from './api';
import { ENDPOINTS } from '@/constants/API_ENDPOINTS';

export const sessionReviewService = {
  /**
   * Submit session review/rating
   * @param {Object} reviewData - The review data
   * @param {number} reviewData.class_session_id - Class session ID
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Optional comment
   * @returns {Promise} API response
   */
  submitSessionReview: async (reviewData) => {
    try {
      // Validate required fields
      if (!reviewData.class_session_id) {
        throw new Error('class_session_id is required');
      }
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('rating must be between 1 and 5');
      }

      const response = await api.post(ENDPOINTS.SESSION_REVIEW, reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Log successful response for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Session review submitted successfully:', {
          request: reviewData,
          response: response.data
        });
      }

      // Return the full response data which should include success, message, and data fields
      return response.data;
    } catch (error) {
      console.error('Error submitting session review:', {
        reviewData,
        error: error.response?.data || error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  /**
   * Submit multiple session reviews
   * @param {Array} reviews - Array of review objects
   * @returns {Promise} Array of API responses
   */
  submitMultipleReviews: async (reviews) => {
    try {
      const promises = reviews.map(review => 
        sessionReviewService.submitSessionReview(review)
      );
      const responses = await Promise.all(promises);
      return responses;
    } catch (error) {
      console.error('Error submitting multiple session reviews:', error);
      throw error;
    }
  }
};

export default sessionReviewService;
