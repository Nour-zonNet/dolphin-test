import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

const ForgotPasswordPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const { openStatusModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: integrate real API to issue reset / OTP flow
    openStatusModal(MODAL_TYPES.SUCCESS, {
      title: "تم إرسال التعليمات",
      message: "تم إرسال رمز التحقق إلى رقم هاتفك إن كان مسجلاً.",
      onClose: () => navigate("/auth/forgetpassword/otp", { state: { phoneNumber } })
    });
  };

  return (
    <AuthLayout handleBack={() => window.history.back()}>
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm space-y-6">
        <h1 className="text-xl font-bold text-center">استعادة الرقم السري</h1>
        <div className="space-y-2">
          <label className="block text-sm text-gray-700">رقم الجوال</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="05xxxxxxxx"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-orangedeep text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          إرسال التعليمات
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;


