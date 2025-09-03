import { useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { VerificationForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";
import { Overlay, Spinner } from "@/components/feedback";

const OtpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp,  isFullyAuthenticated } = useAuth();
  const { phoneNumber } = location.state || {};

  // If we have a token but no user yet, and we're still loading, show loading state


  // If user is already logged in, redirect to schedule
  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  // Redirect if no phone number
  if (!phoneNumber) {
    navigate("/auth/phone");
    return null;
  }

  const handleOtpSubmit = async (data) => {
    const res = await dispatch(
      verifyOtp({
        phone_number: phoneNumber,
        otp_code: `${data.otp}`,
      })
    );

    if (res?.payload?.success) {
      navigate("/auth/register", { state: { phoneNumber } });
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
    navigate("/auth/phone");
  };

  return (
    <AuthLayout handleBack={handleBack}>
      <VerificationForm onSubmit={handleOtpSubmit} />
    </AuthLayout>
  );
};

export default OtpPage;
