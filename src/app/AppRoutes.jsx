import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../features/auth/hooks/useAuth";
// Layouts
import { Navbar, MobileNav } from "@/components/layout";
// Pages
import HomePage from "@/features/home";
import LessonsSchedule from "@/features/lessons";
import Packages from "@/features/packages";
import { LoginPage } from "@/features/auth/pages";
import { VerificationPage } from "@/features/auth/pages";
import RegistrationPage from "../features/auth/pages/RegistrationPage";
import LessonContentPage from "../features/content/pages/LessonContentPage";


const AppRoutes = () => {
    const { loginUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginUser({phoneNumber :"201156235709",pinCode:"111111"})) 
  }, []); 
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
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/schedule/lessoncontent" element={<LessonContentPage />} />
    </Routes>
  );
};

export default AppRoutes;
