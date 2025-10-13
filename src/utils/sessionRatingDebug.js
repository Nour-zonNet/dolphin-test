// Debug utility for SessionRatingModal
// This file can be imported in development to help debug modal behavior

export const sessionRatingDebug = {
  // Clear all session rating storage
  clearAllStorage: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('sessionRatingModal_'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log('Cleared all session rating storage:', keys);
  },

  // Clear storage for a specific date
  clearStorageForDate: (dateString) => {
    const storageKey = `sessionRatingModal_${dateString}`;
    localStorage.removeItem(storageKey);
    console.log('Cleared session rating storage for:', dateString);
  },

  // Get storage data for a specific date
  getStorageForDate: (dateString) => {
    const storageKey = `sessionRatingModal_${dateString}`;
    const data = localStorage.getItem(storageKey);
    console.log('Storage data for', dateString, ':', data ? JSON.parse(data) : null);
    return data ? JSON.parse(data) : null;
  },

  // Get all session rating storage keys
  getAllStorageKeys: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('sessionRatingModal_'));
    console.log('All session rating storage keys:', keys);
    return keys;
  },

  // Force show modal by clearing today's storage
  forceShowModal: () => {
    const today = new Date().toISOString().split('T')[0];
    sessionRatingDebug.clearStorageForDate(today);
    console.log('Cleared today\'s storage, modal should show on next check');
  },

  // Get current date strings
  getDateStrings: () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    return {
      today: today.toISOString().split('T')[0],
      yesterday: yesterday.toISOString().split('T')[0]
    };
  },

  // Simulate session data for testing
  createTestSession: (overrides = {}) => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    return {
      id: Math.floor(Math.random() * 10000),
      class_session_id: Math.floor(Math.random() * 10000),
      teacher_name: 'معلم تجريبي',
      subject: 'مادة تجريبية',
      date: yesterday.toISOString().split('T')[0], // Yesterday's date
      start_time: '10:00',
      duration: 60,
      status: 'ended',
      ...overrides
    };
  }
};

// Make it available globally in development
if (process.env.NODE_ENV === 'development') {
  window.sessionRatingDebug = sessionRatingDebug;
}
