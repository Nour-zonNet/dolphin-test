import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { isAuthLoading, isFullyAuthenticated } = useAuth();

    // If we have a token but no user yet, and we're still loading, show loading state
    if (isAuthLoading()) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    // If no token or no user after loading is complete, redirect to login
    if (!isFullyAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
