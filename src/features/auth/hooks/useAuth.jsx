import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  // logoutUser,
  performLogout,
  fetchCurrentUser,
  checkPhone,
  registerUser,
  verifyOtp,
  sendOtpResetPassword,
  verifyOtpResetPassword,
  resetPassword,
} from "../store/authSlice";
import { useCallback, useMemo } from "react";

export const useAuth = () => {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const [isAuthenticated, setIsAuthenticated] = useState(
  //   Boolean(token && user) // just in dev mode not production
  // );
  const isAuthenticated = Boolean(token && user);

  // Helpers
  const isAuthLoading = useCallback(
    () => Boolean(token && !user && loading),
    [token, user, loading]
  );

  const isFullyAuthenticated = useCallback(
    () => Boolean(token && user && !loading),
    [token, user, loading]
  );

  const shouldRedirectToLogin = useCallback(
    () => Boolean(!loading && (!token || !user)),
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

  const doLogin = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const doRegister = useCallback(
    (payload) => dispatch(registerUser(payload)),
    [dispatch]
  );

  const doVerifyOtp = useCallback(
    (payload) => dispatch(verifyOtp(payload)),
    [dispatch]
  );

  const doCheckPhone = useCallback(
    (payload) => dispatch(checkPhone(payload)),
    [dispatch]
  );

  const doSendOtpResetPassword = useCallback(
    (payload) => dispatch(sendOtpResetPassword(payload)),
    [dispatch]
  );

  const doVerifyOtpResetPassword = useCallback(
    (payload) => dispatch(verifyOtpResetPassword(payload)),
    [dispatch]
  );

  const doResetPassword = useCallback(
    (payload) => dispatch(resetPassword(payload)),
    [dispatch]
  );

  const refreshUser = useCallback(
    () => dispatch(fetchCurrentUser()),
    [dispatch]
  );

  const logout = useCallback(
    () => dispatch(performLogout()),   // ✅ single source of truth for logout
    [dispatch]
  );

  // Memoized return object (prevents re-renders in components using this hook)
  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      // setIsAuthenticated, // just in dev mode not production
      loading,
      error,
      isAuthLoading,
      isFullyAuthenticated,
      shouldRedirectToLogin,
      // loginUser,
      // checkPhone, // { phone_number : "**********"  }
      // registerUser,
      // verifyOtp,
      // logout: logoutUser,
      // refreshUser: fetchCurrentUser,
      // sendOtpResetPassword: dispatchSendOtpResetPassword,
      // verifyOtpResetPassword: dispatchVerifyOtpResetPassword,
      // resetPassword: dispatchResetPassword,

      login: doLogin,
      register: doRegister,
      verifyOtp: doVerifyOtp,
      checkPhone: doCheckPhone,
      sendOtpResetPassword: doSendOtpResetPassword,
      verifyOtpResetPassword: doVerifyOtpResetPassword,
      resetPassword: doResetPassword,
      refreshUser,
      logout,

     
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
      // dispatchSendOtpResetPassword,
      // dispatchVerifyOtpResetPassword,
      // dispatchResetPassword,
      doLogin,
      doRegister,
      doVerifyOtp,
      doCheckPhone,
      doSendOtpResetPassword,
      doVerifyOtpResetPassword,
      doResetPassword,
      refreshUser,
      logout,
    ]
  );
};
