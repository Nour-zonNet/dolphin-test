import { useForm, Controller } from "react-hook-form";
import { ArrowNext } from "../../../utils/icons";
import Button from "../../../components/ui/Button";
import { validatePhone } from "../../../utils/phoneValidation";
import MyPhone from "../../../components/ui/PhoneInput/PhoneInput";

const LoginForm = ({ onSubmit, loading, error, setPhoneNumber }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: { mobile: "", countryCode: null },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mx-auto p-3 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md border border-graycustom/50 rounded-[2rem] sm:rounded-[3rem] bg-white"
    >
      {/* Title */}
      <h2 className="text-lg sm:text-xl md:text-2xl text-subtext font-bold text-center sm:text-right">
        أدخل رقم جوالك
      </h2>

      {/* Phone Input */}
      <Controller
        name="mobile"
        control={control}
        rules={{
          required: "رقم الهاتف مطلوب",
          validate: (value, { countryCode }) =>
            validatePhone(value, countryCode) || "رقم الهاتف غير صالح",
        }}
        render={({ field: { onChange, value } }) => (
          <MyPhone
            value={value}
            onChange={(phone, countryCode) => {
              onChange(phone);
              setPhoneNumber(phone);
              // save country code separately if needed
              control._formValues.countryCode = countryCode;
            }}
          />
        )}
      />

      {/* Errors */}
      {errors.mobile && (
        <p className="text-red-500 text-xs sm:text-sm text-right">
          {errors.mobile.message}
        </p>
      )}
      {error && (
        <p className="text-red-500 text-xs sm:text-sm text-right">{error}</p>
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
        disabled={!isValid || loading}
      />
    </form>
  );
};

export default LoginForm;
