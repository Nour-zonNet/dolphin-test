import { useLocation } from 'react-router-dom';

const SessionRatingInitializer = () => {
  const location = useLocation();

  // فقط لا تعمل أي شيء إذا لم تكن في صفحة schedule
  if (!location.pathname.includes('/schedule')) {
    return null;
  }

  return null;
};

export default SessionRatingInitializer;