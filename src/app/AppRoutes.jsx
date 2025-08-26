import { Routes, Route } from "react-router-dom";

// Layouts
import { Navbar, MobileNav } from "@/components/layout";
// Pages
import HomePage from "@/features/home";
import LessonsSchedule from "@/features/lessons";
import Packages from "@/features/packages";
import { LoginPage } from "@/features/auth/pages";
import { useDispatch } from "react-redux";
import { useAuth } from "../features/auth/hooks/useAuth";
import LessonContentPage from "../features/content/pages/LessonContentPage";
import { useEffect } from "react";

const AppRoutes = () => {
  const { loginUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginUser({ phoneNumber: "201156235709", pinCode: "111111" }));
  }, [dispatch]);
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
      <Route path="/schedule/lessoncontent" element={<LessonContentPage />} />
    </Routes>
  );
};

export default AppRoutes;
