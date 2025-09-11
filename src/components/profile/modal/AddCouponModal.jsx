import React, { useState } from "react";
import Divider from "../../ui/Divider";
import { ConfirmCheck } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";

const AddCouponModal = ({ isOpen, onClose, onSubmit }) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Example validation
  const validateCoupon = (code) => {
    if (!code) {
      setIsValid(false);
      setError("");
      return;
    }
    if (code === "EXPIRED123") {
      setIsValid(false);
      setError("هذا الكوبون منتهي الصلاحية");
    } else if (code === "VALID100") {
      setIsValid(true);
      setError("");
      setCouponValue("100");
    } else {
      setIsValid(false);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      setSuccessMsg("تم اضافة 100 ريال إلى رصيدك");
      onSubmit?.({ couponCode, couponValue });
      setCouponCode("");
      setCouponValue("");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] w-[95%] md:w-[60%] my-auto">
        <div className="w-[90%] mx-auto">
          {/* Header */}
          <div className="relative flex items-center justify-between py-2 md:py-8">
            <button
              onClick={onClose}
              className="absolute right-0 w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
            >
              <img
                className="w-6 md:w-auto"
                alt="Close"
                src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
              />
            </button>
            <div className="w-full text-center">
              <h2 className="font-semibold text-navyteal text-base md:text-[32px]">
                إضافة رصيد بكوبون
              </h2>
              <div className="text-orangedeep text-sm md:text-2xl font-bold mt-2 flex items-center justify-center gap-2">
                رصيدك الحالي: 
                <div className="flex items-center gap-1">
                  <FormatWithCurrency
                      amount={0}
                      fractionDigits={0}
                      className="flex items-center gap-2"
                      symbolFill="#e89b32" 
                      symbolClass="w-4 md:w-6 lg:w-8"
                    />
                </div>
              </div>
            </div>
          </div>
          <Divider />

          <form onSubmit={handleSubmit} className="py-4 md:py-8 space-y-4 md:space-y-8">
            {/* Coupon Code */}
            <div className="space-y-4 relative">
              <label className="block font-semibold text-navyteal text-sm md:text-2xl">
                كود الكوبون
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  validateCoupon(e.target.value);
                }}
                placeholder="ادخل كود الكوبون"
                className={`w-full h-10 md:h-18 rounded-[100px] border-[0.5px] text-[12px] md:text-lg placeholder:text-[#5d5f62] focus:outline-none transition-colors px-6
                  ${
                    error
                      ? "border-[#B3261E]"
                      : isValid
                      ? "border-[#27C840]"
                      : "border-[#3c3c4366]"
                  }`}
                required
              />
              {/* Check Icon inside input when valid */}
              {/* {isValid && (
                // <GreenCheck className="absolute left-12 top-1/2" />
              )} */}
              {/* Error message */}
              {error && (
                <p className="text-[#B3261E] text-sm md:text-lg flex justify-end">
                  {error}
                </p>
              )}
            </div>

            {/* Coupon Value */}
            <div className="space-y-4">
              <label className="block font-semibold text-navyteal text-sm md:text-2xl">
                قيمة الكوبون
              </label>
              <input
                type="text"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                placeholder="00000"
                className="w-full h-10 md:h-18 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[12px] md:text-lg placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid}
              className="cursor-pointer w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors disabled:cursor-not-allowed"
            >
              <ConfirmCheck className="w-4 md:w-6" />
              <span className="font-semibold text-navyteal text-base md:text-2xl">
                تأكيد الإضافة
              </span>
            </button>

            {/* Success message */}
            {successMsg && (
              <p className="text-[#1C9C30] text-center font-semibold text-lg md:text-2xl mt-2">
                {successMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCouponModal;
