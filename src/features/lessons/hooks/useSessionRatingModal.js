import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLessons } from './useLessons';
import { LESSON_STATUS } from '../../../utils';
import { useModal } from '@/components/feedback/modal/useModal';
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

// Helper function to get the correct session ID for API submission
const GET_SESSION_ID_FOR_API = (session) => {
  // Priority order for session ID fields
  return session.class_session_id || 
         session.id || 
         session.session_id || 
         session.lesson_id ||
         session.class_id ||
         session.group_id;
};

export const useSessionRatingModal = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { items } = useLessons();
  const { openSessionRatingModal } = useModal();
  const location = useLocation();

  // Get stored rating data for a specific date
  const getStoredRatingData = useCallback((dateString) => {
    try {
      const storageKey = `${STORAGE_KEY}_${dateString}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Save rating data to localStorage for a specific date
  const saveRatingData = useCallback((dateString, data) => {
    try {
      const storageKey = `${STORAGE_KEY}_${dateString}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // Silently handle localStorage errors
    }
  }, []);

  // Get sessions that are eligible for rating (sessions that ended yesterday and haven't been rated)
  const getEligibleSessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if we should show yesterday's sessions
    const yesterdayData = getStoredRatingData(yesterdayStr);
    const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
    
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
      } catch {
        return false;
      }
      
      // Only include yesterday's sessions if they weren't rated
      if (shouldShowYesterdaySessions && itemDate === yesterdayStr) {
        return true;
      }
      
      return false;
    });
  }, [items, getStoredRatingData]);

  // Check if all sessions of yesterday have ended (no buffer time)
  const checkAllSessionsEnded = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if we should show yesterday's sessions
    const yesterdayData = getStoredRatingData(yesterdayStr);
    const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
    
    // Only check yesterday's sessions
    if (!shouldShowYesterdaySessions) {
      return false;
    }
    
    // Get all sessions from yesterday
    const yesterdaySessions = items.filter((item) => {
      const validation = validateSessionData(item);
      if (!validation.isValid) return false;
      
      let itemDate;
      try {
        const dateObj = new Date(item.date);
        if (isNaN(dateObj.getTime())) return false;
        itemDate = dateObj.toISOString().split('T')[0];
      } catch {
        return false;
      }
      
      return itemDate === yesterdayStr;
    });
    
    if (yesterdaySessions.length === 0) {
      return true; // No sessions yesterday, consider all ended
    }
    
    // Default duration for each session (1 hour)
    const DEFAULT_SESSION_DURATION_MINUTES = 60;
    
    // Find the latest session end time from yesterday
    let latestSessionEndTime = null;
    
    yesterdaySessions.forEach((session) => {
      if (session.start_time) {
        try {
          // Normalize start_time like "15:00:00" → "15:00"
          const [hoursStr, minutesStr] = session.start_time.split(':');
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr || '0', 10);

          if (!isNaN(hours) && !isNaN(minutes)) {
            const sessionStart = new Date(
              yesterday.getFullYear(),
              yesterday.getMonth(),
              yesterday.getDate(),
              hours,
              minutes
            );

            // Add default duration (1 hour)
            const sessionEnd = new Date(sessionStart.getTime() + DEFAULT_SESSION_DURATION_MINUTES * 60 * 1000);
            
            if (!latestSessionEndTime || sessionEnd > latestSessionEndTime) {
              latestSessionEndTime = sessionEnd;
            }
          }
        } catch {
          // Skip invalid session times
        }
      }
    });
    
    if (!latestSessionEndTime) {
      // If no valid session times found, assume sessions ended at end of yesterday
      const endOfYesterday = new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1);
      latestSessionEndTime = endOfYesterday;
    }
    
    // Check if current time is after the latest session ended (no buffer)
    return now.getTime() > latestSessionEndTime.getTime();
  }, [items, getStoredRatingData]);

  // Check if we should show the rating modal
  const checkShouldShowModal = useCallback(() => {
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    
    // Check stored data for both today and yesterday
    const todayData = getStoredRatingData(todayStr);
    const yesterdayData = getStoredRatingData(yesterdayStr);
    
    // Check if we should show yesterday's sessions
    const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
    
    // If we've already shown the modal today for yesterday's sessions, don't show again
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

    // Only show modal if we should show yesterday's sessions
    if (!shouldShowYesterdaySessions) {
      return false;
    }

    // Get eligible sessions (only yesterday's sessions)
    const eligibleSessions = getEligibleSessions();
    
    if (eligibleSessions.length === 0) {
      return false;
    }

    // Only show modal if all sessions of yesterday have ended (no buffer)
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
    
    // Determine which date to save the rating data for (always yesterday's sessions)
    const yesterdayStr = getYesterdayDateString();
    
    // Save rating data for yesterday's sessions
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: new Date().toISOString(),
      reviewsSubmitted: reviews.length,
      sessionsRated: reviews.map(r => r.class_session_id),
      skipped: false // User submitted ratings, didn't skip
    };
    saveRatingData(yesterdayStr, ratingData);
    
    setShouldShowModal(false);
  }, [getEligibleSessions, saveRatingData]);

  // Handle modal close/skip
  const handleCloseModal = useCallback(() => {
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    
    // Save skip data for today (so it doesn't show again today)
    const skipData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: null, // User didn't rate
      reviewsSubmitted: 0,
      sessionsRated: [],
      skipped: true // Mark as skipped to prevent showing again today
    };
    saveRatingData(todayStr, skipData);
    
    // Also mark yesterday's sessions as skipped so they don't show again
    const yesterdayData = getStoredRatingData(yesterdayStr);
    if (yesterdayData && !yesterdayData.skipped) {
      const updatedYesterdayData = {
        ...yesterdayData,
        skipped: true,
        lastShown: new Date().toISOString()
      };
      saveRatingData(yesterdayStr, updatedYesterdayData);
    }
    
    setShouldShowModal(false);
  }, [saveRatingData, getStoredRatingData]);

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
          openSessionRatingModal(
            eligibleSessions,
            handleSubmitRatings,
            handleCloseModal
          );
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
  }, [items, checkShouldShowModal, openSessionRatingModal, getEligibleSessions, handleSubmitRatings, handleCloseModal, location.pathname]);

  // Memoize eligible sessions to prevent unnecessary re-renders
  const eligibleSessions = useMemo(() => getEligibleSessions(), [getEligibleSessions]);

  return {
    shouldShowModal,
    handleSubmitRatings,
    handleCloseModal,
    eligibleSessions
  };
};