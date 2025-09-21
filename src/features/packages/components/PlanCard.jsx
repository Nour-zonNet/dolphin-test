import React, { useMemo, useRef, useEffect, useState } from "react";
import { packageFactory } from "../factory/packageFactory";
import { Calender1, ChevronDown, ChevronUp } from "@/utils/icons";
import Books from "@/assets/packages/books.svg";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { formatArabicDate } from "@/utils/dateHelpers";

const PlanCard = ({ plan, selected, onSelect, open, onToggle }) => {
  const ToggleIcon = useMemo(
    () =>
      open ? (
        <ChevronUp className="w-3 h-3 text-gray-600 transition-transform" />
      ) : (
        <ChevronDown className="w-3 h-3 text-gray-600 transition-transform" />
      ),
    [open]
  );

  const { image, bgColor } = packageFactory(plan.id);
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
  ];

  // --- For smooth height animation ---
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [open]);

  return (
    <div
      style={{ borderColor: bgColor }}
      className={` rounded-t-2xl  cursor-pointer ${
        open
          ? "border border-gray-400/60 rounded-2xl"
          : "border border-gray-200/40"
      }`}
    >
      {/* Header */}
      <div
        style={{ borderColor: bgColor }}
        className="flex justify-between gap-2 md:gap-4 rounded-t-2xl p-5 bg-[#EAEAEA] items-start"
      >
        {/* Select Plan */}
        <div
          onClick={() => onSelect(plan.id)}
          className={`w-6 h-6 rounded-sm border flex items-center justify-center ${
            selected
              ? "bg-orangedeep text-white"
              : "border-gray-600 text-gray-400"
          }`}
        >
          {selected ? "✓" : ""}
        </div>

        {/* Toggle Expand */}
        <div onClick={onToggle} className="flex items-start gap-3 flex-1">
          <div className="flex-1">
            <div className="flex flex-row justify-between items-center">
              <div className="flex gap-3">
                <div
                  style={{ backgroundColor: bgColor }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-sm flex items-center justify-center text-2xl"
                >
                  <img
                    className="w-6 h-6 md:w-8 md:h-8"
                    src={image}
                    alt={plan.name}
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base self-center">
                  {plan.name}
                </h3>
              </div>
              {ToggleIcon}
            </div>

            <div className="flex justify-between items-center mt-2">
              <div>
                <span className="text-navyteal text-xs px-1 py-1 rounded-full">
                  {plan.durationText}
                </span>
                <span>|</span>
                {plan.trial_days > 0 && (
                  <span className="text-navyteal text-xs px-1 py-1 rounded-full">
                    {plan.trial_days} أيام تجريبية
                  </span>
                )}
              </div>
              <span className="flex items-center gap-2 text-nowrap text-base">
                سعر الباقة :
                <FormatWithCurrency
                  amount={plan.finalPrice}
                  className="text-lg font-bold text-[#BA7C28]"
                  symbolClass="w-5 h-5 text-[#BA7C28]"
                  symbolFill="#BA7C28"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Expanded Content */}
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="pt-4 border-t border-gray-100 p-6 space-y-2">
          {plan.subjects?.length > 0 && (
            <div className="mt-2 flex items-start">
              <span className="text-navyteal font-semibold text-sm block ml-1 mb-1">
                المواد المشمولة :
              </span>
              <div className="flex flex-wrap gap-2">
                {plan.subjects.map((s, i) => {
                  const randomColor = colors[i % colors.length];
                  return (
                    <span
                      key={s.id || i}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${randomColor}`}
                    >
                      {s.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {plan.times?.length > 0 && (
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center space-x-3">
                <Calender1 />
                <span className="text-navyteal text-sm font-semibold">
                  موعد البداية :
                </span>
                <span className="text-gray-800 font-medium text-sm">
                  {formatArabicDate(plan.times[0].start_date)}
                </span>
              </div>
            </div>
          )}

          {plan.weeklyClasses > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#BA7C28] text-sm md:text-lg font-semibold py-1 rounded-full">
                <img src={Books} alt="" />
                <span className="border-l-3 border-[#D9D9D9] pl-2">
                  {plan.weeklyClasses} حصص أسبوعياً
                </span>
                <img src={Books} alt="" />
                <span>{plan.monthlyClasses} حصص شهريا</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlanCard);
