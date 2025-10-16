# Maintenance Mode Implementation

This document explains how to use the maintenance mode feature in the LearnAtDolphin frontend application.

## Overview

The maintenance mode system allows you to temporarily disable the application and show a maintenance screen to users. This is useful during deployments, updates, or scheduled maintenance windows.

## Components

### 1. MaintenanceScreen Component
- **Location**: `src/components/MaintenanceScreen.jsx`
- **Purpose**: Displays the maintenance screen with dolphin character and appropriate messaging
- **Features**: 
  - Responsive design
  - Arabic/English translations
  - "Return to Homepage" button
  - Support chat icon

### 2. useMaintenanceDetection Hook
- **Location**: `src/hooks/useMaintenanceDetection.js`
- **Purpose**: Detects when maintenance mode should be active
- **Features**:
  - Configuration-based maintenance
  - Environment variable support
  - Scheduled maintenance with end time
  - API-based maintenance status checking
  - Periodic status checking (every 5 minutes)

### 3. Maintenance Configuration
- **Location**: `src/constants/MAINTENANCE_CONFIG.js`
- **Purpose**: Centralized configuration for maintenance mode
- **Features**:
  - Enable/disable maintenance mode
  - Set maintenance end time
  - Configure API endpoint
  - Environment variable settings

## How to Enable Maintenance Mode

### Method 1: Configuration File
Edit `src/constants/MAINTENANCE_CONFIG.js`:
```javascript
export const MAINTENANCE_CONFIG = {
  enabled: true, // Set to true to enable maintenance mode
  // ... other settings
};
```

### Method 2: Environment Variable
Set the environment variable:
```bash
VITE_MAINTENANCE_MODE=true
```

### Method 3: Scheduled Maintenance
Set an end time in the configuration:
```javascript
export const MAINTENANCE_CONFIG = {
  enabled: false,
  endTime: '2024-01-15T10:00:00Z', // Maintenance until this time
  // ... other settings
};
```

### Method 4: API-Based Maintenance
Configure API endpoint:
```javascript
export const MAINTENANCE_CONFIG = {
  enabled: false,
  checkFromAPI: true,
  apiEndpoint: '/api/maintenance-status',
  // ... other settings
};
```

## Translations

Maintenance messages are available in both Arabic and English:

### Arabic (`src/locales/ar.json`)
```json
"maintenance": {
  "title": "الموقع تحت الصيانة",
  "description": "نقوم حالياً بأعمال تطوير وصيانة لتحسين تجربتك",
  "goHome": "العودة للرئيسية"
}
```

### English (`src/locales/en.json`)
```json
"maintenance": {
  "title": "Site Under Maintenance",
  "description": "We are currently performing development and maintenance work to improve your experience",
  "goHome": "Return to Homepage"
}
```

## Integration

The maintenance screen is automatically integrated into the main App component (`src/app/core/App.jsx`). It takes priority over the offline screen and normal application flow.

## Priority Order

1. **Maintenance Mode** - Highest priority
2. **Offline Mode** - Second priority
3. **Normal Application** - Default state

## Testing

To test the maintenance mode:

1. Set `MAINTENANCE_CONFIG.enabled = true` in the configuration file
2. Refresh the application
3. You should see the maintenance screen instead of the normal application
4. Set `MAINTENANCE_CONFIG.enabled = false` to disable maintenance mode

## Customization

You can customize the maintenance screen by:

1. **Styling**: Modify the CSS classes in `MaintenanceScreen.jsx`
2. **Images**: Replace the maintenance dolphin image in `src/assets/images/maintenance-dolphin.svg`
3. **Messages**: Update the translations in the locale files
4. **Behavior**: Modify the `onGoHome` callback in `App.jsx`

## API Integration

If you want to check maintenance status from your backend API, implement an endpoint that returns:

```json
{
  "maintenance": true,
  "message": "Scheduled maintenance until 2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T10:00:00Z"
}
```

The hook will automatically check this endpoint every 5 minutes when `checkFromAPI` is enabled.
