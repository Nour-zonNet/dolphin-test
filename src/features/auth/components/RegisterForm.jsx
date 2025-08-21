import { useForm } from "react-hook-form";
import { Lock } from "../../../utils/icons";
import OtpInput from "react-otp-input";
import { useState } from "react";
const RegisterForm = () => {
  const [otp, setOtp] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const password = watch("password");
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full max-w-lg mx-auto bg-white p-6 rounded-2xl "
    >
      {/* الاسم الكامل */}
      <div className="flex flex-col gap-2">
        <label className="text-right text-[#144B6B] font-semibold text-2xl">
          الاسم الكامل
        </label>
        <input
          type="text"
          placeholder="اكتب اسمك الكامل"
          {...register("fullName", { required: "الاسم مطلوب" })}
          className="border rounded-full border-graycustom px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
        />
        {errors.fullName && (
          <p className="text-[#BA7C28] font-semibold pr-3 text-sm">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* الصف الدراسي */}
      <div className="flex flex-col gap-2">
        <label className="text-right font-semibold text-2xl text-[#144B6B]">
          الصف الدراسي
        </label>
        <select
          {...register("grade", { required: "الصف الدراسي مطلوب" })}
          className="border rounded-full border-graycustom px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
        >
          <option value="">اختر الصف الدراسي</option>
          <option value="1">الصف الأول</option>
          <option value="2">الصف الثاني</option>
          <option value="3">الصف الثالث</option>
        </select>
        {errors.grade && (
          <p className="text-[#BA7C28] font-semibold pr-3 text-sm">
            {errors.grade.message}
          </p>
        )}
      </div>

      {/* كلمة المرور */}
      <div className="flex flex-col gap-2">
        <label className="text-right font-semibold text-2xl text-[#144B6B]">
          كلمة المرور
        </label>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          containerStyle="w-full flex  text-black items-stretch justify-between "
          renderInput={(props) => <input {...props} />}
          inputStyle="py-5 bg-[#FDF5EB] text-black aspect-square px-8 rounded-md border  text-black border-gray-300 text-center text-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          placeholder="أدخل كلمة مرور من 6 أرقام"
          {...register("password", {
            required: "كلمة المرور مطلوبة",
            minLength: { value: 6, message: "كلمة المرور يجب أن تكون 6 أرقام" },
          })}
          className="border   rounded-full  border-graycustom px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
        />
        {errors.password && (
          <p className="text-[#BA7C28] font-semibold pr-2  text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* تأكيد كلمة المرور */}
      <div className="flex flex-col gap-2">
        <label className="text-right font-semibold text-2xl text-[#144B6B]">
          تأكيد كلمة المرور
        </label>
        <input
          type="password"
          placeholder="أعد كتابة كلمة المرور"
          {...register("confirmPassword", {
            required: "تأكيد كلمة المرور مطلوب",
            validate: (value) =>
              value === password || "كلمة المرور غير متطابقة",
          })}
          className="border rounded-full border-graycustom px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
        />
        {errors.confirmPassword && (
          <p className="text-[#BA7C28] font-semibold pr-3 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* كود الدعوة */}
      <div className="flex flex-col gap-2">
        <label className="text-right font-semibold text-2xl text-[#144B6B]">
          كود الدعوة أو الخصم (اختياري)
        </label>
        <input
          type="text"
          placeholder="أدخل كود الدعوة أو الخصم إن وجد"
          {...register("inviteCode")}
          className="border rounded-full border-graycustom px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
        />
      </div>

      {/* زر التسجيل */}
      <button
        type="submit"
        className="bg-orangedeep text-navyteal font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:bg-yellow-600 transition"
      >
        <Lock size={18} />
        إكمال التسجيل
      </button>
    </form>
  );
};

export default RegisterForm;
