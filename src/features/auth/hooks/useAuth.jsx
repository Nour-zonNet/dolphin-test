import { useSelector } from "react-redux";
import {
  loginUser,
  logoutUser,
  fetchCurrentUser,
  checkPhone,
  registerUser,
  verifyOtp,
} from "../store/authSlice";
import { useState } from "react";

export const useAuth = () => {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(token && user) //  just in dev mode not production
  );
  return {
    user,
    token,
    isAuthenticated,
    setIsAuthenticated, //  just in dev mode not production
    loading,
    error,
    loginUser: loginUser,
    checkPhone: checkPhone, //{ phone_number : "**********"  }
    registerUser: registerUser,
    verifyOtp: verifyOtp,
    logout: logoutUser,
    refreshUser: fetchCurrentUser,
  };
};
