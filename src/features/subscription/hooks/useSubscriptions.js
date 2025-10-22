import { useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  fetchSubscriptions,
  cancelSubscription,
  renewSubscription,
  changeGroupSubscription,
  createTrialSubscription,
  reactivateSubscription,
  fetchGroupsByPackageId,
  createNewSubscriptionPayment,
} from "../store/subscriptionSlice";

export const useSubscriptions = () => {
  // Select only what's needed to minimize re-renders
  const { items, loading, error } = useSelector(
    (state) => ({
      items: state.subscriptions.items,
      loading: state.subscriptions.loading,
      error: state.subscriptions.error,
    }),
    shallowEqual
  );

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

  const dispatchReactivate = useCallback(
    (id) => dispatch(reactivateSubscription(id)),
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
  const dispatchFetchGroupsByPackageId = useCallback(
    (id) => dispatch(fetchGroupsByPackageId(id)),
    [dispatch]
  );

  const dispatchCreateNewSubscriptionPayment = useCallback(
    (packageIds) => dispatch(createNewSubscriptionPayment(packageIds)),
    [dispatch]
  );

  // Return a stable reference to reduce child re-renders
  return useMemo(
    () => ({
      items,
      allItems: items,
      loading,
      error,
      fetchSubscriptions: dispatchFetch,
      cancelSubscription: dispatchCancel,
      reactivateSubscription: dispatchReactivate,
      renewSubscription: dispatchRenew,
      changeGroupSubscription: dispatchChangeGroup,
      createTrialSubscription: dispatchCreateTrialSub,
      fetchGroupsByPackageId: dispatchFetchGroupsByPackageId,
      createNewSubscriptionPayment: dispatchCreateNewSubscriptionPayment,
    }),
    [
      items,
      loading,
      error,
      dispatchFetch,
      dispatchCancel,
      dispatchReactivate,
      dispatchRenew,
      dispatchChangeGroup,
      dispatchCreateTrialSub,
      dispatchFetchGroupsByPackageId,
      dispatchCreateNewSubscriptionPayment,
    ]
  );
};
