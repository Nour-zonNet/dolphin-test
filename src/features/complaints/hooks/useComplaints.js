import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import {
  submitComplaint,
  fetchComplaints,
} from "../store/complaintsSlice";

export const useComplaints = () => {
  const { items, loading, error, submitLoading, submitError } = useSelector(
    (state) => state.complaints || {}
  );
  const dispatch = useDispatch();

  // Dispatch wrappers
  const dispatchSubmitComplaint = useCallback(
    (complaintData) => dispatch(submitComplaint(complaintData)),
    [dispatch]
  );

  const dispatchFetchComplaints = useCallback(
    () => dispatch(fetchComplaints()),
    [dispatch]
  );

  return useMemo(
    () => ({
      items,
      loading,
      error,
      submitLoading,
      submitError,
      submitComplaint: dispatchSubmitComplaint,
      fetchComplaints: dispatchFetchComplaints,
    }),
    [
      items,
      loading,
      error,
      submitLoading,
      submitError,
      dispatchSubmitComplaint,
      dispatchFetchComplaints,
    ]
  );
};
