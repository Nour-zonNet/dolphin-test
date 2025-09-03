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
  
  // Helper function to check if authentication is still in progress
  const isAuthLoading = () => {
    return token && !user && loading;
  };
  
  // Helper function to check if user is fully authenticated
  const isFullyAuthenticated = () => {
    return token && user && !loading;
  };
  
  // Helper function to check if user should be redirected to login
  const shouldRedirectToLogin = () => {
    return !loading && (!token || !user);
  };
  
  return {
    user,
    token,
    isAuthenticated,
    setIsAuthenticated, //  just in dev mode not production
    loading,
    error,
    isAuthLoading,
    isFullyAuthenticated,
    shouldRedirectToLogin,
    loginUser: loginUser,
    checkPhone: checkPhone, //{ phone_number : "**********"  }
    registerUser: registerUser,
    verifyOtp: verifyOtp,
    logout: logoutUser,
    refreshUser: fetchCurrentUser,
  };
};
