import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { LoginForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";

const PhonePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkPhone, loading, error } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

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

  return (
    <AuthLayout showBackButton={false}>
      <LoginForm
        onSubmit={handlePhoneSubmit}
        loading={loading}
        error={error}
        setPhoneNumber={setPhoneNumber}
      />
    </AuthLayout>
  );
};

export default PhonePage;
