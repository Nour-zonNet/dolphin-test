import { useSelector, useDispatch } from "react-redux";
import { getProfile, clearProfile } from "../store/profileSlice";
import { useEffect } from "react";

export const useProfile = () => {
  const { user, loading, error } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  return {
    user,
    loading,
    error,
    refreshProfile: () => dispatch(getProfile()),
    clearProfile: () => dispatch(clearProfile()),
  };
};

