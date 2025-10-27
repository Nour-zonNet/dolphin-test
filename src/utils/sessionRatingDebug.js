// Debug utility for SessionRatingModal
// This file can be imported in development to help debug modal behavior

export const sessionRatingDebug = {
  // Clear all session rating storage
  clearAllStorage: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('sessionRatingModal_'));
    keys.forEach(key => localStorage.removeItem(key));
  },

  // Clear storage for a specific date
  clearStorageForDate: (dateString) => {
    const storageKey = `sessionRatingModal_${dateString}`;
    localStorage.removeItem(storageKey);
  },

  // Get storage data for a specific date
  getStorageForDate: (dateString) => {
    const storageKey = `sessionRatingModal_${dateString}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  },

  // Get all session rating storage keys
  getAllStorageKeys: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('sessionRatingModal_'));
    return keys;
  },

  // Force show modal by clearing today's storage
  forceShowModal: () => {
    const today = new Date().toISOString().split('T')[0];
    sessionRatingDebug.clearStorageForDate(today);
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

  // Note: All session data should come from real API calls
  // This debug utility only provides storage management functions
};

// Make it available globally in development
if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
  window.sessionRatingDebug = sessionRatingDebug;
}
