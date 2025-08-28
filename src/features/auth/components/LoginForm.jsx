import { useForm } from "react-hook-form";
import { ArrowNext } from "../../../utils/icons";
import CountrySelector from "./CounterySelector";
import Button from "../../../components/ui/Button";
import PhoneInput from "../../../components/ui/PhoneInput/PhoneInput";

const LoginForm = ({
  onSubmit,
  loading,
  error,
  setPhoneNumber

}) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        flex flex-col gap-4 mx-auto p-4 
        w-full max-w-md sm:max-w-lg md:min-w-[500px] lg:max-w-xl
        border border-graycustom rounded-[3rem] sm:rounded-[3rem] bg-white
        sm:p-8
      "
    >
      <h2 className="text-xl sm:text-2xl text-subtext font-bold text-center sm:text-right">
        أدخل رقم جوالك
      </h2>

      {/* Phone Input */}
      {/* <div className="flex items-center border rounded-full border-graycustom bg-white overflow-hidden mt-4 p-2">
        <CountrySelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <input
          type="tel"
          {...register("mobile", {
            required: "رقم الجوال مطلوب",
            pattern: {
              value: /^[0-9]{7,12}$/,
              message: "أدخل رقم جوال صحيح",
            },
          })}
          placeholder="أدخل رقم جوالك"
          className="flex-1 outline-0 text-right px-3 py-3 text-base sm:text-lg"
        />
      </div> */}
          <PhoneInput setNumber={setPhoneNumber}/>

      <div className="min-h-[24px] mt-2">
        {errors.mobile && (
          <p className="text-red-500 text-sm text-right">
            {errors.mobile.message}
          </p>
        )}
        {error && <p className="text-red-500 text-sm text-right">{error}</p>}
      </div>

      {/* Submit */}
        <Button
          type="submit"
          icon={
            loading ? null : <ArrowNext className="w-4 h-4 sm:w-5 sm:h-5" />
          }
          text={loading ? "جاري المعالجة..." : "متابعة"}
          disabled={!isValid || loading}
        />
    </form>
  );
};

export default LoginForm;
