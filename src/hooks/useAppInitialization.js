import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/features/auth/store/authSlice";
import { fetchPackages } from "@/features/packages/store/packagesSlice";
import { fetchLessons } from "@/features/lessons/store/lessonsSlice";

export const useAppInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) return;

      try {
        const userResult = await dispatch(fetchCurrentUser());
        
        if (userResult.meta.requestStatus === "fulfilled" && userResult.payload) {
          // Fetch additional data in parallel for better performance
          await Promise.all([
            dispatch(fetchPackages()),
            dispatch(fetchLessons())
          ]);
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // You could dispatch an error action here if you have error handling
      }
    };

    initializeApp();
  }, [dispatch]);
};
