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
    const token = localStorage.getItem("token");

    if (!token || initialized.current) return;

    initialized.current = true;

    // Step 1: fetch user if not already loaded
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Step 2: once we have a user, fetch the rest of the data
    if (user && !initialized.current) {
      initialized.current = true;

      Promise.all([
        dispatch(fetchAllPackages()),
        dispatch(fetchMyPackages()),
        dispatch(fetchLessons()),
        dispatch(fetchSubscriptions()),
      ]).catch((error) => {
        console.error("Failed to fetch app data:", error);
        initialized.current = false; // allow retry if needed
      });
    }
  }, [dispatch, user]);
};
