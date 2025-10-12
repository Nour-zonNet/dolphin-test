// Test file for session review service
// This is just for verification - not a real test file

import sessionReviewService from '@/services/sessionReview';

// Example usage of the session review service
const testSessionReview = async () => {
  try {
    // Test single review submission
    const reviewData = {
      sessionId: 12345,
      rating: 5,
      comment: "ممتاز جداً"
    };
    
    const response = await sessionReviewService.submitSessionReview(reviewData);
    console.log('Single review response:', response);
    
    // Test multiple reviews submission
    const multipleReviews = [
      {
        sessionId: 12345,
        rating: 5,
        comment: "ممتاز جداً"
      },
      {
        sessionId: 12346,
        rating: 4,
        comment: "جيد"
      }
    ];
    
    const responses = await sessionReviewService.submitMultipleReviews(multipleReviews);
    console.log('Multiple reviews response:', responses);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

export default testSessionReview;
