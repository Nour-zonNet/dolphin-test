// features/lessons/hooks/useLessons.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchLessons,
  getPackageLessons,
  getSessionLink,
  clearLessonsError,
  clearSessionLink,
} from "../store/lessonsSlice";

export const useLessons = () => {
  const dispatch = useDispatch();
  const { items, loading, error, link } = useSelector((s) => s.lessons);

  // Always return a promise (the thunk result) so callers can await/finally
  const refetch = useCallback(() => dispatch(fetchLessons()), [dispatch]);
  const fetchPkgLessons = useCallback(
    (packageId) => dispatch(getPackageLessons(packageId)),
    [dispatch]
  );
  const fetchSessLink = useCallback(
    (sessionId) => dispatch(getSessionLink(sessionId)),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearLessonsError()),
    [dispatch]
  );
  const clearLink = useCallback(() => dispatch(clearSessionLink()), [dispatch]);

  return {
    items,
    loading,
    error,
    link,
    refetch,                 
    fetchPackageLessons: fetchPkgLessons,
    fetchSessionLink: fetchSessLink,
    clearError,
    clearLink,
  };
};
