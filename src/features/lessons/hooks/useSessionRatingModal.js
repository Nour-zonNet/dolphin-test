import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLessons } from './useLessons';
import { LESSON_STATUS } from '../../../utils';

const STORAGE_KEY = 'sessionRatingModal';
const RATING_COOLDOWN_HOURS = 24; // Don't show modal again for 24 hours after rating

export const useSessionRatingModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { items } = useLessons();

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

  // Check if all sessions from previous day are completed
  const checkPreviousDaySessionsCompleted = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    // Get yesterday's date in YYYY-MM-DD format
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Filter sessions for yesterday
    const yesterdaySessions = items.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === yesterdayStr;
    });

    if (yesterdaySessions.length === 0) {
      return false; // No sessions yesterday
    }

    // Check if all sessions from yesterday are completed
    const allCompleted = yesterdaySessions.every((session) => {
      // Check if session status is 'ended' or if it's past the session end time
      if (session.status === LESSON_STATUS.ENDED) {
        return true;
      }
      
      // If no explicit status, check if session time has passed
      if (session.start_time) {
        const [hours, minutes] = session.start_time.split(':').map(Number);
        const sessionStart = new Date(
          yesterday.getFullYear(),
          yesterday.getMonth(),
          yesterday.getDate(),
          hours,
          minutes
        );
        
        const durationMinutes = session.duration || 60;
        const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
        
        // Session is completed if it's past the end time and not canceled
        return now > sessionEnd && session.status !== LESSON_STATUS.CANCELLED;
      }
      
      return false;
    });

    return allCompleted;
  }, [items]);

  // Check if we should show the rating modal
  const checkShouldShowModal = useCallback(() => {
    // First check if there are any sessions to rate
    const sessionsCompleted = checkPreviousDaySessionsCompleted();
    if (!sessionsCompleted) {
      return false; // No completed sessions to rate
    }

    const storedData = getStoredRatingData();
    
    if (!storedData) {
      // No stored data, show modal if sessions are completed
      return true;
    }

    // Check if we've already shown the modal recently
    const lastShown = new Date(storedData.lastShown);
    const now = new Date();
    const hoursSinceLastShown = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastShown < RATING_COOLDOWN_HOURS) {
      return false; // Still in cooldown period
    }

    // Check if user has already rated for this period
    const lastRatingDate = storedData.lastRatingDate ? new Date(storedData.lastRatingDate) : null;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (lastRatingDate && lastRatingDate >= today) {
      return false; // Already rated today
    }

    // Show modal if sessions are completed and conditions are met
    return true;
  }, [getStoredRatingData, checkPreviousDaySessionsCompleted]);

  // Get yesterday's sessions for rating
  const getYesterdaySessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    return items.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      
      // Only include sessions from yesterday that are not canceled
      if (itemDate !== yesterdayStr || item.status === LESSON_STATUS.CANCELLED) {
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
          yesterday.getFullYear(),
          yesterday.getMonth(),
          yesterday.getDate(),
          hours,
          minutes
        );
        
        const durationMinutes = item.duration || 60;
        const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
        
        return now > sessionEnd;
      }
      
      return false;
    });
  }, [items]);

  // Handle modal submission
  const handleSubmitRatings = useCallback((ratings) => {
    console.log('User ratings:', ratings);
    
    // Save rating data
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: new Date().toISOString(),
      ratings: ratings,
      sessionsRated: getYesterdaySessions().map(s => s.id)
    };
    saveRatingData(ratingData);
    
    setIsModalOpen(false);
    setShouldShowModal(false);
  }, [saveRatingData, getYesterdaySessions]);

  // Handle modal close/skip
  const handleCloseModal = useCallback(() => {
    const ratingData = {
      lastShown: new Date().toISOString(),
      lastRatingDate: null, // User didn't rate
      ratings: null
    };
    saveRatingData(ratingData);
    
    setIsModalOpen(false);
    setShouldShowModal(false);
  }, [saveRatingData]);

  // Check for modal on component mount and when lessons change
  useEffect(() => {
    const shouldShow = checkShouldShowModal();
    
    // Only update state if it's different to prevent unnecessary re-renders
    setShouldShowModal(prevShouldShow => {
      if (prevShouldShow !== shouldShow) {
        return shouldShow;
      }
      return prevShouldShow;
    });
    
    if (shouldShow && !isModalOpen) {
      // Add a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 1500); // Increased delay to ensure page is fully loaded
      
      return () => clearTimeout(timer);
    } else if (!shouldShow && isModalOpen) {
      // If we shouldn't show the modal, make sure it's closed
      setIsModalOpen(false);
    }
  }, [items, checkShouldShowModal, isModalOpen]);

  // Memoize yesterday sessions to prevent unnecessary re-renders
  const yesterdaySessions = useMemo(() => getYesterdaySessions(), [items]);

  return {
    isModalOpen,
    shouldShowModal,
    handleSubmitRatings,
    handleCloseModal,
    yesterdaySessions
  };
};
