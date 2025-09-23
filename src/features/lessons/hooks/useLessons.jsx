// features/lessons/hooks/useLessons.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
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

  // Dispatch wrappers following useAuth pattern
  const dispatchFetchLessons = useCallback(
    () => dispatch(fetchLessons()),
    [dispatch]
  );
  
  const dispatchGetPackageLessons = useCallback(
    (packageId) => dispatch(getPackageLessons(packageId)),
    [dispatch]
  );
  
  const dispatchGetSessionLink = useCallback(
    (sessionId) => dispatch(getSessionLink(sessionId)),
    [dispatch]
  );

  const dispatchClearLessonsError = useCallback(
    () => dispatch(clearLessonsError()),
    [dispatch]
  );
  
  const dispatchClearSessionLink = useCallback(
    () => dispatch(clearSessionLink()),
    [dispatch]
  );

  return useMemo(
    () => ({
      items,
      loading,
      error,
      link,
      fetchLessons: dispatchFetchLessons,
      getPackageLessons: dispatchGetPackageLessons,
      getSessionLink: dispatchGetSessionLink,
      clearLessonsError: dispatchClearLessonsError,
      clearSessionLink: dispatchClearSessionLink,
    }),
    [
      items,
      loading,
      error,
      link,
      dispatchFetchLessons,
      dispatchGetPackageLessons,
      dispatchGetSessionLink,
      dispatchClearLessonsError,
      dispatchClearSessionLink,
    ]
  );
};
