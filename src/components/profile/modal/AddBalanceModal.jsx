import React, { useState } from "react";
import Divider from "../../ui/Divider";
import { ArrowNext } from "@/utils/icons";
import { Riyal } from "@/utils/Illustrations";

const AddBalanceModal = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      setSuccessMsg(`تم إيداع ${amount} ريال في رصيدك`);
      onSubmit?.({ amount });
      setAmount("");
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
            {/* Title */}
            <div className="w-full text-center">
              <h2 className="font-semibold text-navyteal text-base md:text-[32px]">
                إضافة رصيد
              </h2>
              <div className="text-orangedeep text-sm md:text-2xl font-bold mt-2 flex items-center justify-center gap-2">
                رصيدك الحالي: 
                <div className="flex items-center gap-1">
                  <span>0</span>
                  <Riyal className="w-4 md:w-6 lg:w-8"/>
                </div>
              </div>
            </div>
          </div>
          <Divider />

          <form onSubmit={handleSubmit} className="py-4 md:py-8 space-y-4 md:space-y-8">
            {/* Deposit Amount */}
            <div className="space-y-4">
              <label className="flex items-start justify-between flex-col lg:flex-row font-semibold text-navyteal text-sm md:text-2xl">
                <span className="text-nowrap">قيمة الإيداع</span>
                <span className="text-[12px] md:text-base mt-2">(اشحن  رصيدك الآن واحصل علي 20 % هدية مجانية إضافية)</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ادخل المبلغ المراد إيداعه"
                className="w-full h-10 md:h-18 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[12px] md:text-lg placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors"
                required
              />

              {/* Dynamic total with gift */}
              {amount && (
                  <p className="text-[#1C9C30] font-semibold text-sm md:text-lg">
                    إجمالي رصيدك مع الهدية :{" "}
                    {Number(amount) + Number(amount) * 0.2} ريال
                  </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!amount}
              className="cursor-pointer w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-orangedeep rounded-[60px]"
            >
              <ArrowNext className="w-4 md:w-6" />
              <span className="font-semibold text-navyteal text-base md:text-2xl">
                ادفع الآن
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

export default AddBalanceModal;
