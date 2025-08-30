# Internationalization (i18n) Implementation

This document outlines the internationalization setup for the React application using `react-i18next`.

## Overview

The application now supports multiple languages with a focus on Arabic (RTL) and English (LTR). The implementation is scalable and allows easy addition of new languages.

## Folder Structure

```
src/
├── i18n.js                    # i18n configuration
├── locales/                   # Translation files
│   ├── en.json               # English translations
│   └── ar.json               # Arabic translations
├── hooks/
│   └── useLanguageDirection.js # RTL/LTR direction hook
├── components/
│   └── ui/
│       └── LanguageSwitcher.jsx # Language toggle component
└── app/
    └── AppProviders.jsx      # Wraps app with I18nextProvider
```

## Key Features

### 1. Language Detection
- Automatically detects user's preferred language
- Falls back to Arabic as default
- Persists language choice in localStorage

### 2. RTL/LTR Support
- Automatic direction switching based on language
- CSS classes for RTL-specific styling
- Document direction and language attributes updated

### 3. Language Switcher
- Toggle between Arabic and English
- Visual indicator of current language
- Responsive design

### 4. Translation Keys Structure

```json
{
  "common": {
    "loading": "Loading...",
    "ok": "OK",
    "cancel": "Cancel"
  },
  "navigation": {
    "schedule": "Study Schedule",
    "subscriptions": "Subscribed Packages"
  },
  "home": {
    "welcome": "Welcome to",
    "platformName": "Dolphin Educational Platform"
  },
  "auth": {
    "loginToAccount": "Login to Your Account",
    "enterPhoneNumber": "Enter your phone number"
  },
  "subscription": {
    "active": "Active",
    "trial": "Trial",
    "expired": "Expired",
    "cancelled": "Cancelled",
    "daysLeft": "days left",
    "renewSubscription": "Renew Subscription",
    "extendSubscription": "Extend Subscription",
    "requestReactivateSubscription": "Request Reactivate Subscription",
    "trialExpiredMessage": "Your trial period has expired. Extend your subscription to continue benefiting",
    "expiredMessage": "Your package has expired. Click the (Renew Package) button to renew it and continue using our services",
    "cancelledMessage": "You have changed your subscription. To reactivate, send a request by clicking the Reactivate Subscription button",
    "healthPackage": "Health Package",
    "generalHealth": "General Health",
    "englishFoundationPackage": "English Foundation Package (Level 1)",
    "englishLanguage": "English Language",
    "firstGroup": "First Group",
    "secondGroup": "Second Group",
    "previewWeeklySchedule": "Preview Weekly Schedule"
  },
  "lessons": {
    "viewContent": "View Content",
    "teacher": "Teacher",
    "group": "Group",
    "time": "Time",
    "remainingTime": "Remaining Time",
    "defaultTeacher": "Ms. Hanan",
    "sunday": "Sunday",
    "tuesday": "Tuesday",
    "thursday": "Thursday"
  },
  "packages": {
    "healthPackage": "Health Package",
    "firstGroup": "First Group",
    "previewWeeklySchedule": "Preview Weekly Schedule",
    "weeklySchedule": "Weekly Schedule",
    "noLesson": "-"
  }
}
```

## Usage in Components

### Basic Translation
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('home.welcome')}</h1>;
};
```

### Language Switching
```jsx
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };
};
```

### RTL/LTR Direction Hook
```jsx
import { useLanguageDirection } from '../hooks/useLanguageDirection';

const MyComponent = () => {
  const { isRTL, language } = useLanguageDirection();
  
  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      Current language: {language}
    </div>
  );
};
```

## Components Updated

The following components have been updated to use translations:

### Core Components
1. **Header.jsx** - Currency display
2. **Hero.jsx** - Welcome message and platform name
3. **LoginCard.jsx** - Login form text
4. **LoginForm.jsx** - Authentication form labels
5. **PasswordForm.jsx** - Password form text
6. **StatusModal.jsx** - Modal buttons
7. **Navbar.jsx** - Navigation tabs and language switcher
8. **NavTab.jsx** - Tab labels
9. **HomePage Navbar** - Package button

### Lessons Feature
10. **LessonCard.jsx** - Lesson content, teacher names, view content button
11. **SliderHeader.jsx** - Date formatting based on language
12. **ScheduleSlider.jsx** - Lesson scheduling interface

### Packages Feature
13. **PackageCard.jsx** - Package titles, status, groups, preview button
14. **WeeklySchedulePopup.jsx** - Schedule popup, day names, teacher names

## Adding New Languages

1. Create a new translation file in `src/locales/` (e.g., `fr.json`)
2. Add the language to the resources in `src/i18n.js`:
   ```javascript
   const resources = {
     en: { translation: enTranslations },
     ar: { translation: arTranslations },
     fr: { translation: frTranslations } // New language
   };
   ```
3. Update the language switcher if needed

## RTL Support

The application includes comprehensive RTL support:

- Automatic document direction switching
- CSS classes for RTL-specific styling
- Text alignment adjustments
- Icon flipping utilities

## Best Practices

1. **Use translation keys** instead of hardcoded strings
2. **Organize translations** by feature/component
3. **Test both languages** thoroughly
4. **Consider text length** differences between languages
5. **Use the direction hook** for RTL-specific logic

## Testing

To test the implementation:

1. Start the development server
2. Use the language switcher in the navbar
3. Verify text changes appropriately
4. Check RTL/LTR direction switching
5. Test on different screen sizes

## Future Enhancements

- Add more languages (French, Spanish, etc.)
- Implement number and date formatting
- Add pluralization support
- Create translation management interface
- Add language-specific fonts
