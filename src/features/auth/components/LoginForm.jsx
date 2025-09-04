import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ArrowNext } from "../../../utils/icons";
import Button from "../../../components/ui/Button";
import dolphinChild from "@/assets/images/homeChild.png";
import FormTitle from "./FormTitle";
import PhoneField from "./PhoneField";
import { validatePhone } from "../../../utils/phoneValidation";

const LoginForm = ({ onSubmit, loading, error, setPhoneNumber }) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onBlur", // Only validate on blur (when user finishes typing)
    defaultValues: { mobile: "", countryCode: null },
  });

  // Watch form values for real-time validation
  const mobile = watch("mobile");
  const countryCode = watch("countryCode");

  // Check if phone number is valid
  const isPhoneValid = mobile && validatePhone(mobile, countryCode);

  return (
    <div className="flex justify-center items-center flex-col lg:flex-row mx-auto ">
      {/* Left side image + title (mobile view) */}
      <div className="flex items-center justify-center flex-none gap-2">
        <img
          src={dolphinChild}
          alt="Path"
          className="h-29 sm:h-48 md:h-48 lg:h-135 object-contain  lg:mb-6"
        />
        <FormTitle text={t("auth.loginToAccount")} isMobile />
      </div>

      {/* Right side form */}
      <div className=" relative  ">
        <div className="flex justify-center ">
          <FormTitle text={t("auth.loginToAccount")} />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:min-w-md lg:min-w-lg flex flex-col gap-6 md:gap-8 p-7 sm:p-10 md:p-12 w-full max-w-sm sm:max-w-md border-[0.5px] border-graycustom/40 rounded-[2rem] sm:rounded-[3rem] bg-white"
        >
          {/* Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl text-subtext font-bold">
            {t("auth.enterPhoneNumber")}
          </h2>

          {/* Phone Input */}
          <PhoneField
            control={control}
            setValue={setValue}
            setPhoneNumber={setPhoneNumber}
            errors={errors}
            watch={watch}
            touchedFields={touchedFields}
          />

          {/* Backend Error */}
          {error && (
            <p className="text-red-500 text-xs sm:text-sm text-right">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            icon={
              !loading && (
                <ArrowNext className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              )
            }
            text={loading ? "جاري المعالجة..." : "متابعة"}
            disabled={!isPhoneValid || loading}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
