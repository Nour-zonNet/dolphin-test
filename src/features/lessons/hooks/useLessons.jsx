import {  useSelector } from "react-redux";

export const useLessons = () => {
  const { items, loading, error } = useSelector((state) => state.lessons);

  return {
    items,
    loading,
    error,
  };
};
