import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import MainLayout from "../../../components/layout/MainLayout";
import { HomeSupportBtn } from "@/components/layout";
import { LoginForm, RegisterForm, TopHero } from "../components";
import VerificationForm from "../components/VerificationForm";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { COUNTRIES } from "../../../constants/countries";
import OTPInput from "../../../components/ui/InputOtp";
import Button from "../../../components/ui/Button";
import { Lock } from "../../../utils/icons";
import { STEPS } from "../../../constants/STEPS";

// -------- Step Enum --------

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈
  const { checkPhone, verifyOtp, registerUser, loginUser, loading, error } =
    useAuth();

  const [step, setStep] = useState(STEPS.PHONE);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  const { control, handleSubmit } = useForm({ mode: "onChange" });

  // -------- Handlers --------

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
          <form
            className="w-full max-w-lg my-auto  space-y-10 mt-20"
            onSubmit={handleSubmit(handlePasswordSubmit)} // 👈 مهم
          >
            <div className="flex  flex-col items-center justify-center">
              <h2 className=" mb-4 text-3xl sm:text-2xl text-status font-bold text-center sm:text-right">
                ادخل لحسابك
              </h2>
              <p className="text-subtext text-lg">ادخل الرمز السرى للدخول</p>
              <p className="text-orangedeep text-lg">
                {phoneNumber && phoneNumber}
              </p>
            </div>
            <div className="relative w-full " dir="ltr">
              <Controller
                name="password"
                control={control}
                rules={{ required: "كلمة المرور مطلوبة" }}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col items-center">
                    <OTPInput
                      length={6}
                      type="password"
                      value={field.value || ""}
                      onChange={field.onChange} // يربط الكمبوننت بالـ form
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm text-right mt-2 w-full">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Button icon={<Lock />} text={"اكمال التسجيل "} />
          </form>
        )}
      </div>
      <HomeSupportBtn />
    </MainLayout>
  );
};

export default LoginPage;
