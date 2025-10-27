import { useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { VerificationForm } from "../components";
import { useAuth } from "../hooks/useAuth";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFullyAuthenticated, verifyOtp } = useAuth();
  const { phoneNumber } = location.state || {};

  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  if (!phoneNumber) {
    navigate("/auth/phone");
    return null;
  }

  const handleOtpSubmit = async (data) => {
    const res = await verifyOtp({
      phone_number: phoneNumber,
      otp_code: `${data.otp}`,
    }).unwrap();
    if (res?.success) navigate("/auth/register", { state: { phoneNumber } });
  };

  const handleBack = () => {
    navigate("/auth/phone");
  };

  return (
    <AuthLayout handleBack={handleBack}>
      <VerificationForm onSubmit={handleOtpSubmit} phoneNumber={phoneNumber} />
    </AuthLayout>
  );
};

export default OtpPage;
