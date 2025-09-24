import { useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { PasswordForm } from "../components";
import { useAuth } from "../hooks/useAuth";


const PasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isFullyAuthenticated } = useAuth();
  const { phoneNumber } = location.state || {};


  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

 

  const handlePasswordSubmit = async (data) => {
    const res = await login({ phoneNumber, pinCode: data.password }).unwrap();
    if (res?.payload?.success) navigate("/schedule");
  };

  const handleBack = () => {
    navigate("/auth/phone");
  };

  return (
    <AuthLayout handleBack={handleBack}>
      <PasswordForm
        onSubmit={handlePasswordSubmit}
        loading={loading}
        phoneNumber={phoneNumber}
      />
    </AuthLayout>
  );
};

export default PasswordPage;
