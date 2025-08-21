import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser, fetchCurrentUser } from "../store/authSlice";
import { useState } from "react";

export const useAuth = () => {
  const { user, token, loading, error } = useSelector((state) => state.packages);
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
    login: (credentials) => dispatch(loginUser(credentials)),
    logout: () => dispatch(logoutUser()),
    refreshUser: () => dispatch(fetchCurrentUser()),
  };
};
