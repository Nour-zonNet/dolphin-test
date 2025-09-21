import { useSelector } from "react-redux";
import {
  fetchLessons,
  getPackageLessons,
  getSessionLink,
} from "../store/lessonsSlice";

export const useLessons = () => {
  const { items, loading, error } = useSelector((state) => state.lessons);
  return {
    items: items,
    loading,
    error,
    fetchLessons: fetchLessons,
    getPackageLessons: getPackageLessons,
    getSessionLink: getSessionLink,
  };
};
