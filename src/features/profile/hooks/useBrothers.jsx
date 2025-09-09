import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getBrothers } from "../store/profileSlice";

export const useBrothers = () => {
  const {
    brothers,
    loadingBrothers,
    brothersError,
  } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (brothers.length === 0) {
      dispatch(getBrothers());
    }
  }, [dispatch, brothers.length]);

  return {
    brothers,
    loadingBrothers,
    brothersError,
    refreshBrothers: () => dispatch(getBrothers()),
  };
};
