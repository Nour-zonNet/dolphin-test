// ✅ VerificationForm.js
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import OTPInput from "../../../components/ui/InputOtp";

const VerificationForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  // ⏱ العد التنازلي
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // ✅ Submit OTP
  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit?.({ otp });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
         className="w-full max-w-lg my-auto mx-auto  space-y-10 mt-20"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-status text-center mx-auto">
        {t('auth.verificationCode')}
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-subtext text-center max-w-md mx-auto">
        {t('auth.enterVerificationCode')}
      </p>

      {/* 👇 استخدام OTPInput */}
      <OTPInput length={6} type="text" onChange={setOtp} />

      {/* Resend Code */}
      <div dir="rtl" className="flex w-full justify-between sm:justify-between sm:gap-6 gap-2 mt-6 flex-wrap">
        <p className="text-sm sm:text-base text-subtext">{t('auth.didntReceiveCode')}</p>
        <button
          type="button"
          disabled={timer > 0}
          onClick={() => setTimer(60)}
          className={`text-btnClicked text-sm sm:text-base md:text-lg underline font-medium ${
            timer > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {timer > 0 ? `${t('auth.resendAfter')} ${timer}${t('auth.seconds')}` : t('auth.resendCode')}
        </button> 
      </div>

      {/* Confirm Button */}
      <button
        type="submit"
        disabled={otp.length < 6}
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-btnClicked text-white py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold shadow-md hover:opacity-90 transition"
      >
        {t('auth.confirm')}
      </button>
    </form>
  );
};

export default VerificationForm;
