import api from './api';
import { ENDPOINTS } from '@/constants/API_ENDPOINTS';

export const sessionReviewService = {
  /**
   * Submit session review/rating
   * @param {Object} reviewData - The review data
   * @param {number} reviewData.class_session_id - Class session ID (preferred)
   * @param {number} reviewData.sessionId - Alternative session ID field
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Optional comment
   * @returns {Promise} API response
   */
  submitSessionReview: async (reviewData) => {
    try {
      // Use class_session_id if available, otherwise fall back to sessionId
      const sessionId = reviewData.class_session_id || reviewData.sessionId;
      
      // Validate required fields
      if (!sessionId) {
        throw new Error('class_session_id or sessionId is required');
      }
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('rating must be between 1 and 5');
      }

      // Prepare the data for API submission
      const apiData = {
        class_session_id: sessionId,
        rating: reviewData.rating,
        comment: reviewData.comment || ''
      };

      const response = await api.post(ENDPOINTS.SESSION_REVIEW, apiData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Log successful response for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Session review submitted successfully:', {
          request: apiData,
          response: response.data,
          status: response.status
        });
      }

      // Validate response structure
      if (!response.data) {
        throw new Error('No response data received from server');
      }
      
      // Check if the response indicates success
      if (response.data.success === false) {
        throw new Error(response.data.message || response.data.error || 'Session review submission failed');
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
