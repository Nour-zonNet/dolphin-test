import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Overlay, Spinner } from "@/components/feedback";

// eslint-disable-next-line no-unused-vars
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { token, user, shouldRedirectToLogin, loading } = useAuth();

    // Avoid flicker: if token exists but user not yet loaded, show blocking loader
    if (token && !user) {
      return (
        <Overlay ariaLabel="Authenticating user">
          <Spinner size={48} colorClass="border-orange-500" />
        </Overlay>
      );
    }

    if (shouldRedirectToLogin() && !loading) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
