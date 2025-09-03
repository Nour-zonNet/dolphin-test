import { lazy } from "react";
import DataPlanSelector from "../../features/packages/pages/PackagesSelector";
import { Checkout } from "../../features/packages/pages/CheckoutPages";

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
const LessonExercise = lazy(() => import("@/features/lessons/pages/LessonExercise").then(module => ({ default: module.LessonExercise })));
const ShowLessons = lazy(() => import("@/features/packages/pages/ShowLessons"));

// Auth Pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const PhonePage = lazy(() => import("@/features/auth/pages/PhonePage"));
const OtpPage = lazy(() => import("@/features/auth/pages/OtpPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const PasswordPage = lazy(() => import("@/features/auth/pages/PasswordPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const BalanceDetails = lazy(() => import("@/features/balance/pages/BalanceDetails"));

// Route Configuration
export const routes = [
  // Public Routes
  {
    path: "/",
    element: HomePage,
    public: true,
  },

  // Auth Routes
  {
    path: "/login",
    element: LoginPage,
    public: true,
  },
  {
    path: "/auth",
    children: [
      { path: "phone", element: PhonePage, public: true },
      { path: "otp", element: OtpPage, public: true },
      { path: "register", element: RegisterPage, public: true },
      { path: "password", element: PasswordPage, public: true },
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
<<<<<<< HEAD
=======
  },
  {
    path: "/main-packages",
    element: DataPlanSelector,
    // protected: true,
>>>>>>> 5864e481b6541b13c70dd8fdac21fa56f2a11051
  },
  {
    path: "/checkout",
    element: Checkout,
    protected: true,
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
  {
    path: "/show-lessons",
    element: ShowLessons,
    protected: true,
  },
  {
    path: "/profile",
    element: ProfilePage,
    public: true,
  },
  {
    path: "/balance-details",
    element: BalanceDetails,
    public: true,
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
    if (route.path === path) return route.protected;
    if (route.children) {
      return route.children.some(
        (child) => `${route.path}/${child.path}` === path && child.protected
      );
    }
    return false;
  });
};
