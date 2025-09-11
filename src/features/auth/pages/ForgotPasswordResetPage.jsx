import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import OTPInput from "../../../components/ui/InputOtp";
import { Button } from "../../../components";
import { useAuth } from "../hooks/useAuth";

const ForgotPasswordResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openStatusModal } = useModal();
  const { phoneNumber } = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword } = useAuth();
  if (!phoneNumber) {
    navigate("/auth/forgetpassword", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      openStatusModal(MODAL_TYPES.WARNING, {
        title: "تأكيد غير متطابق",
        message: "الرقم السري وتأكيده غير متطابقين.",
      });
      return;
    }
    try {
      await resetPassword({
        pinCode: password,
      }).unwrap();
      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم التغيير",
        message: "تم تغيير الرقم السري بنجاح.",
        onClose: (window.location.href = "/schedule"),
      });
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "تعذر تغيير الرقم السري. حاول مرة أخرى.";
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "فشل العملية",
        message,
      });
    }
  };

  const handleBack = () =>
    navigate("/auth/forgetpassword/otp", { state: { phoneNumber } });

  return (
    <AuthLayout handleBack={handleBack}>
      <form
        dir="ltr"
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto p-6 flex justify-center flex-col bg-white rounded-xl space-y-6"
      >
        <h1 className="text-xl font-bold text-status text-center">
          انشاء كلمة مرور جديدة
        </h1>
        <label className="block text-sm text-center text-status">
          يجب ان تكون كلمة المرور مختلفة عن السابقة
        </label>
        <div className="space-y-2">
          <OTPInput length={6} type="password" onChange={setPassword} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-center text-status">
            تأكيد كلمة المرور
          </label>
          <OTPInput length={6} type="password" onChange={setConfirmPassword} />
        </div>
        <Button text={"تاكيد التغير"} />
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordResetPage;
