# Project Setup

## 1. Clone project repo from git

```bash
git clone https://github.com/ZonNet-DigitalSolution/learnatdolphin-frontend.git
```

## 2. Install required packages.

```bash
cd learnatdolphin-frontend
npm run install
npm run dev
```


## Contribuation

### 1. check you in development branch

```bash
git checkout development
```

### 2. Pull latest from development

```bash
git pull origin development
```

### 3. Start your implementation by create new branch

```bash
git checkout -b feature/task-title
```

### 4. Task completed push it on you branch

```bash
git status
git add
git commit -m "Write here meaningful message"
git push
```

### 5. Create Pull Request from your task branch with `development` branch and set PR link in your clickup task comment


-------
# React.js Project Structure Recommendations

## 1. Feature-Based Structure (Recommended ⭐)

```
src/
├── components/           # Shared/reusable components
│   ├── ui/              # Basic UI components (Button, Input, Modal)
│   │   ├── Button/
│   │   │   ├── index.js
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.css
│   │   └── Input/
│   └── layout/          # Layout components (Header, Footer, Sidebar)
├── features/            # Feature-based modules
│   ├── auth/
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/       # Auth-related custom hooks
│   │   ├── services/    # Auth API calls
│   │   ├── store/       # Auth state management
│   │   └── index.js     # Export barrel
│   ├── dashboard/
│   └── profile/
├── hooks/               # Shared custom hooks
├── services/            # API services and external integrations
│   ├── api.js          # Axios instance and interceptors
│   ├── auth.js         # Authentication services
│   └── users.js        # User-related API calls
├── store/               # Global state management (Redux/Zustand)
│   ├── slices/         # Redux slices or store modules
│   └── index.js
├── utils/               # Utility functions
├── constants/           # App constants and configurations
├── styles/              # Global styles
├── assets/              # Static assets
└── App.js
```

### Why Feature-Based is the Best Choice:

**✅ Advantages:**
- **Scalability**: Easy to add new features without restructuring
- **Maintainability**: Related code is co-located
- **Team Collaboration**: Different teams can work on different features
- **Code Reusability**: Clear separation between shared and feature-specific code
- **Testing**: Easy to test features in isolation
- **Bundle Splitting**: Natural code-splitting boundaries

**🚀 Best Practices for Feature-Based Structure:**

### File Naming Conventions:
```
- PascalCase for components: `UserProfile.jsx`
- camelCase for utilities: `formatDate.js`
- kebab-case for CSS modules: `user-profile.module.css`
- UPPER_SNAKE_CASE for constants: `API_ENDPOINTS.js`
```

### Index.js Barrel Exports:
```javascript
// features/auth/index.js
export { default as LoginForm } from './components/LoginForm';
export { default as SignupForm } from './components/SignupForm';
export { useAuth } from './hooks/useAuth';
export { authService } from './services/authService';
```

### Component Structure:
```
components/Button/
├── index.js           # Barrel export
├── Button.jsx         # Main component
├── Button.test.js     # Tests
├── Button.stories.js  # Storybook stories
└── Button.module.css  # Styles
```

## Recommended Tech Stack Integration:

```javascript
// Package.json dependencies for modern React project
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^4.x", // Server state
    "zustand": "^4.x", // Client state (or Redux Toolkit)
    "axios": "^1.x", // HTTP client
    "react-hook-form": "^7.x", // Forms
    "zod": "^3.x", // Schema validation
    "tailwindcss": "^3.x" // Styling
  }
}
```

## Project Setup Commands:

```bash
# Create project with Vite (faster than CRA)
npm create vite@latest my-react-app -- --template react
cd my-react-app

# Install additional dependencies
npm install react-router-dom @tanstack/react-query zustand axios
npm install -D @tailwindcss/vite
```

## Configuration Files to Add:

### ESLint + Prettier Setup:
```json
// .eslintrc.js
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "import/order": ["error", {
      "groups": [
        "builtin",
        "external",
        "internal",
        "parent",
        "sibling",
        "index"
      ]
    }]
  }
}
```

### Path Aliases (vite.config.js):
```javascript
import path from 'path';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
};
```
