import { lazy } from "react";
import DataPlanSelector from "../../features/packages/pages/PackagesSelector";
import Checkout from "../../features/packages/pages/Checkout";

// Lazy load components for better performance
const HomePage = lazy(() => import("@/features/home"));
const LessonsSchedule = lazy(() => import("@/features/lessons"));
const Packages = lazy(() => import("@/features/packages"));
const LessonContentPage = lazy(() =>
  import("@/features/content/pages/LessonContentPage").then((module) => ({
    default: module.LessonContentPage,
  }))
);
const ManageSubscription = lazy(() =>
  import("@/features/subscription/pages/ManageSubscription").then((module) => ({
    default: module.ManageSubscription,
  }))
);
const PackageContent = lazy(() =>
  import("@/features/packages/pages/PackagesContent").then((module) => ({
    default: module.PackageContent,
  }))
);
const Board = lazy(() => import("@/features/Board"));
const LessonExercise = lazy(() =>
  import("@/features/lessons/pages/LessonExercise").then((module) => ({
    default: module.LessonExercise,
  }))
);

// Auth Pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const PhonePage = lazy(() => import("@/features/auth/pages/PhonePage"));
const OtpPage = lazy(() => import("@/features/auth/pages/OtpPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const PasswordPage = lazy(() => import("@/features/auth/pages/PasswordPage"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));

// Route Configuration
export const routes = [
  // Public Routes
  {
    path: "/",
    element: HomePage,
    public: true,
    layout: false, // Home page doesn't need AppLayout
  },

  // Auth Routes
  {
    path: "/login",
    element: LoginPage,
    public: true,
    layout: false, // Auth pages don't need AppLayout
  },
  {
    path: "/auth",
    children: [
      { path: "phone", element: PhonePage, public: true, layout: false },
      { path: "otp", element: OtpPage, public: true, layout: false },
      { path: "register", element: RegisterPage, public: true, layout: false },
      { path: "password", element: PasswordPage, public: true, layout: false },
      { path: "forgetpassword", element: ForgotPasswordPage, public: true, layout: false },
    ],
  },

  // Protected Routes (require layout)
  {
    path: "/schedule",
    element: LessonsSchedule,
    protected: true,
  },
  {
    path: "/subscriptions",
    element: Packages,
    protected: true,
  },
  {
    path: "/manage-subscription",
    element: ManageSubscription,
    protected: true,
  },
  {
    path: "/main-packages",
    element: DataPlanSelector,
    protected: true,
    layout: false, // Packages selector has its own layout
  },
  {
    path: "/checkout",
    element: Checkout,
    protected: true,
    layout: false, // Checkout page has its own layout
  },
  {
    path: "/packages-content",
    element: PackageContent,
    protected: true,
  },
  {
    path: "/board",
    element: Board,
    protected: true,
  },

  // Nested Schedule Routes
  {
    path: "/schedule",
    children: [
      { path: "lessoncontent", element: LessonContentPage, protected: true },
      { path: "exercise", element: LessonExercise, protected: true },
    ],
  },
];

// Helper function to check if route is public
export const isPublicRoute = (path) => {
  return routes.some((route) => {
    if (route.path === path) return route.public;
    if (route.children) {
      return route.children.some(
        (child) => `${route.path}/${child.path}` === path && child.public
      );
    }
    return false;
  });
};

// Helper function to check if route requires layout
export const requiresLayout = (path) => {
  return routes.some((route) => {
    if (route.path === path) return route.layout !== false; // Default to true unless explicitly false
    if (route.children) {
      return route.children.some(
        (child) => `${route.path}/${child.path}` === path && child.layout !== false
      );
    }
    return false;
  });
};
