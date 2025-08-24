import {  useSelector } from "react-redux";
import { fetchLessons } from "../store/lessonsSlice";

export const useLessons = () => {
  const { items, loading, error } = useSelector((state) => state.lessons);
  return {
    items,
    loading,
    error,
    fetchLessons: fetchLessons,
  };
};
