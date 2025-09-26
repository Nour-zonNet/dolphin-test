import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthLayout, LoginForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";

const PhonePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkPhone, loading, isFullyAuthenticated } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  // Already logged in → redirect
  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  const handlePhoneSubmit = async () => {
    try {
      // ✅ call bound thunk directly (no extra dispatch)
      const res = await checkPhone({ phone_number: phoneNumber });

      if (res?.payload?.success) {
        if (res?.payload?.data?.otp_sent) {
          navigate("/auth/register", { state: { phoneNumber } });
        } else {
          navigate("/auth/password", { state: { phoneNumber } });
        }
      } else {
        dispatch(
          showModal({
            type: MODAL_TYPES.WARNING,
            props: {
              title: "هنالك خطأ",
              message: res?.payload || res?.error?.message || "حدث خطأ غير متوقع",
            },
          })
        );
      }
    } catch (err) {
      // in case you switch to .unwrap() later
      dispatch(
        showModal({
          type: MODAL_TYPES.WARNING,
          props: {
            title: "هنالك خطأ",
            message: err?.message || "حدث خطأ غير متوقع",
          },
        })
      );
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
