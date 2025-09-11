import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  logoutUser,
  fetchCurrentUser,
  checkPhone,
  registerUser,
  verifyOtp,
  sendOtpResetPassword,
  verifyOtpResetPassword,
  resetPassword,
} from "../store/authSlice";
import { useState, useCallback, useMemo } from "react";

export const useAuth = () => {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(token && user) // just in dev mode not production
  );

  // Helpers
  const isAuthLoading = useCallback(
    () => token && !user && loading,
    [token, user, loading]
  );

  const isFullyAuthenticated = useCallback(
    () => token && user && !loading,
    [token, user, loading]
  );

  const shouldRedirectToLogin = useCallback(
    () => !loading && (!token || !user),
    [token, user, loading]
  );

  // Dispatch wrappers
  const dispatchSendOtpResetPassword = useCallback(
    (credentials) => dispatch(sendOtpResetPassword(credentials)),
    [dispatch]
  );

  const dispatchVerifyOtpResetPassword = useCallback(
    (credentials) => dispatch(verifyOtpResetPassword(credentials)),
    [dispatch]
  );
    const dispatchResetPassword = useCallback(
    (credentials) => dispatch(resetPassword(credentials)),
    [dispatch]
  );


  // Memoized return object (prevents re-renders in components using this hook)
  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      setIsAuthenticated, // just in dev mode not production
      loading,
      error,
      isAuthLoading,
      isFullyAuthenticated,
      shouldRedirectToLogin,
      loginUser,
      checkPhone, // { phone_number : "**********"  }
      registerUser,
      verifyOtp,
      logout: logoutUser,
      refreshUser: fetchCurrentUser,
      sendOtpResetPassword: dispatchSendOtpResetPassword,
      verifyOtpResetPassword: dispatchVerifyOtpResetPassword,
      resetPassword: dispatchResetPassword,
    }),
    [
      user,
      token,
      isAuthenticated,
      loading,
      error,
      isAuthLoading,
      isFullyAuthenticated,
      shouldRedirectToLogin,
      dispatchSendOtpResetPassword,
      dispatchVerifyOtpResetPassword,
      dispatchResetPassword,
    ]
  );
};
