import { useRef, useState } from "react";

const VerificationInputs = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp.join(""));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-6"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-[32px] font-bold text-status">رمز التحقق</h2>
        <p className="text-[18px] text-subtext mt-6">
          أدخل رمز التحقق المرسل الى جوالك
        </p>

        <div>
            <div className="flex gap-4 mt-[60px]">
            {otp.map((digit, i) => (
                <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-18 h-18 text-center text-lg border-[0.5px] border-[#B3B3B3] bg-verifyinputbg rounded-lg focus:outline-none focus:ring-4 focus:ring-btnClicked focus:border-0"
                />
            ))}
            </div>
            <div className="flex items-start gap-6 mt-8">
            <p className="text-subtext text-[18px]">لم تستلم الرمز؟</p>
            <button
                type="submit"
                className="text-btnClicked text-[20px] underline font-medium"
            >
                إعادة إرسال
            </button>
            </div>
        </div>
      </div>
    </form>
  );
};

export default VerificationInputs;
