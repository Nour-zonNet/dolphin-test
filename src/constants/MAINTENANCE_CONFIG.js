// Maintenance mode configuration constants
export const MAINTENANCE_CONFIG = {
  // Set to true to enable maintenance mode
  enabled: false,
  
  // Optional: Set a specific end time for maintenance
  endTime: null, // Format: '2024-01-15T10:00:00Z'
  
  // Optional: Check maintenance status from API
  checkFromAPI: false,
  apiEndpoint: '/api/maintenance-status',
  
  // Optional: Check maintenance status from environment variable
  checkFromEnv: true,
  envVariable: 'VITE_MAINTENANCE_MODE',
  
  // Maintenance messages
  messages: {
    ar: {
      title: 'الموقع تحت الصيانة',
      description: 'نقوم حالياً بأعمال تطوير وصيانة لتحسين تجربتك',
      goHome: 'العودة للرئيسية'
    },
    en: {
      title: 'Site Under Maintenance',
      description: 'We are currently performing development and maintenance work to improve your experience',
      goHome: 'Return to Homepage'
    }
  }
};

// Helper functions for maintenance mode
export const enableMaintenanceMode = () => {
  MAINTENANCE_CONFIG.enabled = true;
};

export const disableMaintenanceMode = () => {
  MAINTENANCE_CONFIG.enabled = false;
};

export const setMaintenanceEndTime = (endTime) => {
  MAINTENANCE_CONFIG.endTime = endTime;
};

export const isMaintenanceModeEnabled = () => {
  return MAINTENANCE_CONFIG.enabled;
};
