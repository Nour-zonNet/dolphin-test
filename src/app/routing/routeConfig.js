import React, { lazy } from "react";

// Error pages should NOT be lazy-loaded since they're used in ErrorBoundary
import OfflineScreen from "@/components/OfflineScreen";
import Forbidden403 from "@/components/Forbidden403";
import NotFound404 from "@/components/NotFound404";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import GeneralError from "@/components/GeneralError";

// Wrapper to ensure React is initialized before loading lazy components
// This fixes the "Cannot set properties of undefined (setting 'Children')" error
const safeLazyImport = (importFn) => {
  return lazy(async () => {
    // Ensure React is loaded and initialized
    await import("react");
    await import("react-dom/client");
    
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      console.error("❌ Lazy import failed:", error);
      // Return a fallback component using React.createElement
      return { 
        default: () => React.createElement(
          'div',
          { style: { padding: '20px', textAlign: 'center' } },
          React.createElement('p', null, 'Component failed to load. Please refresh the page.')
        )
      };
    }
  });
};

// Lazy load all heavy components for better performance

const DataPlanSelector = safeLazyImport(() => import("../../features/packages/pages/PackagesSelector"));
const Checkout = safeLazyImport(() => import("../../features/packages/pages/Checkout"));
const LoginSiblings = safeLazyImport(() => import("../../features/auth/pages/LoginSiblings"));
const AddSiblingsPage = safeLazyImport(() => import("../../features/auth/pages/AddSibilingPage/AddSiblingsPage"));
const Board = safeLazyImport(() => import("../../features/Board/Board"));
const PDFViewerPage = safeLazyImport(() => import("../../features/PDFViewer/PDFViewerPage"));
const PrivacyPolicyPage = safeLazyImport(() => import("../../features/PrivacyPolicy/PrivacyPolicyPage"));
const SessionPage = safeLazyImport(() => import("../../features/lessons/pages/SessionPage"));
const GlobalSessionPage = safeLazyImport(() => import("../../features/lessons/pages/GlobalSession"));
const WeeklySchedule = safeLazyImport(() => import("../../features/lessons/pages/WeeklySchedule"));
const TeacherProfile = safeLazyImport(() => import("../../features/teacher/pages/profile"));
const CommunityPage = safeLazyImport(() => import("@/features/community/CommunityPage"));

const HomePage = safeLazyImport(() => import("@/features/home"));
const SchedulePage = safeLazyImport(() => import("@/features/lessons"));
const Packages = safeLazyImport(() => import("@/features/packages"));
const LessonContentPage = safeLazyImport(() =>
  import("@/features/lessons/pages/LessonContentPage")
);
const ManageSubscription = safeLazyImport(() => import("@/features/subscription"));
const PackagesContent = safeLazyImport(() =>
  import("@/features/packages/pages/PackagesContent")
);
const LessonExercise = safeLazyImport(() =>
  import("@/features/lessons/pages/LessonExercise")
);
const ShowLessons = safeLazyImport(() => import("@/features/packages/pages/ShowLessons"));

// Auth Pages
const LoginPage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.LoginPage,
  }))
);
const PhonePage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.PhonePage,
  }))
);
const OtpPage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.OtpPage,
  }))
);
const RegisterPage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.RegisterPage,
  }))
);
const PasswordPage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.PasswordPage,
  }))
);
const ForgotPasswordOtpPage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.ForgotPasswordOtpPage,
  }))
);
const ForgotPasswordResetPage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.ForgotPasswordResetPage,
  }))
);
const ForgotPasswordPage = safeLazyImport(() =>
  import("@/features/auth/pages").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
);
const ProfilePage = safeLazyImport(() => import("@/features/profile/pages/ProfilePage"));
const Reports = safeLazyImport(() => import("@/features/profile/pages/Reports"));
const ComplaintsPage = safeLazyImport(() =>
  import("@/features/complaints/pages/ComplaintsPage")
);

const BalanceDetails = safeLazyImport(() =>
  import("@/features/balance/pages/BalanceDetails")
);
const PaymentStatus = safeLazyImport(() =>
  import("@/features/balance/pages/PaymentStatus")
);
const RenewalStatus = safeLazyImport(() =>
  import("@/features/subscription/pages/RenewalStatus")
);

