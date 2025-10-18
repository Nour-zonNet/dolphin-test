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

  // Get sessions that are eligible for rating (today's sessions or yesterday's if not rated)
  const getEligibleSessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const todayStr = today.toISOString().split('T')[0];
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
      } catch (error) {
        return false;
      }
      
      // Include today's sessions
      if (itemDate === todayStr) {
        return true;
      }
      
      // Include yesterday's sessions if they weren't rated
      if (shouldShowYesterdaySessions && itemDate === yesterdayStr) {
        return true;
      }
      
      return false;
    });
  }, [items, getStoredRatingData]);

  // Check if all sessions of the target date have ended (today or yesterday)
  const checkAllSessionsEnded = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if we should show yesterday's sessions
    const yesterdayData = getStoredRatingData(yesterdayStr);
    const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
    
    // Determine which date to check
    const targetDate = shouldShowYesterdaySessions ? yesterday : today;
    const targetDateStr = shouldShowYesterdaySessions ? yesterdayStr : todayStr;
    
    // Get all sessions from the target date
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
      
      return itemDate === targetDateStr;
    });
    
    if (targetSessions.length === 0) {
      return true; // No sessions on target date, consider all ended
    }
    
    // Check if all sessions have ended
    // const allEnded = targetSessions.every((session) => {
    //   const completedStatuses = [
    //     LESSON_STATUS.ENDED,
    //     'ended',
    //     'completed',
    //     'finished'
    //   ];
      
    //   // If session has completed status, it's ended
    //   if (completedStatuses.includes(session.status)) {
    //     return true;
    //   }
      
    //   // For yesterday's sessions, they are always considered ended
    //   if (shouldShowYesterdaySessions) {
    //     return true;
    //   }
      
    //   // Check if session has passed its end time (only for today's sessions)
    //   if (session.start_time) {
    //     try {
    //       const [hours, minutes] = session.start_time.split(':').map(Number);
    //       if (isNaN(hours) || isNaN(minutes)) {
    //         return false;
    //       }
          
    //       const sessionStart = new Date(
    //         targetDate.getFullYear(),
    //         targetDate.getMonth(),
    //         targetDate.getDate(),
    //         hours,
    //         minutes
    //       );
          
    //       // Use default duration of 60 minutes since API doesn't provide duration
    //       // This is a reasonable assumption for most educational sessions
    //       const durationMinutes = 60; // Fixed duration since API doesn't provide this field
    //       const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
          
    //       const hasEnded = now > sessionEnd;
          
    //       return hasEnded;
    //     } catch (error) {
    //       return false;
    //     }
    //   }
      
    //   return false;
    // });
    // Default duration for each session (1 hour)
const DEFAULT_SESSION_DURATION_MINUTES = 60;

const allEnded = targetSessions.every((session) => {
  const completedStatuses = [
    LESSON_STATUS.ENDED,
    'ended',
    'completed',
    'finished'
  ];

  if (completedStatuses.includes(session.status)) {
    return true;
  }

  // For yesterday's sessions, assume all ended
  if (shouldShowYesterdaySessions) {
    return true;
  }

  // Estimate end time for today's sessions
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
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        hours,
        minutes
      );

      // Add default duration (1 hour)
      const sessionEnd = new Date(sessionStart.getTime() + DEFAULT_SESSION_DURATION_MINUTES * 60 * 1000);

      // Add small grace period (5 minutes) to avoid early trigger
      const gracePeriod = 5 * 60 * 1000;

      return now.getTime() > sessionEnd.getTime() + gracePeriod;
    } catch {
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
    const yesterdayStr = getYesterdayDateString();
    
    // Check stored data for both today and yesterday
    const todayData = getStoredRatingData(todayStr);
    const yesterdayData = getStoredRatingData(yesterdayStr);
    
    // Check if we should show yesterday's sessions
    const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
    
    // If showing yesterday's sessions, check if we've already shown modal for today
    if (shouldShowYesterdaySessions) {
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
    } else {
      // Showing today's sessions - check today's data
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
    }

    // Get eligible sessions (today's or yesterday's sessions)
    const eligibleSessions = getEligibleSessions();
    
    if (eligibleSessions.length === 0) {
      return false;
    }

    // Only show modal if all sessions of the target date have ended
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
      
      // Determine which date to save the rating data for
      const todayStr = getTodayDateString();
      const yesterdayStr = getYesterdayDateString();
      const yesterdayData = getStoredRatingData(yesterdayStr);
      const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
      
      const targetDateStr = shouldShowYesterdaySessions ? yesterdayStr : todayStr;
      
      // Save rating data for the appropriate date
      const ratingData = {
        lastShown: new Date().toISOString(),
        lastRatingDate: new Date().toISOString(),
        reviewsSubmitted: reviews.length,
        sessionsRated: reviews.map(r => r.class_session_id),
        skipped: false // User submitted ratings, didn't skip
      };
      saveRatingData(targetDateStr, ratingData);
      
      setShouldShowModal(false);
    } catch (error) {
      // Re-throw the error so the modal can handle it
      throw error;
    }
  }, [getEligibleSessions, saveRatingData, getStoredRatingData]);

  // Handle modal close/skip
  const handleCloseModal = useCallback(() => {
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    const yesterdayData = getStoredRatingData(yesterdayStr);
    const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
    
    const targetDateStr = shouldShowYesterdaySessions ? yesterdayStr : todayStr;
    
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: null, // User didn't rate
      reviewsSubmitted: 0,
      sessionsRated: [],
      skipped: true // Mark as skipped to prevent showing again
    };
    saveRatingData(targetDateStr, ratingData);
    
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