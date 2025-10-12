import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Overlay, Spinner } from "@/components/feedback";
import { useMediaQuery } from "react-responsive";

// eslint-disable-next-line no-unused-vars
const withAuth = (WrappedComponent) => {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ minWidth: 481, maxWidth: 800 });
  let spinnerSize = 100; 
  if (isTablet) spinnerSize = 80;
  if (isMobile) spinnerSize = 60;

  return (props) => {
    const { token, user, shouldRedirectToLogin, loading } = useAuth();

    // Avoid flicker: if token exists but user not yet loaded, show blocking loader
    if (token && !user) {
      return (
        <Overlay ariaLabel="Authenticating user">
          <Spinner size={spinnerSize} />
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