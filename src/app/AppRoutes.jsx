import { Routes, Route } from "react-router-dom";
import { Navbar, MobileNav } from "@/components/layout";
import HomePage from "@/features/home";
import LessonsSchedule from "@/features/lessons";
import Packages from "@/features/packages";
import { LoginPage } from "@/features/auth/pages";
import { useDispatch } from "react-redux";
import LessonContentPage from "../features/content/pages/LessonContentPage";
import { useEffect } from "react";
import { fetchCurrentUser } from "../features/auth/store/authSlice";

const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
       
        <HomePage/>
        }
      />

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
