import { useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
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
      // navigate("/auth/add");
    
      navigate("/main-packages");
      return;
    }

    const payload = res?.payload;
    const errorMsg =
      (typeof payload === "string" && payload) ||
      payload?.error ||
      res?.error?.message ||
      "حدث خطأ أثناء التسجيل";

    dispatch(
      showModal({
        type: MODAL_TYPES.WARNING,
        props: {
          title: "هنالك خطاء ",
          message: String(errorMsg),
        },
      })
    );
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
