import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLessons } from './useLessons';
import { LESSON_STATUS } from '../../../utils';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/modalSlice';
import { MODAL_TYPES } from '@/constants/MODAL_TYPES';
import sessionReviewService from '@/services/sessionReview';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'sessionRatingModal';

// Helper function to get today's date string for storage key
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to get yesterday's date string for storage key
const getYesterdayDateString = () => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  return yesterday.toISOString().split('T')[0];
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
  
  // Check for any valid session ID field
  const hasValidId = session.id || 
                    session.class_session_id || 
                    session.session_id || 
                    session.lesson_id ||
                    session.class_id ||
                    session.group_id;
  
  if (!hasValidId) {
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
  const location = useLocation();

  // Get stored rating data for a specific date
  const getStoredRatingData = useCallback((dateString) => {
    try {
      const storageKey = `${STORAGE_KEY}_${dateString}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }, []);

  // Save rating data to localStorage for a specific date
  const saveRatingData = useCallback((dateString, data) => {
    try {
      const storageKey = `${STORAGE_KEY}_${dateString}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, []);

  // Get sessions that are eligible for rating (today's sessions)
  const getEligibleSessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayStr = today.toISOString().split('T')[0];
    
    return items.filter((item) => {
      // Validate session data first
      const validation = validateSessionData(item);
      if (!validation.isValid) {
        return false;
      }
      
      // Handle different date formats
      let itemDate;
      try {
        const dateObj = new Date(item.date);
        if (isNaN(dateObj.getTime())) {
          return false;
        }
        itemDate = dateObj.toISOString().split('T')[0];
      } catch (error) {
        return false;
      }
      
      // Only include sessions from today
      if (itemDate !== todayStr) {
        return false;
      }
      
      // Include all today's sessions regardless of status
      // The modal will only show after all sessions have ended
      return true;
    });
  }, [items]);

  // Check if all sessions of today have ended
  const checkAllSessionsEnded = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = today.toISOString().split('T')[0];
    
    // Get all sessions from today
    const todaySessions = items.filter((item) => {
      const validation = validateSessionData(item);
      if (!validation.isValid) return false;
      
      let itemDate;
      try {
        const dateObj = new Date(item.date);
        if (isNaN(dateObj.getTime())) return false;
        itemDate = dateObj.toISOString().split('T')[0];
      } catch (error) {
        return false;
      }
      
      return itemDate === todayStr;
    });
    
    if (todaySessions.length === 0) {
      return true; // No sessions today, consider all ended
    }
    
    // Check if all sessions have ended
    const allEnded = todaySessions.every((session) => {
      const completedStatuses = [
        LESSON_STATUS.ENDED,
        'ended',
        'completed',
        'finished'
      ];
      
      // If session has completed status, it's ended
      if (completedStatuses.includes(session.status)) {
        return true;
      }
      
      // Check if session has passed its end time
      if (session.start_time) {
        try {
          const [hours, minutes] = session.start_time.split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) {
            return false;
          }
          
          const sessionStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            hours,
            minutes
          );
          
          // Use default duration of 60 minutes since API doesn't provide duration
          // This is a reasonable assumption for most educational sessions
          const durationMinutes = 60; // Fixed duration since API doesn't provide this field
          const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
          
          const hasEnded = now > sessionEnd;
          
          return hasEnded;
        } catch (error) {
          return false;
        }
      }
      
      return false;
    });
    
    return allEnded;
  }, [items]);

  // Check if we should show the rating modal
  const checkShouldShowModal = useCallback(() => {
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    
    // Check if we've already shown the modal for today
    const todayData = getStoredRatingData(todayStr);
    const yesterdayData = getStoredRatingData(yesterdayStr);
    
    // If we've already shown the modal today (either submitted or skipped), don't show again
    if (todayData?.lastShown) {
      return false;
    }

    // If user has skipped the modal today, don't show again
    if (todayData?.skipped) {
      return false;
    }

    // Check if user has already submitted reviews for today's sessions
    if (todayData?.lastRatingDate) {
      return false;
    }

    // Get eligible sessions (today's sessions)
    const eligibleSessions = getEligibleSessions();
    
    if (eligibleSessions.length === 0) {
      return false;
    }

    // Only show modal if all sessions of today have ended
    const allSessionsEnded = checkAllSessionsEnded();
    if (!allSessionsEnded) {
      return false;
    }

    return true;
  }, [getEligibleSessions, getStoredRatingData, checkAllSessionsEnded]);

  // Handle modal submission
  const handleSubmitRatings = useCallback(async (data) => {
    const { reviews } = data;
    const eligibleSessions = getEligibleSessions();
    
    if (eligibleSessions.length === 0) {
      setShouldShowModal(false);
      return;
    }
    
    try {
      // Submit all reviews in a single API call
      const response = await sessionReviewService.submitSessionReviews({ reviews });
      
      // Validate API response structure
      if (!response) {
        throw new Error('Session reviews submission failed: No response received');
      }
      
      // Check if the response indicates failure
      if (response.success === false) {
        throw new Error(`Session reviews submission failed: ${response.message || response.error || 'Unknown error'}`);
      }
      
      // Save rating data for today
      const todayStr = getTodayDateString();
      const ratingData = {
        lastShown: new Date().toISOString(),
        lastRatingDate: new Date().toISOString(),
        reviewsSubmitted: reviews.length,
        sessionsRated: reviews.map(r => r.class_session_id),
        skipped: false // User submitted ratings, didn't skip
      };
      saveRatingData(todayStr, ratingData);
      
      setShouldShowModal(false);
    } catch (error) {
      // Re-throw the error so the modal can handle it
      throw error;
    }
  }, [getEligibleSessions, saveRatingData]);

  // Handle modal close/skip
  const handleCloseModal = useCallback(() => {
    const todayStr = getTodayDateString();
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: null, // User didn't rate
      reviewsSubmitted: 0,
      sessionsRated: [],
      skipped: true // Mark as skipped to prevent showing again
    };
    saveRatingData(todayStr, ratingData);
    
    setShouldShowModal(false);
  }, [saveRatingData]);

  // Check for modal on component mount and when lessons change
  useEffect(() => {
    const checkAndShowModal = () => {
      const shouldShow = checkShouldShowModal();
      const eligibleSessions = getEligibleSessions();
      
      // Only update state if it's different to prevent unnecessary re-renders
      setShouldShowModal(prevShouldShow => {
        if (prevShouldShow !== shouldShow) {
          return shouldShow;
        }
        return prevShouldShow;
      });
      
      if (shouldShow && eligibleSessions.length > 0) {
        // Add a small delay to ensure the page is fully loaded
        const timer = setTimeout(() => {
          dispatch(openModal({
            type: MODAL_TYPES.SESSION_RATING,
            props: {
              sessions: eligibleSessions,
              onSubmit: handleSubmitRatings,
              onClose: handleCloseModal
            }
          }));
        }, 500);
        
        return () => clearTimeout(timer);
      }
    };

    // Initial check
    checkAndShowModal();

    // Set up periodic check every 10 minutes to reduce unnecessary API calls
    const intervalId = setInterval(checkAndShowModal, 10 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [items, checkShouldShowModal, dispatch, getEligibleSessions, handleSubmitRatings, handleCloseModal, location.pathname]);

  // Memoize eligible sessions to prevent unnecessary re-renders
  const eligibleSessions = useMemo(() => getEligibleSessions(), [items]);

  return {
    shouldShowModal,
    handleSubmitRatings,
    handleCloseModal,
    eligibleSessions
  };
};