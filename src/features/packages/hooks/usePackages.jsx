import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { fetchAllPackages, fetchMyPackages, fetchScheduleById } from "../store/packagesSlice";

export const usePackages = () => {
  const { all, mine, loading, error, schedules = {} } = useSelector((state) => state.packages || {});
  const dispatch = useDispatch();

  // فلترة الباقات لعرض الفعالة والتجريبية وحالة الانتظار فقط
  const filteredMine = useMemo(() => {
    if (!mine || !Array.isArray(mine)) return [];

    return mine.filter((pkg) => {
      const status = pkg.status?.toLowerCase();
      // عرض الباقات الفعالة والتجريبية وحالة الانتظار
      // إخفاء المنتهية (expired) والملغاة (cancelled) فقط
      return status === 'active' || status === 'trial' || status === 'waiting';
    });
  }, [mine]);

  return {
    all,
    mine: filteredMine, // استخدام البيانات المفلترة
    allMine: mine, // إبقاء البيانات الأصلية في حالة الحاجة إليها
    loading,
    error,

    schedules,
    getSchedule: (groupId) => dispatch(fetchScheduleById(groupId)),
    fetchAllPackages: fetchAllPackages,
    fetchMyPackages: fetchMyPackages,
  };
};
