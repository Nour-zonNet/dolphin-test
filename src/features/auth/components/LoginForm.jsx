import { useForm, Controller } from "react-hook-form";
import { ArrowNext } from "../../../utils/icons";
import Button from "../../../components/ui/Button";
import { validatePhone } from "../../../utils/phoneValidation";
import MyPhone from "../../../components/ui/PhoneInput/PhoneInput";
import dolphinChild from "@/assets/images/homeChild.png";
import { Book } from "@/utils/Illustrations";
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
    <div className="flex justify-center items-center flex-col lg:flex-row mt-10">
      <div className="flex items-center gap-2 lg:flex:1/4">
        <img
          src={dolphinChild}
          alt="Path"
          className="h-29 sm:h-48 md:h-48 lg:h-135 object-contain mb-4 lg:mb-6"
        />
        <div className="block lg:hidden relative pl-10 ">
          <h1 className="text-xl sm:text-3xl lg:text-[40px] text-center font-bold text-[#1B648E]">
            ادخل لحسابك
          </h1>

          {/* Underline SVG */}
          <div className="mascot pt-3 flex justify-center lg:justify-start">
            <svg
              width="218"
              height="31"
              viewBox="0 0 218 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 sm:w-52 md:w-60 lg:w-72"
            >
              <path
                d="M2.58266 28.3739C59.1646 5.20245 139.615 -3.66695 214.694 8.94163"
                stroke="#E89B32"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>
            <Book className="absolute top-0 left-0  w-14 sm:w-16 md:w-20 lg:w-28" />
        </div>
        {/* Book Illustration */}
      </div>
      <div className="lg:flex3/4 relative flex-grow">
        <div className="hidden lg:block">
          <h1 className="text-xl sm:text-3xl lg:text-[40px] text-center font-bold text-[#1B648E]">
            ادخل لحسابك
          </h1>

          {/* Underline SVG */}
          <div className="mascot pt-3 flex justify-center lg:justify-start">
            <svg
              width="218"
              height="31"
              viewBox="0 0 218 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 sm:w-52 md:w-60 lg:w-72"
            >
              <path
                d="M2.58266 28.3739C59.1646 5.20245 139.615 -3.66695 214.694 8.94163"
                stroke="#E89B32"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mx-auto p-7 sm:p-10  md:p-12 w-full max-w-sm sm:max-w-md border border-graycustom/50 rounded-[2rem] sm:rounded-[3rem] bg-white"
        >
          {/* Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl text-subtext font-bold ">
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
            disabled={!isValid || loading}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
