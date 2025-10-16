# Offline Screen Implementation

## Overview
This implementation adds an offline screen that displays when the user loses internet connection. The screen matches the design shown in the provided image with Arabic text and proper styling.

## Components Added

### 1. OfflineScreen Component (`src/components/OfflineScreen.jsx`)
- Displays when user is offline
- Shows the offline dolphin character from `src/assets/images/offline-dolphin.svg`
- Includes Arabic text for offline messages
- Has a retry button to reload the page
- Includes mobile navigation bar at the bottom
- Responsive design for both mobile and desktop

### 2. useOfflineDetection Hook (`src/hooks/useOfflineDetection.js`)
- Custom React hook that detects online/offline status
- Uses `navigator.onLine` API
- Listens to `online` and `offline` browser events
- Returns boolean indicating connection status

### 3. Integration in App Component (`src/app/core/App.jsx`)
- Added offline detection to the main App component
- Shows OfflineScreen when `isOnline` is false
- Wraps offline screen in AppProviders to maintain context

## Translation Support
Added offline-related translations to both Arabic and English locale files:
- `offline.title`: "أنت غير متصل بالإنترنت" / "You are not connected to the internet"
- `offline.description`: "الرجاء التحقق من اتصالك بالشبكة وإعادة المحاولة" / "Please check your network connection and try again"
- `offline.retry`: "حاول مرة أخري" / "Try Again"

## How It Works
1. The `useOfflineDetection` hook monitors the browser's online/offline status
2. When the user goes offline, the App component renders the OfflineScreen instead of the normal app content
3. The OfflineScreen displays the appropriate message and retry button
4. When the user comes back online, the normal app content is restored automatically
5. The retry button reloads the page to ensure fresh data

## Testing
To test the offline functionality:
1. Open the app in a browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Check "Offline" checkbox to simulate offline state
5. The offline screen should appear
6. Uncheck "Offline" to restore connection

## Features
- ✅ Automatic offline detection
- ✅ Arabic and English translations
- ✅ Mobile-responsive design
- ✅ Retry functionality
- ✅ Consistent with app design
- ✅ Uses existing offline dolphin asset
- ✅ Mobile navigation bar included
- ✅ Proper RTL (right-to-left) support for Arabic


