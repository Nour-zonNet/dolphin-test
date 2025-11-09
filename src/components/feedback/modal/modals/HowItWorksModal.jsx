import React from "react";
import { ClosePopup } from "@/utils/icons";

const HowItWorksModal = ({ onClose }) => {
  const steps = [
    {
      number: 1,
      text: "انسخ كود الإحالة الخاص بك وشاركه مع أصدقائك",
    },
    {
      number: 2,
      text: "كل صديق يسجل باستخدام كودك تحصل علي رصيد— ولو اشترك في باقة تحصل على رصيد إضافي أكبر.",
    },
    {
      number: 3,
      text: "كل عدد معين من الدعوات يرفع مستواك",
    },
    {
      number: 4,
      text: "لكل مستوى مكافأة خاصة بك",
    },
  ];

  return (
    <div className="relative w-[80%] mx-auto max-w-3xl bg-white rounded-3xl overflow-hidden mx-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-200 rounded-full border border-gray-300 p-2 transition-colors"
          aria-label="Close"
        >
          <ClosePopup className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Title */}
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-black">
          كيف يعمل؟
        </h2>

        {/* Dashed Line */}
        <div className="w-full border-t border-dashed border-gray-300 mt-4"></div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-8 pb-6 md:pb-8">
        <div className="space-y-4 md:space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-3 md:gap-4">
              {/* Orange Circle with Number */}
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-orangedeep flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">
                  {step.number}
                </span>
              </div>
              {/* Step Text */}
              <p className="text-sm md:text-base text-black leading-relaxed flex-1 pt-1">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;

