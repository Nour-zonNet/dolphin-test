import { useSelector, useDispatch } from "react-redux";
import { fetchAllPackages, fetchMyPackages, fetchScheduleById } from "../store/packagesSlice";

export const usePackages = () => {
  const { all, mine, loading, error, schedules = {} } = useSelector((state) => state.packages || {});
  const dispatch = useDispatch();
  return {
    all,
    mine,
    loading,
    error,
    fetchAllPackages: () => dispatch(fetchAllPackages()),
    fetchMyPackages: () => dispatch(fetchMyPackages()),
    schedules,
    getSchedule: (groupId) => dispatch(fetchScheduleById(groupId)),
    fetchAllPackages: fetchAllPackages,
    fetchMyPackages: fetchMyPackages,
  };
};
