import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "@/features/auth/store/authSlice";
import {
  fetchAllPackages,
  fetchMyPackages,
} from "@/features/packages/store/packagesSlice";
import { fetchSubscriptions } from "@/features/subscription/store/subscriptionSlice";
import { fetchLessons } from "@/features/lessons/store/lessonsSlice";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useClasses } from "./useClasses";

export const useAppInitialization = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const initialized = useRef(false);
  const { getBrothers } = useAuth();
  const { getClasses } = useClasses();

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem("token");

      if (!token || initialized.current) return;
      initialized.current = true;

      try {
        // Always ensure we have user info
        let currentUser = user;
        if (!currentUser) {
          const result = await dispatch(fetchCurrentUser()).unwrap();
          currentUser = result;
        }

        // Now fetch related data in parallel
        await Promise.all([
          dispatch(fetchAllPackages()),
          dispatch(fetchMyPackages()),
          dispatch(fetchLessons()),
          dispatch(fetchSubscriptions()),
          getBrothers(),
          getClasses(),
        ]);
      } catch (error) {
        console.error("❌ Failed to initialize app:", error);
        initialized.current = false; // allow retry
      }
    };

    initializeApp();
  }, [dispatch, getBrothers, getClasses, user]);
};
