import { useSelector, useDispatch } from "react-redux";
import { getProfile, clearProfile, updateProfile } from "../store/profileSlice";
import { useEffect } from "react";

export const useProfile = () => {
  const { user, loading, error } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);
  
  const handleUpdateProfile = async (payload) => {
    try {
      const result = await dispatch(updateProfile(payload)).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err };
    }
  };
  const { token } = useSelector(s => s.auth);
    useEffect(() => {
      if (token) dispatch(getProfile());
      else dispatch(clearProfile());
    }, [token]);

  return {
    user,
    loading,
    error,
    refreshProfile: () => dispatch(getProfile()),
    clearProfile: () => dispatch(clearProfile()),
    handleUpdateProfile,
  };
};

