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
import { fetchPackages } from "../features/packages/store/packagesSlice";
import { fetchLessons } from "../features/lessons/store/lessonsSlice";
import ManageSubscription from "../features/managesubscription/pages/ManageSubscription";
import { PackageContent } from "../features/packages/pages/PackagesContent";
import ShowLessons from "../features/packages/pages/ShowLessons";

const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCurrentUser()).then((res) => {
        if (res.meta.requestStatus === "fulfilled" && res.payload) {
          dispatch(fetchPackages());
          dispatch(fetchLessons());
        }
      });
    }
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
      <Route path="/manage-subscription" element={<ManageSubscription />} />
      <Route path="/packages-content" element={<PackageContent />} />
      <Route path="/show-lessons" element={<ShowLessons />} />
  

    </Routes>
  );
};

export default AppRoutes;
