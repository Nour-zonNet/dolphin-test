import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllPackages,
  fetchMyPackages,
  fetchScheduleById,
} from "../store/packagesSlice";

export const usePackages = () => {
  const { all, mine, loading, error } = useSelector(
    (state) => state.packages || {}
  );
  const dispatch = useDispatch();

  const getSchedule = (groupId) => dispatch(fetchScheduleById(groupId));

  return {
    all,
    mine,
    loading,
    error,
    getSchedule: getSchedule,
    fetchAllPackages: fetchAllPackages,
    fetchMyPackages: fetchMyPackages,
  };
};
