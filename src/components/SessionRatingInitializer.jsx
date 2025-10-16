import { useSessionRatingModal } from '@/features/lessons/hooks/useSessionRatingModal';
import { useLocation } from 'react-router-dom';

const SessionRatingInitializer = () => {
  const location = useLocation();
  
  // Only initialize on schedule page
  // Note: Even though this component is included in App.jsx globally,
  // it only activates when the user is on the schedule page to avoid
  // unnecessary API calls and modal checks on other pages
  if (!location.pathname.includes('/schedule')) {
    return null;
  }
  
  // This hook will automatically check for today's sessions and show the modal if needed
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
      
      // Check if we should show yesterday's sessions
      const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;
      
      return {
        shouldShow: eligibleSessions.length > 0 && (
          shouldShowYesterdaySessions ? 
            (!todayData?.lastShown && !todayData?.skipped && !todayData?.lastRatingDate) :
            (!todayData?.lastShown && !todayData?.skipped && !todayData?.lastRatingDate)
        ),
        conditions: {
          showingYesterdaySessions: shouldShowYesterdaySessions,
          notShownToday: !todayData?.lastShown,
          notSkippedToday: !todayData?.skipped,
          notRatedToday: !todayData?.lastRatingDate,
          notShownYesterday: !yesterdayData?.lastShown,
          notSkippedYesterday: !yesterdayData?.skipped,
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
  
  return null;
};

export default SessionRatingInitializer;