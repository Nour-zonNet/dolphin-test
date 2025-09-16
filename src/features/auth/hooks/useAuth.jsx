import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  performLogout,
  fetchCurrentUser,
  checkPhone,
  registerUser,
  verifyOtp,
  sendOtpResetPassword,
  verifyOtpResetPassword,
  resetPassword,
  updateUser,
  updateUserImage,
  switchUserAccount,
  addBrother,
  getBrothers,
} from "../store/authSlice";
import { useCallback, useMemo } from "react";

export const useAuth = () => {
  const { user, token, loading, error, brothers } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const isAuthenticated = Boolean(token && user);

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
  const dispatchUpdateUser = useCallback(
    (credentials) => dispatch(updateUser(credentials)),
    [dispatch]
  );
  const dispatchUpdateUserImage = useCallback(
    (image) => dispatch(updateUserImage(image)),
    [dispatch]
  );
  const dispatchSwitchUserAccount = useCallback(
    (bro) => dispatch(switchUserAccount(bro)),
    [dispatch]
  );

  const dispatchGetBrothers = useCallback(
    (bro) => dispatch(getBrothers(bro)),
    [dispatch]
  );

  const dispatchLogout = useCallback(
    (bro) => dispatch(performLogout(bro)),
    [dispatch]
  );

  const dispatchAddBrother = useCallback(
    (bro) => dispatch(addBrother(bro)),
    [dispatch]
  );
  switchUserAccount;
  updateUser;
  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      loading,
      error,
      isAuthLoading,
      isFullyAuthenticated,
      shouldRedirectToLogin,
      loginUser,
      checkPhone,
      registerUser,
      verifyOtp,
      brothers,
      logout: dispatchLogout,
      refreshUser: fetchCurrentUser,
      sendOtpResetPassword: dispatchSendOtpResetPassword,
      verifyOtpResetPassword: dispatchVerifyOtpResetPassword,
      resetPassword: dispatchResetPassword,
      updateUser: dispatchUpdateUser,
      updateUserImage: dispatchUpdateUserImage,
      switchUserAccount: dispatchSwitchUserAccount,
      addBrother: dispatchAddBrother,
      getBrothers: dispatchGetBrothers,
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
      brothers,
      dispatchLogout,
      dispatchSendOtpResetPassword,
      dispatchVerifyOtpResetPassword,
      dispatchResetPassword,
      dispatchUpdateUser,
      dispatchUpdateUserImage,
      dispatchSwitchUserAccount,
      dispatchAddBrother,
      dispatchGetBrothers,
    ]
  );
};
