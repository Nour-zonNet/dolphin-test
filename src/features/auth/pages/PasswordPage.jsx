import { useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components";
import { PasswordForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";

const PasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, loading } = useAuth();
  const { phoneNumber } = location.state || {};

  // Redirect if no phone number
  if (!phoneNumber) {
    navigate("/auth/phone");
    return null;
  }

  const handlePasswordSubmit = async (data) => {
    const res = await dispatch(
      loginUser({
        phoneNumber: phoneNumber,
        pinCode: data.password,
      })
    );

    if (res?.payload?.success) {
      navigate("/schedule");
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
      <PasswordForm
        onSubmit={handlePasswordSubmit}
        loading={loading}
        phoneNumber={phoneNumber}
      />
    </AuthLayout>
  );
};

export default PasswordPage;
