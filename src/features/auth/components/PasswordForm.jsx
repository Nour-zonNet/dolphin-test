import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import OTPInput from "@/components/ui/InputOtp";
import Button from "@/components/ui/Button";
import { Lock } from "@/utils/icons";
import { Link } from "react-router-dom";

const PasswordForm = ({ onSubmit, loading, phoneNumber }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({ mode: "onChange" });

  return (
    <form
      className="w-full max-w-lg my-auto mx-auto mt-20"
      onSubmit={handleSubmit(onSubmit)} // 👈 مهم
    >
      {/* ---- Header ---- */}
      <div className="flex flex-col items-center justify-center mb-10">
        <h2 className="mb-2 text-2xl sm:text-2xl text-status font-bold text-center sm:text-right">
          {t('auth.loginToAccount')}
        </h2>
        <p className="text-subtext text-lg">{t('auth.enterPassword')}</p>
        <p className="text-orangedeep font-extrabold text-lg">{phoneNumber && phoneNumber}</p>
      </div>

      {/* ---- Password OTP Input ---- */}
      <div className="relative w-full mb-10 " dir="ltr">
        <Controller
          name="password"
          control={control}
          rules={{ required: t('auth.passwordRequired') }}
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

      {/* ---- Submit Button ---- */}
      <Button
        icon={<Lock />}
        text={loading ? t('auth.loggingIn') : t('auth.completingRegistration')}
      />
      <Link to={"/auth/forgetpassword"} className="underline block text-orangedeep text-center mt-6  md:mt-8">نسيت الرقم السرى؟</Link>
    </form>
  );
};

export default PasswordForm;
