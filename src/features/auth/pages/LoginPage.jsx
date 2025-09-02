import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthLoading, isFullyAuthenticated, shouldRedirectToLogin } = useAuth();

  useEffect(() => {
    // Only redirect if we're not loading and definitely not authenticated
    if (shouldRedirectToLogin()) {
      navigate("/auth/phone", { replace: true });
    }
  }, [shouldRedirectToLogin, navigate]);

  // If we have a token but no user yet, and we're still loading, show loading state
  if (isAuthLoading()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is already logged in, redirect to schedule
  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  // This component will redirect, so no need to render anything
  return null;
};

export default LoginPage;
