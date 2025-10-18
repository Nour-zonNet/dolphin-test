import api from './api';
import { ENDPOINTS } from '@/constants/API_ENDPOINTS';

export const sessionReviewService = {
  /**
   * Submit multiple session reviews in a single API call
   * @param {Object} data - The review data containing reviews array
   * @param {Array} data.reviews - Array of review objects
   * @param {number} data.reviews[].class_session_id - Class session ID
   * @param {number} data.reviews[].rating - Rating (1-5)
   * @param {string} data.reviews[].comment - Optional comment
   * @returns {Promise} API response
   */
  submitSessionReviews: async (data) => {
    try {
      const { reviews } = data;
      
      // Validate required fields
      if (!reviews || !Array.isArray(reviews)) {
        throw new Error('reviews array is required');
      }
      
      if (reviews.length === 0) {
        // No reviews to submit, return success
        return {
          success: true,
          message: "تم إرسال التقييمات بنجاح.",
          data: []
        };
      }
      
      // Validate each review
      reviews.forEach((review, index) => {
        if (!review.class_session_id) {
          throw new Error(`Review ${index + 1}: class_session_id is required`);
        }
        if (!review.rating || review.rating < 1 || review.rating > 5) {
          throw new Error(`Review ${index + 1}: rating must be between 1 and 5`);
        }
        // Validate comment length if provided
        if (review.comment && review.comment.length > 1000) {
          throw new Error(`Review ${index + 1}: comment must be less than 1000 characters`);
        }
      });

      // Prepare the data for API submission
      const apiData = {
        reviews: reviews.map(review => ({
          class_session_id: parseInt(review.class_session_id),
          rating: review.rating,
          comment: review.comment || ''
        }))
      };

      const response = await api.post(ENDPOINTS.SESSION_REVIEW, apiData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Validate response structure
      if (!response.data) {
        throw new Error('No response data received from server');
      }
      
      // Check if the response indicates success
      if (response.data.success === false) {
        throw new Error(response.data.message || response.data.error || 'Session reviews submission failed');
      }
      
      // Return the full response data which should include success, message, and data fields
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit session review/rating (legacy method for backward compatibility)
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
      // Validate comment length if provided
      if (reviewData.comment && reviewData.comment.length > 1000) {
        throw new Error('comment must be less than 1000 characters');
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
      throw error;
    }
  },

  /**
   * Submit multiple session reviews (legacy method for backward compatibility)
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
      throw error;
    }
  }
};

export default sessionReviewService;
