import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Lock } from "../../../utils/icons";
import OTPInput from "../../../components/ui/InputOtp";
import dolphinChild from "@/assets/images/homeChild.png";
import FormTitle from "./FormTitle";

const RegisterForm = ({ onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  return (
    <div className="flex justify-center items-center lg:justify-center lg:space-x-10  lg:items-stretch flex-col lg:flex-row mx-auto">
      {/* Left side image + title (mobile view) */}
      <div className="flex items-center lg:items-stretch justify-center gap-2">
        <img
          src={dolphinChild}
          alt="Path"
          className="h-29 sm:h-48 md:h-48 lg:h-135 object-contain  lg:mb-6"
        />
        <FormTitle text={t('auth.loginToAccount')} isMobile />
      </div>

      {/* Right side form */}
      <div className=" relative w-full flex  justify-center items-center lg:items-stretch lg:justify-start  flex-col  mx-auto">
        <div className="flex">

          <FormTitle text={t('auth.loginToAccount')} />
        </div>

        <form
     
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full max-w-lg rounded-2xl"
        >
          {/* الاسم الكامل */}
          <div className="flex flex-col gap-2">
            <label className="text-[#144B6B] font-semibold text-base sm:text-base md:text-2xl">
              {t('auth.fullName')}
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: t('auth.fullNameRequired') }}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder={t('auth.fullNamePlaceholder')}
                  {...field}
                  className="placeholder:text-base placeholder:sm:text-base placeholder:md:text-2xl border placeholder:text-bordercolor rounded-full border-graycustom/50 px-4 py-2 md:py-4"
                />
              )}
            />
            {errors.name && (
              <p className="text-[#BA7C28] font-semibold text-sm pr-3">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* الصف الدراسي */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-base sm:text-base md:text-2xl text-[#144B6B]">
              {t('auth.grade')}
            </label>
            <Controller
              name="grade"
              control={control}
              rules={{ required: t('auth.gradeRequired') }}
              render={({ field }) => (
                <select
                  {...field}
                  className="border rounded-full placeholder:text-bordercolor text-graycustom border-graycustom/50 px-4 py-2 md:py-4"
                >
                  <option value="">{t('auth.selectGrade')}</option>
                  <option value="1">{t('auth.grade1')}</option>
                  <option value="2">{t('auth.grade2')}</option>
                  <option value="3">{t('auth.grade3')}</option>
                </select>
              )}
            />
            {errors.grade && (
              <p className="text-[#BA7C28] font-semibold text-sm pr-3">
                {errors.grade.message}
              </p>
            )}
          </div>

          {/* كلمة المرور */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-base sm:text-base md:text-2xl text-[#144B6B]">
              {t('auth.password')}
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: t('auth.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('auth.password6Digits'),
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: t('auth.passwordNumbersOnly'),
                },
              }}
              render={({ field }) => (
                <OTPInput
                  length={6}
                  type="password"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.password && (
              <p className="text-[#BA7C28] font-semibold text-sm pr-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-base sm:text-base md:text-2xl text-[#144B6B]">
              {t('auth.confirmPassword')}
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: t('auth.confirmPasswordRequired'),
                validate: (value) =>
                  value === password || t('auth.passwordsNotMatch'),
              }}
              render={({ field }) => (
                <OTPInput
                  length={6}
                  type="password"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-[#BA7C28] font-semibold text-sm pr-3">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* كود الدعوة */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-base sm:text-base md:text-2xl text-[#144B6B]">
              {t('auth.inviteCode')}
            </label>
            <Controller
              name="inviteCode"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder={t('auth.inviteCodePlaceholder')}
                  {...field}
                  className="border rounded-full border-graycustom/50 px-4 py-2 md:py-4"
                />
              )}
            />
          </div>

          {/* زر التسجيل */}
          <div className="flex items-center justify-center ">
            <button
              type="submit"
              disabled={loading}
              className="bg-orangedeep text-navyteal font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 hover:bg-yellow-600 transition"
            >
              <Lock size={18} />
              {loading ? t('auth.registering') : t('auth.completeRegistration')}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
