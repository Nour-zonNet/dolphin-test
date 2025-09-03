import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Overlay, Spinner } from "@/components/feedback";

// eslint-disable-next-line no-unused-vars
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { shouldRedirectToLogin } = useAuth();

    // If we have a token but no user yet, and we're still loading, show loading state

    // If no token or no user after loading is complete, redirect to login
    if (shouldRedirectToLogin()) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
