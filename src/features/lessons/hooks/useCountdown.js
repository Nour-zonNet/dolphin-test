import { useState, useEffect, useRef, useCallback } from 'react';

export const useCountdown = (targetTime, lessonDate) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [canEnterLesson, setCanEnterLesson] = useState(false);
  const intervalRef = useRef(null);

  const calculateTimeRemaining = useCallback(() => {
    try {
      const [hourStr, minuteStr] = targetTime.split(':');
      const target = new Date(lessonDate);
      target.setHours(parseInt(hourStr, 10));
      target.setMinutes(parseInt(minuteStr, 10));
      target.setSeconds(0);

      const now = new Date();
      const diffMs = target - now;

      // Check if we can enter lesson (5 minutes before start time)
      const fiveMinutesBeforeMs = diffMs - (5 * 60 * 1000);
      const shouldAllowEntry = fiveMinutesBeforeMs <= 0;
      
      setCanEnterLesson(shouldAllowEntry);

      if (diffMs <= 0) {
        setIsExpired(true);
        setTimeRemaining('');
        return;
      }

      setIsExpired(false);
      
      const diffMins = Math.floor(diffMs / 1000 / 60);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      let result = 'متبقي ';
      if (hours > 0) {
        result += `${hours} ساعة`;
        if (minutes > 0 || seconds > 0) result += ' و ';
      }
      if (minutes > 0) {
        result += `${minutes} دقيقة`;
        if (seconds > 0 && hours === 0) result += ' و ';
      }
      if (seconds > 0 && hours === 0) {
        result += `${seconds} ثانية`;
      }

      setTimeRemaining(result);
    } catch (_error) {
      // Error calculating countdown
      setTimeRemaining('');
      setIsExpired(false);
      setCanEnterLesson(false);
    }
  }, [targetTime, lessonDate]);

  useEffect(() => {
    if (!targetTime || !lessonDate) return;

    // Initial calculation
    calculateTimeRemaining();

    // Set up interval for updates every second
    intervalRef.current = setInterval(calculateTimeRemaining, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [calculateTimeRemaining, lessonDate, targetTime]);


  return { timeRemaining, isExpired, canEnterLesson };
};