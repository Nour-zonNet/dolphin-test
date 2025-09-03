// src/features/groups/hooks/useGroups.js
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  fetchGroupsByPackageId,
  selectGroupsByPackageId,
  selectGroupsError,
  selectGroupsLoading,
} from "../store/groupSlice";

export const useGroups = (packageId) => {
  const dispatch = useDispatch();

  const groups = useSelector(
    (state) => selectGroupsByPackageId(state, packageId),
    shallowEqual
  );
  const loading = useSelector(selectGroupsLoading);
  const error = useSelector(selectGroupsError);

  const fetchGroups = useCallback(
    () => dispatch(fetchGroupsByPackageId(packageId)),
    [dispatch, packageId]
  );

  return useMemo(
    () => ({ groups, loading, error, fetchGroups }),
    [groups, loading, error, fetchGroups]
  );
};

export default useGroups;
