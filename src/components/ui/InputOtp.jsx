import React, { useRef, useState } from "react";

const OTPInput = ({ length = 6, type = "text", onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleInput = (e, i) => {
    const char = e.target.value.slice(-1); // only keep last char
    const newOtp = [...otp];
    newOtp[i] = char;
    setOtp(newOtp);

    // Call parent with full OTP string
    onChange && onChange(newOtp.join(""));

    if (char && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const newOtp = [...otp];
        newOtp[i] = "";
        setOtp(newOtp);
        onChange && onChange(newOtp.join(""));
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        const newOtp = [...otp];
        newOtp[i - 1] = "";
        setOtp(newOtp);
        onChange && onChange(newOtp.join(""));
      }
      e.preventDefault();
    }
  };

  const handlePaste = (e, i) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length);
    const chars = [...pasted];
    const newOtp = [...otp];

    for (let k = 0; k < chars.length && i + k < length; k++) {
      newOtp[i + k] = chars[k];
    }

    setOtp(newOtp);
    onChange && onChange(newOtp.join(""));

    const lastIndex = Math.min(i + chars.length - 1, length - 1);
    inputsRef.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-4 items-center justify-between w-full">
      {otp.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type={type} // 👈 either text or password
          value={val}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          onFocus={(e) => e.target.select()}
                className=" aspect-square   w-full 
                       text-center  text-base sm:text-lg md:text-xl lg:text-2xl font-semibold
                       border border-[#B3B3B3]/50 bg-verifyinputbg rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-btnClicked"
        />
      ))}
    </div>
  );
};
// w-18 h-18 sm:w-20 md:w-22
export default OTPInput;
