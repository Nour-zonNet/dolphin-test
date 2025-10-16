import { useState, useEffect } from 'react';
import { MAINTENANCE_CONFIG } from '@/constants/MAINTENANCE_CONFIG';

export const useMaintenanceDetection = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      let maintenanceActive = false;
      let info = null;

      // Check configuration-based maintenance
      if (MAINTENANCE_CONFIG.enabled) {
        maintenanceActive = true;
        info = {
          reason: 'configuration',
          message: 'Maintenance mode is enabled in configuration'
        };
      }

      // Check environment variable
      if (MAINTENANCE_CONFIG.checkFromEnv) {
        const envMaintenance = import.meta.env[MAINTENANCE_CONFIG.envVariable];
        if (envMaintenance === 'true' || envMaintenance === true) {
          maintenanceActive = true;
          info = {
            reason: 'environment',
            message: 'Maintenance mode is enabled via environment variable'
          };
        }
      }

      // Check scheduled maintenance end time
      if (MAINTENANCE_CONFIG.endTime) {
        const endTime = new Date(MAINTENANCE_CONFIG.endTime);
        const now = new Date();
        if (now < endTime) {
          maintenanceActive = true;
          info = {
            reason: 'scheduled',
            message: `Maintenance scheduled until ${endTime.toLocaleString()}`,
            endTime: endTime
          };
        }
      }

      // Check API for maintenance status
      if (MAINTENANCE_CONFIG.checkFromAPI && !maintenanceActive) {
        try {
          const response = await fetch(MAINTENANCE_CONFIG.apiEndpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000)
          });

          if (response.ok) {
            const data = await response.json();
            if (data.maintenance) {
              maintenanceActive = true;
              info = {
                reason: 'api',
                message: data.message || 'Maintenance mode is active',
                endTime: data.endTime ? new Date(data.endTime) : null
              };
            }
          }
        } catch (error) {
          console.warn('Failed to check maintenance status from API:', error);
          // Don't enable maintenance mode if API check fails
        }
      }

      setIsMaintenanceMode(maintenanceActive);
      setMaintenanceInfo(info);
    };

    checkMaintenanceStatus();

    // Check maintenance status periodically (every 5 minutes)
    const interval = setInterval(checkMaintenanceStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    isMaintenanceMode,
    maintenanceInfo,
    // Helper function to manually enable/disable maintenance mode
    setMaintenanceMode: (enabled) => {
      MAINTENANCE_CONFIG.enabled = enabled;
      setIsMaintenanceMode(enabled);
    }
  };
};
