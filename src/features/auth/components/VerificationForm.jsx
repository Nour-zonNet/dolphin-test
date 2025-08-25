import { useRef, useState, useEffect } from "react";

const VerificationForm = ({ onSubmit }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);

  // ⏱ العد التنازلي
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // 🔢 عند الكتابة
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.join("").length === otp.length && !newOtp.includes("")) {
      handleSubmit(newOtp.join(""));
    }
  };

  // ⬅️ Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // 📋 Paste
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, otp.length);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      newOtp.forEach((digit, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = digit;
        }
      });

      if (newOtp.length === otp.length) {
        handleSubmit(newOtp.join(""));
      }
    }
  };

  // ✅ Submit OTP
  const handleSubmit = (code) => {
    if (onSubmit) {
      onSubmit({ otp: code }); // نبعته لـ LoginPage
    }
  };

  return (
    <form
    dir="ltr"
      onPaste={handlePaste}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(otp.join(""));
      }}
      className="flex flex-col flex-grow justify-center items-center gap-6 w-full px-4 sm:px-6 md:px-8"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-status text-center">
        رمز التحقق
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-subtext text-center max-w-md">
        أدخل رمز التحقق المرسل إلى جوالك
      </p>

      {/* OTP Inputs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                       text-center text-base sm:text-lg md:text-xl lg:text-2xl font-semibold
                       border border-[#B3B3B3] bg-verifyinputbg rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-btnClicked"
          />
        ))}
      </div>

      {/* Resend Code */}
      <div className="flex w-full justify-between sm:justify-center sm:gap-6 gap-2 mt-6 flex-wrap">
        <p className="text-sm sm:text-base text-subtext">لم تستلم الرمز؟</p>
        <button
          type="button"
          disabled={timer > 0}
          onClick={() => setTimer(60)}
          className={`text-btnClicked text-sm sm:text-base md:text-lg underline font-medium ${
            timer > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {timer > 0 ? `أعد الإرسال بعد ${timer}ث` : "إعادة إرسال"}
        </button>
      </div>

      {/* Confirm Button */}
      <button
        type="submit"
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-btnClicked text-white py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold shadow-md hover:opacity-90 transition"
      >
        تأكيد
      </button>
    </form>
  );
};

export default VerificationForm;
