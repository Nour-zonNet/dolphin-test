import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLessons } from './useLessons';
import { LESSON_STATUS } from '../../../utils';
import { sessionReviewService } from '@/services/sessionReview';

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

  // Get stored rating data for a specific date
  const getStoredRatingData = useCallback((dateString) => {
    try {
      if (!dateString || typeof dateString !== 'string') {
        return null;
      }
      const storageKey = `${STORAGE_KEY}_${dateString}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      // Failed to parse stored rating data
      return null;
    }
  }, []);

  // Save rating data to localStorage for a specific date
  const saveRatingData = useCallback((dateString, data) => {
    try {
      if (!dateString || typeof dateString !== 'string' || !data) {
        return;
      }
      const storageKey = `${STORAGE_KEY}_${dateString}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      // Failed to save rating data
      // Silently handle localStorage errors
    }
  }, []);

  // Get sessions that are eligible for rating (today's sessions only)
  const getEligibleSessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayStr = today.toISOString().split('T')[0];
    
    const filteredSessions = items.filter((item) => {
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
      
      // Only include today's sessions - ignore yesterday's sessions
      return itemDate === todayStr;
    });

    // Remove duplicates based on session ID
    const uniqueSessions = [];
    const seenSessionIds = new Set();
    
    filteredSessions.forEach((session) => {
      const sessionId = session.class_session_id || 
                       session.id || 
                       session.session_id || 
                       session.lesson_id ||
                       session.class_id ||
                       session.group_id;
      
      if (sessionId && !seenSessionIds.has(sessionId)) {
        seenSessionIds.add(sessionId);
        uniqueSessions.push(session);
      }
    });
    
    return uniqueSessions;
  }, [items, getStoredRatingData]);

  // Check if all sessions of today have ended
  const checkAllSessionsEnded = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayStr = today.toISOString().split('T')[0];
    
    // Get all sessions from today only
    const targetSessions = items.filter((item) => {
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
    
    if (targetSessions.length === 0) {
      return true; // No sessions on target date, consider all ended
    }
    
    // Check if all sessions have ended
    // Default duration for each session (1 hour)
    const DEFAULT_SESSION_DURATION_MINUTES = 60;

    const allEnded = targetSessions.every((session) => {
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

      // Check if session has passed its end time (for today's sessions)
      if (session.start_time) {
        try {
          // Normalize start_time like "15:00:00" → "15:00"
          const [hoursStr, minutesStr] = session.start_time.split(':');
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr || '0', 10);

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
          const durationMinutes = DEFAULT_SESSION_DURATION_MINUTES;
          const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
          
          // Add 1 hour buffer after session ends before showing modal
          const bufferTime = 60 * 60 * 1000; // 1 hour in milliseconds
          const sessionEndWithBuffer = new Date(sessionEnd.getTime() + bufferTime);
          
          const hasEnded = now > sessionEndWithBuffer;
          
          return hasEnded;
        } catch (error) {
          return false;
        }
      }
      
      return false;
    });

    return allEnded;
  }, [items, getStoredRatingData]);

  // Check if we should show the rating modal
  const checkShouldShowModal = useCallback(() => {
    const todayStr = getTodayDateString();
    
    // Check today's data only - prioritize today's sessions
    const todayData = getStoredRatingData(todayStr);
    
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

    // Get eligible sessions (today's sessions only)
    const eligibleSessions = getEligibleSessions();
    
    if (eligibleSessions.length === 0) {
      return false;
    }

    // Only show modal if all today's sessions have ended (with 1 hour buffer)
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
    
    // Save rating data for today only
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
  }, [getEligibleSessions, saveRatingData, getStoredRatingData]);

  // Handle modal close (dismiss without marking as skipped)
  const handleCloseModal = useCallback(() => {
    const todayStr = getTodayDateString();
    
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: null, // User didn't rate
      reviewsSubmitted: 0,
      sessionsRated: [],
      skipped: false // Don't mark as skipped - user can dismiss accidentally
    };
    saveRatingData(todayStr, ratingData);
    
    setShouldShowModal(false);
  }, [saveRatingData, getStoredRatingData]);

  // Handle modal skip (intentional skip)
  const handleSkipModal = useCallback(() => {
    const todayStr = getTodayDateString();
    
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: null, // User didn't rate
      reviewsSubmitted: 0,
      sessionsRated: [],
      skipped: true // Mark as intentionally skipped
    };
    saveRatingData(todayStr, ratingData);
    
    setShouldShowModal(false);
  }, [saveRatingData, getStoredRatingData]);

  // Check for modal eligibility on component mount and when lessons change
  useEffect(() => {
    const checkModalEligibility = () => {
      const shouldShow = checkShouldShowModal();
      
      // Only update state if it's different to prevent unnecessary re-renders
      setShouldShowModal(prevShouldShow => {
        if (prevShouldShow !== shouldShow) {
          return shouldShow;
        }
        return prevShouldShow;
      });
    };

    // Initial check
    checkModalEligibility();

    // Set up periodic check every 10 minutes to reduce unnecessary API calls
    const intervalId = setInterval(checkModalEligibility, 10 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [items, checkShouldShowModal]);

  // Memoize eligible sessions to prevent unnecessary re-renders
  const eligibleSessions = useMemo(() => getEligibleSessions(), [getEligibleSessions]);

  return {
    shouldShowModal,
    handleSubmitRatings,
    handleCloseModal,
    handleSkipModal,
    eligibleSessions
  };
};