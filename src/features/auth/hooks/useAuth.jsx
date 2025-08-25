import { useSelector, useDispatch } from "react-redux";
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
  const dispatch = useDispatch();
  return {
    user,
    token,
    isAuthenticated,
    setIsAuthenticated, //  just in dev mode not production
    loading,
    error,
    loginUser: loginUser,
    checkPhone: (credentials) => dispatch(checkPhone(credentials)), //{ phone_number : "**********"  }
    registerUser: (userData) => dispatch(registerUser(userData)),
    verifyOtp: (data) =>
      dispatch(verifyOtp(data)),
    logout: () => dispatch(logoutUser()),
    refreshUser: () => dispatch(fetchCurrentUser()),
  };
};
