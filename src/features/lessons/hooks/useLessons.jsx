import { useSelector } from "react-redux";
import { fetchLessons, getPackageLessons } from "../store/lessonsSlice";

export const useLessons = () => {
  const { items, loading, error } = useSelector((state) => state.lessons);
  return {
    items: items,
    loading,
    error,
    fetchLessons: fetchLessons,
    getPackageLessons: getPackageLessons,
  };
};