// src/hooks/useSessionTracking.js
import { useEffect } from 'react';
import sessionTracker from '../services/sessionTracking';

export const useSessionTracking = () => {
  useEffect(() => {
    // Initialize session tracking when the hook is used
    sessionTracker.initialize();
  }, []);

  // Function to track session completion (to be called when a session ends)
  const trackSessionCompletion = (sessionData) => {
    sessionTracker.trackSessionCompletion(sessionData);
  };

  // Function to manually trigger evaluation check
  const checkForEvaluations = () => {
    sessionTracker.checkForPendingEvaluations();
  };

  return {
    trackSessionCompletion,
    checkForEvaluations,
  };
};
