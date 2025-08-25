import { useForm } from "react-hook-form";
import { ArrowNext } from "../../../utils/icons";
import CountrySelector from "./CounterySelector";

const LoginForm = ({ onSubmit, loading, error, selectedCountry, setSelectedCountry }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        flex flex-col gap-4 mx-auto p-4 
        w-full max-w-md sm:max-w-lg md:min-w-[500px] lg:max-w-xl
        border border-bordercolor rounded-[3rem] sm:rounded-[5rem] bg-white
        sm:p-8
      "
    >
      <h2 className="text-xl sm:text-2xl text-[#185A80] font-bold text-center sm:text-right">
        أدخل رقم جوالك
      </h2>

      {/* Phone Input */}
      <div className="flex items-center border rounded-[30px] border-inputbordercolor bg-white overflow-hidden mt-4">
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
      </div>

      <div className="min-h-[24px] mt-2">
        {errors.mobile && (
          <p className="text-red-500 text-sm text-right">{errors.mobile.message}</p>
        )}
        {error && <p className="text-red-500 text-sm text-right">{error}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="
          flex items-center justify-center gap-2 sm:gap-4 
          text-navyteal text-base sm:text-lg font-semibold
          px-4 py-2 sm:px-6 sm:py-3 rounded-2xl sm:rounded-3xl 
          bg-btnClicked cursor-pointer max-w-[314px] mx-auto
          disabled:opacity-50 transition-all
        "
      >
        {loading ? "جاري المعالجة..." : (<><ArrowNext className="w-4 h-4 sm:w-5 sm:h-5" /> متابعة</>)}
      </button>
    </form>
  );
};

export default LoginForm;
