import { useForm } from "react-hook-form";
import { useState } from "react";
import flagSA from "@/assets/authentication/flag.svg";
import caretDown from "@/assets/authentication/caret-down.svg";
import { ArrowNext } from "../../../utils/icons";
import { useAuth } from "../hooks/useAuth";
import VerificationInputs from "./VerificationInputs";

const countries = [
  { name: "السعودية", code: "+966", flag: flagSA },
  { name: "الإمارات", code: "+971", flag: flagSA },
  { name: "الكويت", code: "+965", flag: flagSA },
  { name: "قطر", code: "+974", flag: flagSA },
  { name: "البحرين", code: "+973", flag: flagSA },
  { name: "عُمان", code: "+968", flag: flagSA },
];

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange",
  });
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);

  const { checkPhone, verifyOtp, registerUser, loading, error } = useAuth(); 
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Step 1 → إدخال رقم الجوال
  const handlePhoneSubmit = async (data) => {
    const phone_number = `${data.mobile}`;
    setPhoneNumber(phone_number);
    const res = await checkPhone({ phone_number });
    if (res?.payload?.success) setStep(2);
  };

  // Step 2 → إدخال OTP
  const handleOtpSubmit = async (data) => {
    const res = await verifyOtp({ phone_number: phoneNumber, otp: data.otp });
    if (res?.payload?.success) setStep(3);
  };

  // Step 3 → إدخال بيانات التسجيل
  const handleRegisterSubmit = async (data) => {
    await registerUser({ phone_number: phoneNumber, ...data });
    // ممكن بعد التسجيل تعمل setStep(4) لعرض رسالة نجاح
  };

  return (
    <form
      onSubmit={
        step === 1
          ? handleSubmit(handlePhoneSubmit)
          : step === 2
          ? handleSubmit(handleOtpSubmit)
          : handleSubmit(handleRegisterSubmit)
      }
      className="flex flex-col gap-4 mx-auto min-w-[500px] h-[300px] border border-bordercolor rounded-[60px]"
    >
      {step === 1 && (
        <>
          <h2 className="text-2xl text-[#185A80] font-bold px-8 pt-8">أدخل رقم جوالك</h2>
          <div className="relative w-[80%] ml-16 mr-8 mt-4">
            <div className="flex items-center border rounded-[48px] border-inputbordercolor bg-white overflow-hidden">
              {/* Flag + dropdown */}
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
                  pattern: { value: /^[0-9]{7,12}$/, message: "أدخل رقم جوال صحيح" },
                })}
                placeholder="أدخل رقم جوالك"
                className="flex-1 outline-0 text-right p-4"
              />
            </div>
            <div className="min-h-[24px] mt-2">
              {errors.mobile && <p className="text-red-500 text-sm text-right">{errors.mobile.message}</p>}
              {error && <p className="text-red-500 text-sm text-right">{error}</p>}
            </div>
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
        </>
      )}

      {step === 2 && (
        <>
             <VerificationInputs />
        </>
      )}
      {/* <VerificationPage /> */}

      {step === 3 && (
        <>
          <h2 className="text-2xl text-[#185A80] font-bold px-8 pt-8">أكمل بياناتك</h2>
          <div className="relative w-[80%] ml-16 mr-8 mt-4">
            <input
              type="text"
              {...register("name", { required: "الاسم مطلوب" })}
              placeholder="الاسم الكامل"
              className="flex-1 outline-0 text-right p-4 border rounded-[48px] border-inputbordercolor"
            />
            <div className="min-h-[24px] mt-2">
              {errors.name && <p className="text-red-500 text-sm text-right">{errors.name.message}</p>}
            </div>
          </div>
        </>
      )}

      {/* زرار موحد للخطوات */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="flex items-center justify-center gap-4 text-navyteal text-[18px] font-semibold px-4 py-3 rounded-3xl bg-btnClicked cursor-pointer w-2xs mx-auto disabled:opacity-50"
      >
        {loading ? "جاري المعالجة..." : (
          <>
            <ArrowNext />
            متابعة
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
