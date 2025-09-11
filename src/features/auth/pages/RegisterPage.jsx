import { useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { RegisterForm } from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";
import { Overlay, Spinner } from "@/components/feedback";
import { fetchAllPackages, fetchMyPackages } from "../../packages/store/packagesSlice";
import { fetchLessons } from "@/features/lessons/store/lessonsSlice";
import { fetchSubscriptions } from "@/features/subscription/store/subscriptionSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser, loading, error, isFullyAuthenticated } = useAuth();
  const { phoneNumber } = location.state || {};

  // If we have a token but no user yet, and we're still loading, show loading state

  // If user is already logged in, redirect to schedule
  if (isFullyAuthenticated()) {
    return <Navigate to="/schedule" replace />;
  }

  // Redirect if no phone number
  // if (!phoneNumber) {
  //   navigate("/auth/phone");
  //   return null;
  // }

  const handleRegisterSubmit = async (data) => {
    const res = await dispatch(
      registerUser({
        phoneNumber: phoneNumber,
        name: data.name,
        grade: data.grade,
        pinCode: data.password,
      })
    );

    if (res?.meta?.requestStatus === "fulfilled") {
      // navigate("/auth/add");
           await Promise.all([
            dispatch(fetchAllPackages()),
            dispatch(fetchMyPackages()),
            dispatch(fetchLessons()),
            dispatch(fetchSubscriptions()),
          ]);
      navigate("/schedule");
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
