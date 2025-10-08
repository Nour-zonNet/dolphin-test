// src/services/sessionTracking.js
import { openSessionEvaluationModal } from '../components/feedback/modal/useModal';

const SESSION_STORAGE_KEY = 'completed_sessions';
const EVALUATION_SHOWN_KEY = 'evaluation_shown_dates';

class SessionTracker {
  constructor() {
    this.checkForPendingEvaluations();
  }

  // Track when a session is completed
  trackSessionCompletion(sessionData) {
    const sessions = this.getCompletedSessions();
    const today = new Date().toDateString();
    
    // Add session to today's completed sessions
    if (!sessions[today]) {
      sessions[today] = [];
    }
    
    sessions[today].push({
      id: sessionData.id || Date.now(),
      teacherName: sessionData.teacherName || 'أ. حنان',
      completedAt: new Date().toISOString(),
      ...sessionData
    });
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
    
    // Schedule evaluation check for next day
    this.scheduleEvaluationCheck();
  }

  // Get all completed sessions from localStorage
  getCompletedSessions() {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading completed sessions:', error);
      return {};
    }
  }

  // Get sessions that need evaluation (from yesterday)
  getSessionsForEvaluation() {
    const sessions = this.getCompletedSessions();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toDateString();
    
    return sessions[yesterdayKey] || [];
  }

  // Check if evaluation was already shown for a specific date
  hasEvaluationBeenShown(dateKey) {
    try {
      const shownDates = localStorage.getItem(EVALUATION_SHOWN_KEY);
      const dates = shownDates ? JSON.parse(shownDates) : [];
      return dates.includes(dateKey);
    } catch (error) {
      console.error('Error checking evaluation shown status:', error);
      return false;
    }
  }

  // Mark evaluation as shown for a specific date
  markEvaluationAsShown(dateKey) {
    try {
      const shownDates = localStorage.getItem(EVALUATION_SHOWN_KEY);
      const dates = shownDates ? JSON.parse(shownDates) : [];
      
      if (!dates.includes(dateKey)) {
        dates.push(dateKey);
        localStorage.setItem(EVALUATION_SHOWN_KEY, JSON.stringify(dates));
      }
    } catch (error) {
      console.error('Error marking evaluation as shown:', error);
    }
  }

  // Schedule evaluation check for next day
  scheduleEvaluationCheck() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // Check at 9 AM next day
    
    const timeUntilCheck = tomorrow.getTime() - Date.now();
    
    setTimeout(() => {
      this.checkForPendingEvaluations();
    }, timeUntilCheck);
  }

  // Check if there are sessions that need evaluation
  checkForPendingEvaluations() {
    const sessionsToEvaluate = this.getSessionsForEvaluation();
    
    if (sessionsToEvaluate.length === 0) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toDateString();

    // Check if evaluation was already shown for yesterday
    if (this.hasEvaluationBeenShown(yesterdayKey)) {
      return;
    }

    // Show evaluation modal
    this.showEvaluationModal(sessionsToEvaluate);
    
    // Mark evaluation as shown for yesterday
    this.markEvaluationAsShown(yesterdayKey);
  }

  // Show the evaluation modal
  showEvaluationModal(sessions) {
    // Import the modal hook dynamically to avoid circular dependencies
    import('../components/feedback/modal/useModal').then(({ useModal }) => {
      const { openSessionEvaluationModal } = useModal();
      openSessionEvaluationModal(sessions);
    });
  }

  // Clean up old session data (keep only last 30 days)
  cleanupOldSessions() {
    const sessions = this.getCompletedSessions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const cleanedSessions = {};
    Object.keys(sessions).forEach(dateKey => {
      const sessionDate = new Date(dateKey);
      if (sessionDate >= thirtyDaysAgo) {
        cleanedSessions[dateKey] = sessions[dateKey];
      }
    });
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cleanedSessions));
  }

  // Initialize the session tracker
  initialize() {
    // Clean up old data on initialization
    this.cleanupOldSessions();
    
    // Check for pending evaluations immediately
    this.checkForPendingEvaluations();
    
    // Set up periodic check (every hour)
    setInterval(() => {
      this.checkForPendingEvaluations();
    }, 60 * 60 * 1000);
  }
}

// Create singleton instance
const sessionTracker = new SessionTracker();

export default sessionTracker;
