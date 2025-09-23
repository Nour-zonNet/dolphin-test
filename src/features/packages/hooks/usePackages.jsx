import { useSelector, useDispatch } from "react-redux";
import { useCallback, useMemo } from "react";
import {
  fetchAllPackages,
  fetchMyPackages,
  fetchScheduleById,
  updatePackageGroup,
} from "../store/packagesSlice";

export const usePackages = () => {
  const { all, mine, loading, error, telegram } = useSelector(
    (state) => state.packages || {}
  );
  const dispatch = useDispatch();

  // Dispatch wrappers following useAuth pattern
  const dispatchFetchAllPackages = useCallback(
    () => dispatch(fetchAllPackages()),
    [dispatch]
  );

  const dispatchFetchMyPackages = useCallback(
    () => dispatch(fetchMyPackages()),
    [dispatch]
  );

  const dispatchFetchScheduleById = useCallback(
    (groupId) => dispatch(fetchScheduleById(groupId)),
    [dispatch]
  );

  const dispatchUpdatePackageGroup = useCallback(
    (id, groupId, groupName) =>
      dispatch(updatePackageGroup({ id, groupId, groupName })),
    [dispatch]
  );

  return useMemo(
    () => ({
      all,
      mine,
      loading,
      error,
      telegram,
      fetchAllPackages: dispatchFetchAllPackages,
      fetchMyPackages: dispatchFetchMyPackages,
      fetchScheduleById: dispatchFetchScheduleById,
      updatePackageGroup: dispatchUpdatePackageGroup,
    }),
    [
      all,
      mine,
      loading,
      error,
      telegram,
      dispatchFetchAllPackages,
      dispatchFetchMyPackages,
      dispatchFetchScheduleById,
      dispatchUpdatePackageGroup,
    ]
  );
};
