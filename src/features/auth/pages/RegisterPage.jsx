import { useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components";
import { RegisterForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser, loading, error } = useAuth();
  const { phoneNumber } = location.state || {};

  // Redirect if no phone number
  if (!phoneNumber) {
    navigate("/auth/phone");
    return null;
  }

  const handleRegisterSubmit = async (data) => {
    const res = await dispatch(
      registerUser({
        phoneNumber: phoneNumber,
        name: data.name,
        grade: data.grade,
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
    navigate("/auth/otp", { state: { phoneNumber } });
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
