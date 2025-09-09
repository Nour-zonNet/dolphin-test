import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { LoginForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";
import { Overlay, Spinner } from "@/components/feedback";

const PhonePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkPhone, loading,  isFullyAuthenticated } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  // If we have a token but no user yet, and we're still loading, show loading state

  // If user is already logged in, redirect to schedule
  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  const handlePhoneSubmit = async () => {
    const res = await dispatch(checkPhone({ phone_number: phoneNumber }));

    if (res?.payload?.success) {
      if (res?.payload?.data?.otp_sent) {
        navigate("/auth/otp", { state: { phoneNumber } });
      } else {
        navigate("/auth/password", { state: { phoneNumber } });
      }
    } else {
      dispatch(
        showModal({
          type: MODAL_TYPES.WARNING,
          props: {
            title: "هنالك خطاء ",
            message: res.payload || res.error.message,
          },
        })
      );
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <AuthLayout handleBack={handleBack} showBackButton={true}>
      <LoginForm
        onSubmit={handlePhoneSubmit}
        loading={loading}
        setPhoneNumber={setPhoneNumber}
      />
    </AuthLayout>
  );
};

export default PhonePage;
