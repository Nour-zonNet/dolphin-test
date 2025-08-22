import { useForm } from "react-hook-form";
import { useState } from "react";
import flagSA from "@/assets/authentication/flag.svg";
import caretDown from "@/assets/authentication/caret-down.svg";
import { ArrowNext } from "../../../utils/icons";
import { Link } from "react-router-dom";

const countries = [
  { name: "السعودية", flag: flagSA },
  { name: "الإمارات", flag: flagSA },
  { name: "الكويت", flag: flagSA },
  { name: "قطر", flag: flagSA },
  { name: "البحرين", flag: flagSA },
  { name: "عُمان", flag: flagSA },
];

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange",
  });
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);

  const onSubmit = (data) => {
    console.log("Country:", selectedCountry.name, "Number:", data.mobile);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mx-auto min-w-[500px] h-[300px] border border-bordercolor rounded-[60px]"
    >
      <h2 className="text-2xl text-[#185A80] font-bold px-8 pt-8">أدخل رقم جوالك</h2>

      {/* Input with flag + dropdown */}
      <div className="relative w-[80%] ml-16 mr-8 mt-4">
        <div className="flex items-center border rounded-[48px] border-inputbordercolor bg-white overflow-hidden">
          {/* Flag + dropdown button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 px-3 py-3 border-r cursor-pointer"
          >
            <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-6 h-6" />
            <img src={caretDown} alt="" />
          </button>

          {/* Phone input */}
          <input
            type="tel"
            {...register("mobile", {
              required: "رقم الجوال مطلوب",
              pattern: {
                value: /^[0-9]{7,12}$/,
                message: "أدخل رقم جوال صحيح"
              }
            })}
            placeholder="أدخل رقم جوالك"
            className="flex-1 outline-0 text-right p-4"
          />
          
        </div>
        {/* Error Message */}
        <div className="min-h-[24px] mt-2">
          {errors.mobile && (
            <p className="text-red-500 text-sm text-right">{errors.mobile.message}</p>
          )}
        </div>
        {/* Dropdown menu */}
        {open && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
            {countries.map((c) => (
              <div
                key={c.name}
                onClick={() => {
                  setSelectedCountry(c);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <img src={c.flag} alt={c.name} className="w-5 h-5" />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {isValid ? (
        <Link
          to="/verification"
          type="submit"
          className="flex items-center justify-center gap-4 text-navyteal text-[18px] font-semibold px-4 py-3 rounded-3xl bg-btnClicked cursor-pointer w-2xs mx-auto"
        >
          <ArrowNext />
          متابعة
        </Link>

      ) : (
        <button
          type="submit"
          className="flex items-center justify-center gap-4 text-navyteal text-[18px] font-semibold px-4 py-3 rounded-3xl bg-btnClicked cursor-pointer w-2xs mx-auto"
        >
          <ArrowNext />
          متابعة
        </button>
      )}
    </form>
  );
};

export default LoginForm;
