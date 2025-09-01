// src/features/managesubscription/hooks/useSubscriptions.js
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSubscriptions,
  cancelSubscription,
  renewSubscription,
  changeGroupSubscription,
} from "../store/subscriptionSlice";

export const useSubscriptions = () => {
  const { items, loading, error } = useSelector((state) => state.subscriptions);
  const dispatch = useDispatch();

  return {
    items,
    loading,
    error,
    fetchSubscriptions: () => dispatch(fetchSubscriptions()),
    cancelSubscription: (id) => dispatch(cancelSubscription(id)),
    renewSubscription: (id) => dispatch(renewSubscription(id)),
    changeGroupSubscription: (id, groupId) =>
      dispatch(changeGroupSubscription({ id, groupId })),
  };
};
