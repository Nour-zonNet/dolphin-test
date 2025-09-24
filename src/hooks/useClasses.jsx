import { useSelector, useDispatch } from "react-redux";
import { getClasses } from "../store/classesSlice";
import { useCallback, useEffect, useMemo } from "react";

export const useClasses = () => {
  const { items, loading, error } = useSelector((state) => state.classes);
  const dispatch = useDispatch();

  const dispatchGetClasses = useCallback(() => {
    dispatch(getClasses());
  }, [dispatch]);

  useEffect(() => {
    if (items.length === 0) {
      dispatchGetClasses();
    }
  }, [items.length, dispatchGetClasses]);

  return useMemo(
    () => ({
      classes:items,
      loading,
      error,
      getClasses: dispatchGetClasses,
    }),
    [items, loading, error, dispatchGetClasses]
  );
};
