import { useSessionRatingModal } from '@/features/lessons/hooks/useSessionRatingModal';
import { useLocation } from 'react-router-dom';

const SessionRatingInitializer = () => {
  const location = useLocation();
  
  // This hook will automatically check for yesterday's sessions and show the modal if needed
  // It uses real API data from the lessons service
  const { eligibleSessions, handleSubmitRatings, handleCloseModal } = useSessionRatingModal();
  
  // Development mode debugging - only show real data info
  if (process.env.NODE_ENV === 'development') {
    // Add a function to check current modal state with real data
    window.checkSessionRatingState = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const todayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${todayStr}`) || 'null');
      const yesterdayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${yesterdayStr}`) || 'null');
      
      
      return { todayData, yesterdayData, eligibleSessions };
    };
    
    // Add a function to debug why modal is not showing
    window.debugSessionRatingModal = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const todayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${todayStr}`) || 'null');
      const yesterdayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${yesterdayStr}`) || 'null');
      
      
      return {
        shouldShow: !todayData?.lastShown && !todayData?.skipped && !yesterdayData?.lastRatingDate && eligibleSessions.length > 0,
        conditions: {
          notShownToday: !todayData?.lastShown,
          notSkippedToday: !todayData?.skipped,
          notRatedYesterday: !yesterdayData?.lastRatingDate,
          hasEligibleSessions: eligibleSessions.length > 0
        }
      };
    };
    
    // Add a function to clear localStorage for testing
    window.clearSessionRatingData = () => {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('sessionRatingModal'));
      keys.forEach(key => localStorage.removeItem(key));
    };
    
  }
  
  // In development mode, initialize on any page for testing
  // In production, only initialize on schedule page
  if (process.env.NODE_ENV !== 'development' && !location.pathname.includes('/schedule')) {
    return null;
  }
  
  return null;
};

export default SessionRatingInitializer;