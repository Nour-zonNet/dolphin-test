import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import OTPInput from "../../../components/ui/InputOtp";
import { useAuth } from "../hooks/useAuth";
import api from "@/services/api";
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";

const ForgotPasswordOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { openStatusModal } = useModal();
  const { phoneNumber, otpJustSent, error: navError } = location.state || {};
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // seconds
  const intervalRef = useRef(null);
  const { sendOtpResetPassword, verifyOtpResetPassword } = useAuth();
  useEffect(() => {
    if (!phoneNumber) {
      navigate("/auth/phone", { replace: true });
    }
  }, [phoneNumber, navigate]);
  const startResendTimer = () => {
    setResendTimer(60);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!phoneNumber) return;
    // Start timer only if we arrive from a path that already sent OTP
    if (otpJustSent) {
      startResendTimer();
    } else {
      // allow immediate resend if not just sent
      setResendTimer(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phoneNumber, otpJustSent]);

  // Handle error passed via navigation state
  useEffect(() => {
    if (!navError) return;
    const message =
      typeof navError === "string"
        ? navError
        : navError?.message || "حدث خطأ. حاول مرة أخرى.";
    openStatusModal(MODAL_TYPES.ERROR, {
      title: "تعذر المتابعة",
      message,
    });
  }, [navError, openStatusModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || otp.length !== 6 || isVerifying) return;
    try {
      const res = await verifyOtpResetPassword({
        phone_number: phoneNumber,
        otp_code: otp,
      }).unwrap();
      // Extract token from response and persist
      console.log(res)
      const token = res?.data?.token || res?.token;
      if (token) {
        dispatch(setToken(token));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم التحقق",
        message: "تم التحقق من رمز التحقق بنجاح.",
        onClose: () =>
          navigate("/auth/forgetpassword/reset", { state: { phoneNumber } }),
      });
    } catch (error) {
      const getErrorMessage = (err) => {
        if (!err) return "حدث خطأ أثناء التحقق من الرمز. حاول مرة أخرى.";
        if (typeof err === "string") return err;
        if (Array.isArray(err)) return err[0];
        if (err && typeof err === "object") {
          if (err.data?.error) return err.data.error;
          if (err.message) return err.message;
        }
        return "حدث خطأ أثناء التحقق من الرمز. حاول مرة أخرى.";
      };

      openStatusModal(MODAL_TYPES.ERROR, {
        title: "فشل التحقق",
        message: getErrorMessage(error),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () =>
    navigate("/auth/password", { state: { phoneNumber } });

  const canSubmit = useMemo(
    () => otp && otp.length === 6 && !isVerifying,
    [otp, isVerifying]
  );
  const canResend = useMemo(
    () => resendTimer === 0 && !isSending,
    [resendTimer, isSending]
  );

  const handleResend = async () => {
    if (!phoneNumber || !canResend) return;
    try {
      setIsSending(true);
      await sendOtpResetPassword({ phone_number: phoneNumber }).unwrap();
      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم الإرسال مجدداً",
        message: "تم إرسال رمز تحقق جديد إلى رقم هاتفك.",
      });
      setResendTimer(60);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "فشل الإرسال",
        message: "تعذر إعادة إرسال الرمز. حاول مرة أخرى.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (value) => {
    const sanitized = String(value || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    setOtp(sanitized);
  };

  if (!phoneNumber) return null;

  return (
    <AuthLayout handleBack={handleBack}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto p-6 bg-white rounded-xl space-y-6"
      >
        <h1 className="text-xl text-status font-bold text-center">
          رمز التحقق
        </h1>
        <div className="space-y-2">
          <label className="block text-sm text-status text-center">
            ادخل رمز التحقق المرسل الى جوالك
          </label>

          <div className="mt-10" dir="ltr">
            <OTPInput length={6} onChange={handleOtpChange} />
          </div>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full px-4 py-2 rounded-md transition-colors text-white ${
            canSubmit
              ? "bg-orangedeep hover:bg-orange-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isVerifying ? "جارِ التحقق..." : "تحقق"}
        </button>
        <div className="flex items-center justify-center gap-2 text-sm mt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`underline ${
              canResend ? "text-orangedeep" : "text-gray-400 cursor-not-allowed"
            }`}
          >
            إعادة إرسال الرمز
          </button>
          {!canResend && (
            <span className="text-gray-500">({resendTimer}s)</span>
          )}
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordOtpPage;
