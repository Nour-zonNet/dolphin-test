// features/lessons/hooks/useLessons.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import {
  fetchLessons,
  getPackageLessons,
  getSessionLink,
  getContentsBySessionId,
  getGlobalSessionByTeacherUsername,
  joinGlobalSession,
} from "../store/lessonsSlice";

export const useLessons = () => {
  const dispatch = useDispatch();
  const { items, loading, error, link } = useSelector((s) => s.lessons);

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

  const dispatchGetContentsBySessionId = useCallback(
    (sessionId) => {
      return dispatch(getContentsBySessionId(sessionId));
    },
    [dispatch]
  );
  const dispatchJoinGlobalSession = useCallback(
    (joinData) => dispatch(joinGlobalSession(joinData)),
    [dispatch]
  );

  const dispatchGetGlobalSessionByTeacherUsername = useCallback(
    (username) => dispatch(getGlobalSessionByTeacherUsername(username)),
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
      getContentsBySessionId: dispatchGetContentsBySessionId,
      getGlobalSessionByTeacherUsername: dispatchGetGlobalSessionByTeacherUsername,
      joinGlobalSession: dispatchJoinGlobalSession,
    }),
    [
      items,
      loading,
      error,
      link,
      dispatchFetchLessons,
      dispatchGetPackageLessons,
      dispatchGetSessionLink,
      dispatchGetContentsBySessionId,
      dispatchGetGlobalSessionByTeacherUsername,
      dispatchJoinGlobalSession,
    ]
  );
};
