import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "@/features/auth/store/authSlice";
import {
  fetchAllPackages,
  fetchMyPackages,
} from "@/features/packages/store/packagesSlice";
import { fetchSubscriptions } from "@/features/subscription/store/subscriptionSlice";
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

        if (!user) {
          await dispatch(fetchCurrentUser());

          await Promise.all([
            dispatch(fetchAllPackages()),
            dispatch(fetchMyPackages()),
            dispatch(fetchLessons()),
            dispatch(fetchSubscriptions()),
          ]);
        }
      } catch (error) {
        console.error("Failed to initialize app:", error);
        initialized.current = false; // Reset on error to allow retry
      }
    };

    initializeApp();
  }, [dispatch, user]);
};
