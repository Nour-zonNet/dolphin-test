import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "@/features/auth/store/authSlice";
import { fetchPackages } from "@/features/packages/store/packagesSlice";
import { fetchLessons } from "@/features/lessons/store/lessonsSlice";

export const useAppInitialization = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const initialized = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem("token");
      
      if (!token || initialized.current) return;

      try {
        initialized.current = true;
        
        // Only fetch user if we don't have one yet
        if (!user) {
          const userResult = await dispatch(fetchCurrentUser());
          
          if (userResult.meta.requestStatus === "fulfilled" && userResult.payload) {
            // Fetch additional data in parallel for better performance
            await Promise.all([
              dispatch(fetchPackages()),
              dispatch(fetchLessons())
            ]);
          }
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
        initialized.current = false; // Reset on error to allow retry
      }
    };

    initializeApp();
  }, [dispatch, user]);
};
