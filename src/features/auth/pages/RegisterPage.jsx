import { useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { RegisterForm } from "../components";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser, loading, error, isFullyAuthenticated } = useAuth();
  const { phoneNumber } = location.state || {};

  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  const handleRegisterSubmit = async (data) => {
    const res = await registerUser({
      phoneNumber: phoneNumber,
      name: data.name,
      grade: data.grade,
      pinCode: data.password,
    });

    if (res?.meta?.requestStatus === "fulfilled") {
      navigate("/main-packages");
      return;
    }
  };

  const handleBack = () => {
    navigate("/auth/phone", { state: { phoneNumber } });
  };

  return (
    <AuthLayout handleBack={handleBack}>
      <RegisterForm
        onSubmit={handleRegisterSubmit}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
