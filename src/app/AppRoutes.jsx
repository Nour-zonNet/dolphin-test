import { Routes, Route } from "react-router-dom";

// Layout
import { Navbar, MobileNav } from "@/components/layout";

// Pages
import HomePage from "@/features/home";
import LessonsSchedule from "@/features/lessons";
import Packages from "@/features/packages";
import { LoginPage } from "@/features/auth/pages";
import { VerificationPage } from "@/features/auth/pages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/schedule"
        element={
          <>
            <Navbar />
            <LessonsSchedule />
            <MobileNav />
          </>
        }
      />

      <Route
        path="/subscriptions"
        element={
          <>
            <Navbar />
            <Packages />
            <MobileNav />
          </>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/verification" element={<VerificationPage />} />
    </Routes>
  );
};

export default AppRoutes;
