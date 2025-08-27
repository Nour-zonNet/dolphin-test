import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { HomeSupportBtn } from "@/components/layout";
import {
  LoginForm,
  RegisterForm,
  TopHero,
  VerificationForm,
  PasswordForm,
} from "../components";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { COUNTRIES } from "@/constants/countries";
import { STEPS } from "@/constants/STEPS";
import { Navigate } from "react-router-dom";
import { showModal } from "../../../store/modalSlice";
import { MODAL_TYPES } from "../../../constants/MODAL_TYPES";
// -------- Step Enum --------

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈
  const {
    checkPhone,
    verifyOtp,
    registerUser,
    loginUser,
    loading,
    error,
    token,
    user,
  } = useAuth();

  const [step, setStep] = useState(STEPS.PHONE);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  // -------- Handlers --------
  if (token && user) {
    // user already logged in → redirect
    return <Navigate to="/schedule" replace />;
  }

  const handleBack = () => {
    if (step === STEPS.OTP) setStep(STEPS.PHONE);
    else if (step === STEPS.REGISTER) setStep(STEPS.OTP);
    else if (step === STEPS.PASSWORD) setStep(STEPS.PHONE);
  };

  const handlePhoneSubmit = async (data) => {
    const phone_number = `${data.mobile}`;
    setPhoneNumber(phone_number);

    const res = await dispatch(checkPhone({ phone_number }));
    console.log(res.payload.data);

    if (res?.payload?.success) {
      if (res?.payload?.data?.otp_sent) {
        setStep(STEPS.OTP);
      } else {
        setStep(STEPS.PASSWORD);
      }
    }
  };

  const handleOtpSubmit = async (data) => {
    const res = await dispatch(
      verifyOtp({
        phone_number: phoneNumber,
        otp_code: `${data.otp}`,
      })
    );

    if (res?.payload?.success) {
      setStep(STEPS.REGISTER);
    }
  };

  const handleRegisterSubmit = async (data) => {
    console.log(data);
    const res = await dispatch(
      registerUser({
        phoneNumber: phoneNumber,
        name: data.name,
        grade: data.grade,
        pinCode: data.password,
      })
    );
    console.log({
      phoneNumber: phoneNumber,
      name: data.name,
      grade: data.grade,
      pinCode: data.password,
    });
    if (res?.payload?.success) {
      navigate("/schedule");
      dispatch(
        showModal({
          type: MODAL_TYPES.SUCCESS,
          props: {
            title: "تهانينا ",
            message:
              "تم بدء الفترة التجريبية بنجاح لمدة 1 أيام وتم تعيينك في المجموعة الأولى ( تم اختيار مجموعة زوجية لتوافق مع باقتك النشطة باقة مادة الرياضيات في مجموعة 2)",
          },
        })
      );
    }
  };
  const handlePasswordSubmit = async (data) => {
    const res = await dispatch(
      loginUser({
        phoneNumber: phoneNumber,
        pinCode: data.password,
      })
    );

    if (res?.payload?.success) {
      navigate("/schedule"); // يوديه بعد تسجيل الدخول
    }
  };
  return (
    <MainLayout handleBack={handleBack}>
      <div className="flex flex-col lg:flex-row items-center justify-center relative mt-10 px-8 my-auto sm:px-6">
        {step === STEPS.PHONE ? (
          <TopHero text="ادخل لحسابك" />
        ) : step === STEPS.REGISTER ? (
          <TopHero text="أكمال التسجيل " />
        ) : null}

        {/* -------- Step 1: Phone -------- */}
        {step === STEPS.PHONE && (
          <LoginForm
            onSubmit={handlePhoneSubmit}
            loading={loading}
            error={error}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        )}

        {/* -------- Step 2: OTP -------- */}
        {step === STEPS.OTP && <VerificationForm onSubmit={handleOtpSubmit} />}

        {/* -------- Step 3: Register -------- */}
        {step === STEPS.REGISTER && (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            loading={loading}
            error={error}
          />
        )}

        {/* -------- Step 4: Password -------- */}
        {step === STEPS.PASSWORD && (
          <PasswordForm
            onSubmit={handlePasswordSubmit}
            loading={loading}
            phoneNumber={phoneNumber}
          />
        )}
      </div>
      <HomeSupportBtn />
    </MainLayout>
  );
};

export default LoginPage;
