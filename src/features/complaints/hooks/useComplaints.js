import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import { submitComplaint, fetchComplaints } from "../store/complaintsSlice";

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
      test: [
        {
          id: 1,
          title: "مشكلة فى دخول الحصة ",
          type: "teacher",
          date: "2025-10-07T08:03:00.000000Z",
          status: "pending", // pending,  addressed
          description:
            "مشكلة فى دخول الحصة يرجى التوجه الى الدعم الفني لحل المشكلة ",
          replay: null,
          contents: [
            {
              id: 1,
              type: "image",
              link: "https://torage-learnatdolphin.b-cdn.net/data/2025/images/68e3b23f5a55e___Screenshot_2025-08-17_151906.png",
              name: null,
            },
            {
              id: 2,
              type: "video",
              link: "https://iframe.mediadelivery.net/embed/496462/9fe401bb-fc6d-43ff-90e2-4415de5cdeaf",
              name: null,
            },
          ],
        },
        {
          id: 2,
          title: "مشكلة فى الدرس ",
          type: "technical",
          date: "2025-10-05T08:03:00.000000Z",
          status: "pending",
          description:
            "مشكلة فى الدرس يرجى التوجه الى الدعم الفني لحل المشكلة ",
          replay: null,
          contents: [
            {
              id: 1,
              type: "image",
              link: "https://torage-learnatdolphin.b-cdn.net/data/2025/images/68e3b23f5a55e___Screenshot_2025-08-17_151906.png",
              name: null,
            },
            {
              id: 2,
              type: "video",
              link: "https://iframe.mediadelivery.net/embed/496462/9fe401bb-fc6d-43ff-90e2-4415de5cdeaf",
              name: null,
            },
          ],
        },
      ],
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
