// src/features/managesubscription/hooks/useSubscriptions.js
import { useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  fetchSubscriptions,
  cancelSubscription,
  renewSubscription,
  changeGroupSubscription,
  createTrialSubscription,
} from "../store/subscriptionSlice";

export const useSubscriptions = () => {
  // Select only what's needed to minimize re-renders
  const items = useSelector((state) => state.subscriptions.items, shallowEqual);
  const loading = useSelector((state) => state.subscriptions.loading);
  const error = useSelector((state) => state.subscriptions.error);

  const dispatch = useDispatch();

  // Stable action dispatchers
  const dispatchFetch = useCallback(
    () => dispatch(fetchSubscriptions()),
    [dispatch]
  );
  const dispatchCancel = useCallback(
    (id) => dispatch(cancelSubscription(id)),
    [dispatch]
  );
  const dispatchRenew = useCallback(
    (id) => dispatch(renewSubscription(id)),
    [dispatch]
  );

  const dispatchCreateTrialSub = useCallback(
    (ids) => dispatch(createTrialSubscription(ids)), //array of object
    [dispatch]
  );
  const dispatchChangeGroup = useCallback(
    (id, groupId) => dispatch(changeGroupSubscription({ id, groupId })),
    [dispatch]
  );

  // Return a stable reference to reduce child re-renders
  return useMemo(
    () => ({
      items,
      loading,
      error,
      fetchSubscriptions: dispatchFetch,
      cancelSubscription: dispatchCancel,
      renewSubscription: dispatchRenew,
      changeGroupSubscription: dispatchChangeGroup,
      createTrialSubscription: dispatchCreateTrialSub,
    }),
    [
      items,
      loading,
      error,
      dispatchFetch,
      dispatchCancel,
      dispatchRenew,
      dispatchChangeGroup,
      dispatchCreateTrialSub,
    ]
  );
};