// Route Configuration
export const routes = [
  // Public Routes
  {
    path: "/",
    element: HomePage,
    public: true,
    layout: false,
    homeSupportBtn: true,
  },

  // Auth Routes
  {
    path: "/login",
    element: LoginPage,
    public: true,
    layout: false, // Auth pages don't need AppLayout
  },
  {
    path: "/pdf",
    element: Board,
    public: true,
    layout: false, // Auth pages don't need AppLayout
  },
  {
    path: "/privacy-policy",
    element: PrivacyPolicyPage,
    public: true,
    layout: false, // Auth pages don't need AppLayout
  },
  {
    path: "/pdfviewer",
    element: PDFViewerPage,
    public: true,
    layout: false, // Auth pages don't need AppLayout
  },
  {
    path: "/auth",

    children: [
      {
        path: "phone",
        element: PhonePage,
        public: true,
        layout: false,
        homeSupportBtn: true,
      },
      {
        path: "otp",
        element: OtpPage,
        public: true,
        layout: false,
        homeSupportBtn: true,
      },
      {
        path: "register",
        element: RegisterPage,
        public: true,
        layout: false,
        homeSupportBtn: true,
      },
      {
        path: "password",
        element: PasswordPage,
        public: true,
        layout: false,
        homeSupportBtn: true,
      },
      {
        path: "siblings",
        element: LoginSiblings,
        public: true,
        layout: false,
        homeSupportBtn: true,
      },
      {
        path: "addsiblings",
        element: AddSiblingsPage,
        public: true,
        layout: false,
        homeSupportBtn: true,
      },
      {
        path: "forgetpassword",
        element: ForgotPasswordPage,
        public: true,
        layout: false,
      },
      {
        path: "forgetpassword/otp",
        element: ForgotPasswordOtpPage,
        public: true,
        layout: false,
      },
      {
        path: "forgetpassword/reset",
        element: ForgotPasswordResetPage,
        public: true,
        layout: false,
      },
    ],
  },

  // Protected Routes (require layout)
  {
    path: "/schedule",
    element: SchedulePage,
    protected: true,
    homeSupportBtn: true,
  },
  {
    path: "/subscriptions",
    element: Packages,
    protected: true,
    homeSupportBtn: true,
  },
  {
    path: "/manage-subscription",
    element: ManageSubscription,
    protected: true,
    layout: false,
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
    element: PackagesContent,
    protected: true,
    navbar: false,
    mobileNav: true,
    homeSupportBtn: true,
  },

  // Community
  {
    path: "/community",
    element: CommunityPage,
    protected: true,
    navbar: false,
    mobileNav: true,
    homeSupportBtn: true,
  },

  // Nested Schedule Routes
  {
    path: "/schedule",
    children: [
      {
        path: "lessoncontent/:id",
        element: SessionPage,
        protected: false,
        layout: false,
      },
      {
        path: "lessoncontent",
        element: LessonContentPage,
        protected: false,
        layout: false,
      },
      { path: "exercise", element: LessonExercise, protected: true },
    ],
  },
  {
    path: "/show-lessons/:packageId",
    element: ShowLessons,
    protected: true,
    layout: false,
    homeSupportBtn: true,
  },
  {
    path: "/profile",
    element: ProfilePage,
    protected: true,
    navbar: false,
    mobileNav: true,
    homeSupportBtn: true,
  },
  {
    path: "/reports",
    element: Reports,
    protected: true,
    navbar: false,
    mobileNav: false,
    homeSupportBtn: true,
  },
  {
    path: "/balance-details",
    element: BalanceDetails,
    protected: true,
    layout: false,
  },
  {
    path: "/payment-status/:status",
    element: PaymentStatus,
    protected: true,
    layout: false,
  },
  {
    path: "/renew-subscription/:status",
    element: RenewalStatus,
    protected: true,
    layout: false,
  },
  {
    path: "/renewal-status/:status/:type?",
    element: RenewalStatus,
    protected: true,
    layout: false,
  },
  {
    path: "/offline",
    element: OfflineScreen,
    public: true,
    layout: false,
  },
  {
    path: "/under-maintenance",
    element: MaintenanceScreen,
    protected: true,
    layout: false,
  },
  {
    path: "/403",
    element: Forbidden403,
    public: true,
    layout: false,
  },
  {
    path: "/404",
    element: NotFound404,
    public: true,
    layout: false,
  },
  {
    path: "/error",
    element: GeneralError,
    public: true,
    layout: false,
  },
  {
    path: "/weekly-schedule",
    element: WeeklySchedule,
    protected: true,
    layout: false,
  },
  {
    path: "/complaints",
    element: ComplaintsPage,
    protected: true,
    navbar: false,
    mobileNav: true,
    homeSupportBtn: true,
  },
  {
    path: "/teacher/:username",
    element: GlobalSessionPage,
    protected: false,
    homeSupportBtn: true,
    navbar: false,
    mobileNav: false,
    layout: false,
  },
  {
    path: "/teacher/profile",
    element: TeacherProfile,
    protected: false,
    homeSupportBtn: true,
    navbar: false,
    mobileNav: false,
    layout: false,
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
        (child) =>
          `${route.path}/${child.path}` === path && child.layout !== false
      );
    }
    return false;
  });
};
