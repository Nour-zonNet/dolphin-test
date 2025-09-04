import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import OTPInput from "../../../components/ui/InputOtp";

const ForgotPasswordOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openStatusModal } = useModal();
  const { phoneNumber } = location.state || {};
  const [otp, setOtp] = useState("");

  if (!phoneNumber) {
    navigate("/auth/forgetpassword", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: verify OTP via API
    openStatusModal(MODAL_TYPES.SUCCESS, {
      title: "تم التحقق",
      message: "تم التحقق من رمز التحقق بنجاح.",
      onClose: () =>
        navigate("/auth/forgetpassword/reset", { state: { phoneNumber } }),
    });
  };

  const handleBack = () =>
    navigate("/auth/forgetpassword", { state: { phoneNumber } });

  return (
    <AuthLayout handleBack={handleBack}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm space-y-6"
      >
        <h1 className="text-xl font-bold text-center">أدخل رمز التحقق</h1>
        <div className="space-y-2">
          <label className="block text-sm text-gray-700">
            رمز التحقق (OTP)
          </label>

<div dir="ltr">

          <OTPInput  length={6}    va onChange={setOtp}/>
</div>
          {/* <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="أدخل الرمز"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200"
            required
          /> */}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-orangedeep text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          تحقق
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordOtpPage;
