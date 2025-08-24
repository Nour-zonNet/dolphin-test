import { useRef } from "react";

const VerificationInputs = ({ value = "", onChange, error }) => {
  const inputsRef = useRef([]);

  const otpArray = value.split("").concat(Array(6 - value.length).fill(""));

  const handleChange = (val, index) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...otpArray];
    newOtp[index] = val;
    const joined = newOtp.join("").trim();
    onChange(joined);

    // move to next input
    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-[32px] font-bold text-status">رمز التحقق</h2>
      <p className="text-[18px] text-subtext mt-6">
        أدخل رمز التحقق المرسل الى جوالك
      </p>

      <div>
        <div className="flex gap-4 mt-[60px]">
          {otpArray.map((digit, i) => (
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

        {error && (
          <p className="text-red-500 text-sm text-right mt-2">{error}</p>
        )}

        <div className="flex items-start gap-6 mt-8">
          <p className="text-subtext text-[18px]">لم تستلم الرمز؟</p>
          <button
            type="button"
            className="text-btnClicked text-[20px] underline font-medium"
          >
            إعادة إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationInputs;
