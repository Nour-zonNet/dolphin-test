import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLessons } from './useLessons';
import { LESSON_STATUS } from '../../../utils';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/modalSlice';
import { MODAL_TYPES } from '@/constants/MODAL_TYPES';
import sessionReviewService from '@/services/sessionReview';

const STORAGE_KEY = 'sessionRatingModal';
const RATING_COOLDOWN_HOURS = 24; // Don't show modal again for 24 hours after rating

// Helper function to debug session data structure
// This helps troubleshoot session ID issues by showing which fields are available
const debugSessionStructure = (session, index) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Session ${index + 1} Structure:`, {
      id: session.id,
      class_session_id: session.class_session_id,
      session_id: session.session_id,
      lesson_id: session.lesson_id,
      date: session.date,
      status: session.status,
      teacher_name: session.teacher_name,
      subject: session.subject,
      start_time: session.start_time,
      duration: session.duration,
      allKeys: Object.keys(session)
    });
  }
};

// Helper function to validate session data
const validateSessionData = (session) => {
  const errors = [];
  
  if (!session.date) {
    errors.push('Missing date');
  }
  
  if (!session.start_time) {
    errors.push('Missing start_time');
  }
  
  if (!session.class_session_id && !session.session_id && !session.id && !session.lesson_id) {
    errors.push('Missing valid session ID');
  }
  
  if (session.status === LESSON_STATUS.CANCELLED) {
    errors.push('Session is cancelled');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const useSessionRatingModal = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { items } = useLessons();
  const dispatch = useDispatch();

  // Get stored rating data
  const getStoredRatingData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading rating data from localStorage:', error);
      return null;
    }
  }, []);

  // Save rating data to localStorage
  const saveRatingData = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving rating data to localStorage:', error);
    }
  }, []);

  // Check if all sessions from today are completed
  const checkTodaySessionsCompleted = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get today's date in YYYY-MM-DD format
    const todayStr = today.toISOString().split('T')[0];
    
    // Filter sessions for today (excluding cancelled sessions)
    const todaySessions = items.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === todayStr && item.status !== LESSON_STATUS.CANCELLED;
    });

    if (todaySessions.length === 0) {
      return false; // No sessions today
    }

    // Check if all sessions from today are completed
    const allCompleted = todaySessions.every((session) => {
      // Check if session status is explicitly 'ended'
      if (session.status === LESSON_STATUS.ENDED) {
        return true;
      }
      
      // If no explicit status, check if session time has passed
      if (session.start_time) {
        const [hours, minutes] = session.start_time.split(':').map(Number);
        const sessionStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          minutes
        );
        
        const durationMinutes = session.duration || 60;
        const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
        
        // Session is completed if it's past the end time
        // Add a 10-minute buffer to ensure session has truly ended
        const bufferTime = new Date(sessionEnd.getTime() + 10 * 60000);
        return now > bufferTime;
      }
      
      return false;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('Session completion check:', {
        totalSessions: todaySessions.length,
        allCompleted,
        currentTime: now.toISOString(),
        sessions: todaySessions.map(s => {
          const sessionStart = s.start_time ? (() => {
            const [hours, minutes] = s.start_time.split(':').map(Number);
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
          })() : null;
          
          const sessionEnd = sessionStart ? (() => {
            const durationMinutes = s.duration || 60;
            return new Date(sessionStart.getTime() + durationMinutes * 60000);
          })() : null;
          
          const bufferTime = sessionEnd ? new Date(sessionEnd.getTime() + 10 * 60000) : null;
          
          return {
            id: s.id,
            class_session_id: s.class_session_id,
            start_time: s.start_time,
            duration: s.duration,
            status: s.status,
            teacher_name: s.teacher_name,
            sessionStart: sessionStart?.toISOString(),
            sessionEnd: sessionEnd?.toISOString(),
            bufferTime: bufferTime?.toISOString(),
            isCompleted: s.status === LESSON_STATUS.ENDED || (bufferTime && now > bufferTime)
          };
        })
      });
    }

    return allCompleted;
  }, [items]);

  // Check if we should show the rating modal
  const checkShouldShowModal = useCallback(() => {
    // First check if there are any sessions to rate
    const sessionsCompleted = checkTodaySessionsCompleted();
    if (!sessionsCompleted) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Modal check: No completed sessions to rate');
      }
      return false; // No completed sessions to rate
    }

    const storedData = getStoredRatingData();
    
    if (!storedData) {
      // No stored data, show modal if sessions are completed
      if (process.env.NODE_ENV === 'development') {
        console.log('Modal check: No stored data, showing modal');
      }
      return true;
    }

    // Check if user has already rated for this period
    const lastRatingDate = storedData.lastRatingDate ? new Date(storedData.lastRatingDate) : null;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (lastRatingDate && lastRatingDate >= todayStart) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Modal check: Already rated today, not showing modal');
      }
      return false; // Already rated today
    }

    // Check if we've already shown the modal today and user closed it without rating
    const lastShown = storedData.lastShown ? new Date(storedData.lastShown) : null;
    
    if (lastShown) {
      const lastShownStart = new Date(lastShown.getFullYear(), lastShown.getMonth(), lastShown.getDate());
      
      // If modal was shown today and user didn't rate, show it again
      if (lastShownStart >= todayStart && !lastRatingDate) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Modal check: Modal was shown today but no rating, showing again');
        }
        return true;
      }

      // If modal was shown yesterday or earlier and user didn't rate, show it again
      if (lastShownStart < todayStart && !lastRatingDate) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Modal check: Modal was shown earlier but no rating, showing again');
        }
        return true;
      }
    }

    // Show modal if sessions are completed and conditions are met
    if (process.env.NODE_ENV === 'development') {
      console.log('Modal check: All conditions met, showing modal');
    }
    return true;
  }, [getStoredRatingData, checkTodaySessionsCompleted]);

  // Get today's sessions for rating
  const getTodaySessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = today.toISOString().split('T')[0];
    
    return items.filter((item) => {
      // Validate session data first
      const validation = validateSessionData(item);
      if (!validation.isValid) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Invalid session data:', {
            session: item,
            errors: validation.errors
          });
        }
        return false;
      }
      
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      
      // Only include sessions from today
      if (itemDate !== todayStr) {
        return false;
      }
      
      // Include sessions that are explicitly marked as ended
      if (item.status === LESSON_STATUS.ENDED) {
        return true;
      }
      
      // Include sessions that have passed their end time
      if (item.start_time) {
        const [hours, minutes] = item.start_time.split(':').map(Number);
        const sessionStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          minutes
        );
        
        const durationMinutes = item.duration || 60;
        const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
        
        // Add a 10-minute buffer to ensure session has truly ended
        const bufferTime = new Date(sessionEnd.getTime() + 10 * 60000);
        return now > bufferTime;
      }
      
      return false;
    });
  }, [items]);

  // Handle modal submission
  const handleSubmitRatings = useCallback(async (data) => {
    const { ratings, comments } = data;
    const todaySessions = getTodaySessions();
    
    if (todaySessions.length === 0) {
      console.warn('No sessions available for rating');
      setShouldShowModal(false);
      return;
    }
    
    console.log('Submitting ratings:', { ratings, comments, todaySessions });
    
    try {
      // Prepare review data for each session
      const reviewPromises = todaySessions.map(async (session, index) => {
        const sessionKey = `session${index + 1}`;
        const rating = ratings[sessionKey];
        const comment = comments[sessionKey] || '';
        
        // Extract session ID with better validation - prioritize class_session_id
        // The API expects class_session_id, so we need to ensure we have the correct field
        const classSessionId = session.class_session_id || session.session_id || session.id || session.lesson_id;
        
        // Debug session structure for troubleshooting
        debugSessionStructure(session, index);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Session ${index + 1}:`, {
            sessionKey,
            rating,
            comment,
            class_session_id: classSessionId,
            sessionData: session,
            availableFields: {
              class_session_id: session.class_session_id,
              id: session.id,
              session_id: session.session_id,
              lesson_id: session.lesson_id
            }
          });
        }
        
        if (rating > 0) {
          // Validate that we have a valid session ID
          if (!classSessionId) {
            console.error(`Session ${index + 1} has no valid class_session_id:`, session);
            throw new Error(`Session ${index + 1} is missing required session ID`);
          }
          
          // Validate rating is within valid range
          if (rating < 1 || rating > 5) {
            console.error(`Session ${index + 1} has invalid rating:`, rating);
            throw new Error(`Session ${index + 1} has invalid rating value`);
          }
          
          const reviewData = {
            class_session_id: classSessionId,
            rating: rating,
            comment: comment || '' // Ensure comment is always a string
          };
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Submitting review data:', reviewData);
          }
          
          const response = await sessionReviewService.submitSessionReview(reviewData);
          
          // Validate API response structure
          if (!response || !response.success) {
            console.error(`Session ${index + 1} review failed:`, response);
            throw new Error(`Session ${index + 1} review submission failed: ${response?.message || 'Unknown error'}`);
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`Session ${index + 1} review submitted successfully:`, response);
          }
          
          return response;
        }
        return null;
      });
      
      // Filter out null values and submit reviews
      const validReviews = reviewPromises.filter(promise => promise !== null);
      if (validReviews.length > 0) {
        const results = await Promise.all(validReviews);
        
        // Validate that all reviews were submitted successfully
        const failedReviews = results.filter(result => !result || !result.success);
        if (failedReviews.length > 0) {
          console.error('Some reviews failed to submit:', failedReviews);
          throw new Error(`${failedReviews.length} out of ${validReviews.length} reviews failed to submit`);
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Session reviews submitted successfully:', results);
        }
      } else {
        console.warn('No valid reviews to submit');
      }
      
      // Save rating data
      const ratingData = {
        lastShown: new Date().toISOString(),
        lastRatingDate: new Date().toISOString(),
        ratings: ratings,
        sessionsRated: todaySessions.map(s => s.class_session_id || s.id)
      };
      saveRatingData(ratingData);
      
      setShouldShowModal(false);
    } catch (error) {
      console.error('Error submitting session reviews:', error);
      
      // Check if it's a validation error (missing session ID or invalid rating)
      if (error.message && (
        error.message.includes('missing required session ID') ||
        error.message.includes('invalid rating value')
      )) {
        console.error('Validation error:', error.message);
        // Don't save rating data if there are validation errors
        // This allows the modal to be shown again with corrected data
        return;
      }
      
      // Check if it's an API error
      if (error.response) {
        console.error('API Error:', {
          status: error.response.status,
          data: error.response.data,
          message: error.response.data?.message || 'Unknown API error'
        });
        
        // For API errors, we might want to show an error message to the user
        // but still prevent the modal from showing again to avoid infinite loops
      }
      
      // Save the rating data to prevent showing modal again for other errors
      // This prevents infinite loops while still allowing the user to try again later
      const ratingData = {
        lastShown: new Date().toISOString(),
        lastRatingDate: new Date().toISOString(),
        ratings: ratings,
        sessionsRated: todaySessions.map(s => s.class_session_id || s.id),
        error: error.message // Store error for debugging
      };
      saveRatingData(ratingData);
      setShouldShowModal(false);
    }
  }, [saveRatingData, getTodaySessions]);

  // Handle modal close/skip
  const handleCloseModal = useCallback(() => {
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: null, // User didn't rate
      ratings: null
    };
    saveRatingData(ratingData);
    
    setShouldShowModal(false);
  }, [saveRatingData]);

  // Check for modal on component mount and when lessons change
  useEffect(() => {
    const checkAndShowModal = () => {
      const shouldShow = checkShouldShowModal();
      const todaySessions = getTodaySessions();
      
      // Debug logging (can be removed in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('SessionRatingModal Debug:', {
          shouldShow,
          itemsCount: items.length,
          todaySessionsCount: todaySessions.length,
          currentTime: new Date().toISOString(),
          todaySessions: todaySessions.map(s => ({
            id: s.id,
            class_session_id: s.class_session_id,
            status: s.status,
            start_time: s.start_time,
            duration: s.duration,
            teacher_name: s.teacher_name,
            subject: s.subject
          }))
        });
      }
      
      // Only update state if it's different to prevent unnecessary re-renders
      setShouldShowModal(prevShouldShow => {
        if (prevShouldShow !== shouldShow) {
          return shouldShow;
        }
        return prevShouldShow;
      });
      
      if (shouldShow && todaySessions.length > 0) {
        // Add a small delay to ensure the page is fully loaded
        const timer = setTimeout(() => {
          dispatch(openModal({
            type: MODAL_TYPES.SESSION_RATING,
            props: {
              sessions: todaySessions,
              onSubmit: handleSubmitRatings,
              onClose: handleCloseModal
            }
          }));
        }, 500); // Reduced delay for production
        
        return () => clearTimeout(timer);
      }
    };

    // Initial check
    checkAndShowModal();

    // Set up periodic check every 2 minutes to catch sessions that end while user is on the page
    const intervalId = setInterval(checkAndShowModal, 2 * 60 * 1000); // 2 minutes

    return () => {
      clearInterval(intervalId);
    };
  }, [items, checkShouldShowModal, dispatch, getTodaySessions, handleSubmitRatings, handleCloseModal]);

  // Memoize today sessions to prevent unnecessary re-renders
  const todaySessions = useMemo(() => getTodaySessions(), [items]);

  return {
    shouldShowModal,
    handleSubmitRatings,
    handleCloseModal,
    todaySessions
  };
};
