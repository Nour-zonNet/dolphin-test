import { useSessionRatingModal } from '@/features/lessons/hooks/useSessionRatingModal';
import { useLocation } from 'react-router-dom';

const SessionRatingInitializer = () => {
  const location = useLocation();
  const { eligibleSessions, handleSubmitRatings, handleCloseModal } = useSessionRatingModal();

  // فقط لا تعمل أي شيء إذا لم تكن في صفحة schedule
  if (!location.pathname.includes('/schedule')) {
    return null;
  }

  // Development-only debugging
  if (process.env.NODE_ENV === 'development') {
    window.checkSessionRatingState = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const todayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${todayStr}`) || 'null');
      const yesterdayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${yesterdayStr}`) || 'null');
      return { todayData, yesterdayData, eligibleSessions };
    };

    window.debugSessionRatingModal = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const todayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${todayStr}`) || 'null');
      const yesterdayData = JSON.parse(localStorage.getItem(`sessionRatingModal_${yesterdayStr}`) || 'null');
      const shouldShowYesterdaySessions = !yesterdayData?.lastShown && !yesterdayData?.skipped && !yesterdayData?.lastRatingDate;

      return {
        shouldShow:
          eligibleSessions.length > 0 &&
          (shouldShowYesterdaySessions
            ? !todayData?.lastShown && !todayData?.skipped && !todayData?.lastRatingDate
            : !todayData?.lastShown && !todayData?.skipped && !todayData?.lastRatingDate),
        conditions: {
          showingYesterdaySessions: shouldShowYesterdaySessions,
          notShownToday: !todayData?.lastShown,
          notSkippedToday: !todayData?.skipped,
          notRatedToday: !todayData?.lastRatingDate,
          notShownYesterday: !yesterdayData?.lastShown,
          notSkippedYesterday: !yesterdayData?.skipped,
          notRatedYesterday: !yesterdayData?.lastRatingDate,
          hasEligibleSessions: eligibleSessions.length > 0,
        },
      };
    };

    window.clearSessionRatingData = () => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('sessionRatingModal'))
        .forEach((key) => localStorage.removeItem(key));
    };
  }

  return null;
};

export default SessionRatingInitializer;
