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
      console.error('Error reading rating data from localStorage:', error);
      return null;
    }
  }, []);

  // Save rating data to localStorage for a specific date
  const saveRatingData = useCallback((dateString, data) => {
    try {
      const storageKey = `${STORAGE_KEY}_${dateString}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving rating data to localStorage:', error);
    }
  }, []);

  // Get sessions that are eligible for rating (yesterday's completed sessions)
  const getEligibleSessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // For testing: Show sessions from yesterday if available, otherwise show any recent sessions
    if (process.env.NODE_ENV === 'development') {
      // First try to get yesterday's sessions
      const yesterdaySessions = items.filter((item) => {
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
        
        return itemDate === yesterdayStr;
      });
      
      if (yesterdaySessions.length > 0) {
        console.log('Development mode: Using yesterday sessions for modal:', yesterdaySessions.length);
        return yesterdaySessions;
      }
      
      // If no yesterday sessions, show any recent sessions for testing
      const testSessions = items.filter((item) => {
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
        
        // For testing, include sessions from the last 3 days
        const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
        const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];
        
        return itemDate >= threeDaysAgoStr;
      }).slice(0, 2); // Limit to 2 sessions for testing
      
      if (testSessions.length > 0) {
        console.log('Development mode: Using test sessions for modal:', testSessions.length);
        return testSessions;
      }
    }
    
    return items.filter((item) => {
      // Validate session data first
      const validation = validateSessionData(item);
      if (!validation.isValid) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Session validation failed:', validation.errors, item);
        }
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
      
      // Only include sessions from yesterday (completed sessions from previous day)
      if (itemDate !== yesterdayStr) {
        return false;
      }
      
      // Check if session is completed
      const completedStatuses = [
        LESSON_STATUS.ENDED,
        'ended',
        'completed',
        'finished'
      ];
      
      // For yesterday's sessions, include them if they have a completed status
      if (completedStatuses.includes(item.status)) {
        return true;
      }
      
      // Also include yesterday's sessions that have passed their end time
      if (item.start_time) {
        try {
          const [hours, minutes] = item.start_time.split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) {
            return false;
          }
          
          const sessionStart = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            hours,
            minutes
          );
          
          const durationMinutes = item.duration || 60;
          const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
          
          // Session is completed if it's past the end time
          return now > sessionEnd;
        } catch (error) {
          return false;
        }
      }
      
      return false;
    });
  }, [items]);

  // Check if we should show the rating modal
  const checkShouldShowModal = useCallback(() => {
    // Only show modal on schedule page
    if (!location.pathname.includes('/schedule')) {
      return false;
    }
    
    const eligibleSessions = getEligibleSessions();
    
    if (eligibleSessions.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Modal check: No eligible sessions to rate');
      }
      return false;
    }

    // Check if we've already shown the modal for these sessions
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    
    const todayData = getStoredRatingData(todayStr);
    const yesterdayData = getStoredRatingData(yesterdayStr);
    
    // If we've already shown the modal today, don't show again
    if (todayData?.lastShown) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Modal check: Already shown modal today');
      }
      return false;
    }

    // For testing: Always show modal in development mode if we have sessions
    if (process.env.NODE_ENV === 'development') {
      console.log('Modal check: Development mode - showing modal for testing');
      console.log('Modal check: Showing modal for eligible sessions:', eligibleSessions.length);
      return true;
    }

    // In production, show modal for yesterday's sessions
    console.log('Modal check: Showing modal for eligible sessions:', eligibleSessions.length);
    return true;
  }, [getEligibleSessions, getStoredRatingData, location.pathname]);

  // Handle modal submission
  const handleSubmitRatings = useCallback(async (data) => {
    const { ratings, comments } = data;
    const eligibleSessions = getEligibleSessions();
    
    if (eligibleSessions.length === 0) {
      console.warn('No sessions available for rating');
      setShouldShowModal(false);
      return;
    }
    
    console.log('Submitting ratings:', { ratings, comments, eligibleSessions });
    
    try {
      // Prepare review data for each session that has a rating
      const reviewPromises = eligibleSessions.map(async (session, index) => {
        const sessionKey = `session${index + 1}`;
        const rating = ratings[sessionKey];
        const comment = comments[sessionKey] || '';
        
        // Only process sessions with ratings (rating is optional)
        if (!rating || rating <= 0) {
          return null;
        }
        
        // Extract session ID - use class_session_id as primary identifier
        const classSessionId = session.class_session_id || 
                              session.id || 
                              session.session_id || 
                              session.lesson_id ||
                              session.class_id ||
                              session.group_id;
        
        // Validate that we have a valid session ID
        if (!classSessionId) {
          console.error(`Session ${index + 1} has no valid class_session_id:`, session);
          throw new Error(`Session ${index + 1} is missing required session ID`);
        }
        
        // Ensure class_session_id is a number
        const numericSessionId = parseInt(classSessionId);
        if (isNaN(numericSessionId)) {
          console.error(`Session ${index + 1} has invalid class_session_id format:`, classSessionId);
          throw new Error(`Session ${index + 1} has invalid session ID format`);
        }
        
        // Validate rating is within valid range
        if (rating < 1 || rating > 5) {
          console.error(`Session ${index + 1} has invalid rating:`, rating);
          throw new Error(`Session ${index + 1} has invalid rating value`);
        }
        
        const reviewData = {
          class_session_id: numericSessionId,
          rating: rating,
          comment: comment || ''
        };
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Submitting review data:', reviewData);
        }
        
        const response = await sessionReviewService.submitSessionReview(reviewData);
        
        // Validate API response structure
        if (!response) {
          console.error(`Session ${index + 1} review failed: No response received`);
          throw new Error(`Session ${index + 1} review submission failed: No response received`);
        }
        
        // Check if the response indicates failure
        if (response.success === false) {
          console.error(`Session ${index + 1} review failed:`, response);
          throw new Error(`Session ${index + 1} review submission failed: ${response.message || response.error || 'Unknown error'}`);
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Session ${index + 1} review submitted successfully:`, response);
        }
        
        return response;
      });
      
      // Filter out null values and submit reviews
      const validReviews = reviewPromises.filter(promise => promise !== null);
      
      // If no sessions were rated, that's still a successful submission
      if (validReviews.length === 0) {
        console.log('No sessions were rated - submission successful');
      } else {
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
      }
      
      // Save rating data for today
      const todayStr = getTodayDateString();
      const ratingData = {
        lastShown: new Date().toISOString(),
        lastRatingDate: new Date().toISOString(),
        ratings: ratings,
        sessionsRated: eligibleSessions.map(s => s.class_session_id || s.id)
      };
      saveRatingData(todayStr, ratingData);
      
      setShouldShowModal(false);
    } catch (error) {
      console.error('Error submitting session reviews:', error);
      
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
      ratings: null
    };
    saveRatingData(todayStr, ratingData);
    
    setShouldShowModal(false);
  }, [saveRatingData]);

  // Check for modal on component mount and when lessons change
  useEffect(() => {
    const checkAndShowModal = () => {
      const shouldShow = checkShouldShowModal();
      const eligibleSessions = getEligibleSessions();
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('SessionRatingModal Debug:', {
          shouldShow,
          itemsCount: items.length,
          eligibleSessionsCount: eligibleSessions.length,
          currentTime: new Date().toISOString(),
          todayDate: getTodayDateString(),
          yesterdayDate: getYesterdayDateString(),
          eligibleSessions: eligibleSessions.map(s => ({
            id: s.id,
            class_session_id: s.class_session_id,
            status: s.status,
            start_time: s.start_time,
            duration: s.duration,
            teacher_name: s.teacher_name,
            subject: s.subject,
            date: s.date,
            teacher: s.teacher
          })),
          allItems: items.slice(0, 3).map(s => ({
            id: s.id,
            class_session_id: s.class_session_id,
            status: s.status,
            date: s.date,
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

    // Set up periodic check every 2 minutes
    const intervalId = setInterval(checkAndShowModal, 2 * 60 * 1000);

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