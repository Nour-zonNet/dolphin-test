import { useSelector, useDispatch } from "react-redux";
import { getProfile, clearProfile, updateProfile } from "../store/profileSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

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
      toast.success(result.message || "تم تحديث البيانات بنجاح");
    } catch (err) {
      toast.error(err?.message || "فشل التحديث");
    }
  };

  return {
    user,
    loading,
    error,
    refreshProfile: () => dispatch(getProfile()),
    clearProfile: () => dispatch(clearProfile()),
    handleUpdateProfile,
  };
};

