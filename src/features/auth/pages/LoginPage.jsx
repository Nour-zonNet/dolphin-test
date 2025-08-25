import { useState } from "react";
import { useForm } from "react-hook-form";
import MainLayout from "../../../components/layout/MainLayout";
import { HomeSupportBtn } from "@/components/layout";
import { LoginForm, RegisterForm, TopHero } from "../components";
import VerificationForm from "../components/VerificationForm";
import { useAuth } from "../hooks/useAuth";
import { countries } from "../components/CounterySelector";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// -------- Step Enum --------
const STEPS = {
  PHONE: 1,
  OTP: 2,
  REGISTER: 3,
  PASSWORD: 4,
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈
  const { checkPhone, verifyOtp, registerUser, loginUser, loading, error } =
    useAuth();

  const [step, setStep] = useState(STEPS.PHONE);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // -------- Handlers --------
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
    console.log(data)
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
      })
    if (res?.payload?.success) {
      navigate("/schedule");
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
    <MainLayout>
      <div className="flex flex-col lg:flex-row items-center justify-between relative px-4 sm:px-6">
        {step === STEPS.PHONE ? (
          <TopHero text="ادخل لحسابك" />
        ) : step === STEPS.REGISTER ? (
          <TopHero text="أكمال التسجيل " />
        ) : step === STEPS.PASSWORD ? (
          <TopHero text="ادخل كلمة المرور" />
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
          <form
            className="w-full max-w-md"
            onSubmit={handleSubmit(handlePasswordSubmit)} // 👈 مهم
          >
            <h2 className="text-xl sm:text-2xl text-[#185A80] font-bold text-center sm:text-right">
              ادخل كلمة المرور
            </h2>
            <div className="relative w-full mt-4">
              <input
                type="password"
                {...register("password", { required: "كلمة المرور مطلوبة" })}
                placeholder="كلمة المرور"
                className="flex-1 outline-0 text-right p-3 sm:p-4 text-base sm:text-lg border rounded-[30px] border-inputbordercolor w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm text-right mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-btnClicked text-white rounded-2xl px-6 py-3 mt-6 w-full"
            >
              دخول
            </button>
          </form>
        )}
      </div>
      <HomeSupportBtn />
    </MainLayout>
  );
};

export default LoginPage;
