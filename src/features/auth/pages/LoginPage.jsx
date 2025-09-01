import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    // Redirect to phone step if not authenticated
    if (!token || !user) {
      navigate("/auth/phone", { replace: true });
    }
  }, [token, user, navigate]);

  // If user is already logged in, redirect to schedule
  if (token && user) {
    return <Navigate to="/schedule" replace />;
  }

  // This component will redirect, so no need to render anything
  return null;
};

export default LoginPage;
