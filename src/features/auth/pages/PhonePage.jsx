import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthLayout, LoginForm } from "../components";
import { useAuth } from "../hooks/useAuth";

const PhonePage = () => {
  const navigate = useNavigate();
  const { checkPhone, loading, isFullyAuthenticated } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  const handlePhoneSubmit = async () => {
    const res = await checkPhone({ phone_number: phoneNumber }).unwrap();
    // console.log(res);
    if (res?.success) {
      if (res?.data?.otp_sent) {
        navigate("/auth/register", { state: { phoneNumber } });
      } else {
        navigate("/auth/password", { state: { phoneNumber } });
      }
    }
  };

  const handleBack = () => navigate("/");

  return (
    <AuthLayout handleBack={handleBack} showBackButton>
      <LoginForm
        onSubmit={handlePhoneSubmit}
        loading={loading}
        setPhoneNumber={setPhoneNumber}
      />
    </AuthLayout>
  );
};

export default PhonePage;
