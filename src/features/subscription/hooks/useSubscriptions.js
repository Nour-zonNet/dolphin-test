import { useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  fetchSubscriptions,
  cancelSubscription,
  renewSubscription,
  changeGroupSubscription,
  createTrialSubscription,
  reactivateSubscription,
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

  // فلترة الباقات لعرض الفعالة والتجريبية وحالة الانتظار
  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    return items.filter((subscription) => {
      const status = subscription.status?.toLowerCase();
      // عرض الباقات الفعالة والتجريبية وحالة الانتظار
      // إخفاء المنتهية (expired) والملغاة (cancelled) فقط
      return status === 'active' || status === 'trial' || status === 'waiting';
    });
  }, [items]);

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

  // Return a stable reference to reduce child re-renders
  return useMemo(
    () => ({
      items: filteredItems, // استخدام البيانات المفلترة بدلاً من الأصلية
      allItems: items, // إبقاء البيانات الأصلية في حالة الحاجة إليها
      loading,
      error,
      fetchSubscriptions: dispatchFetch,
      cancelSubscription: dispatchCancel,
      reactivateSubscription: dispatchReactivate,
      renewSubscription: dispatchRenew,
      changeGroupSubscription: dispatchChangeGroup,
      createTrialSubscription: dispatchCreateTrialSub,
    }),
    [
      filteredItems,
      items,
      loading,
      error,
      dispatchFetch,
      dispatchCancel,
      dispatchReactivate,
      dispatchRenew,
      dispatchChangeGroup,
      dispatchCreateTrialSub,
    ]
  );
};
