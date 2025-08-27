import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { token, user } = useSelector((state) => state.auth);

  

    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
