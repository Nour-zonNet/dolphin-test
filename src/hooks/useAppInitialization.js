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
  const { user, token } = useSelector((state) => state.auth); // ✅ rely only on Redux state
  const initialized = useRef(null); // store last initialized token
  const { getBrothers } = useAuth();
  const { getClasses } = useClasses();

  useEffect(() => {
    const initializeApp = async () => {
      if (!token || initialized.current === token) return; // ✅ prevent duplicate runs for same token
      initialized.current = token;

      try {
        // Ensure we have user info
        let currentUser = user;
        if (!currentUser) {
          currentUser = await dispatch(fetchCurrentUser()).unwrap();
        }

        // Fetch related data in parallel
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
        initialized.current = null; // allow retry if initialization fails
      }
    };

    initializeApp();
  }, [dispatch, getBrothers, getClasses, token, user]); // ✅ token triggers re-run
};
