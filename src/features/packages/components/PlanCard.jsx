// PlanCard.jsx

import React, { useMemo, useRef, useLayoutEffect, useState } from "react";
import { packageFactory } from "../factory/packageFactory";
import { Calender1 } from "@/utils/icons";
import Books from "@/assets/packages/books.svg";
import { ChevronDown, ChevronUp } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { formatArabicDate } from "@/utils/dateHelpers";

const PlanCard = ({ plan, selected, onSelect, isOpen, onToggle }) => {
  const { image, bgColor } = packageFactory(plan.id);
  const contentRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  // measure height whenever open state or content changes
  useLayoutEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      // set to scrollHeight for smooth open
      setMaxH(contentRef.current.scrollHeight);
      // re-measure on images/icons load if needed
      const r = new ResizeObserver(() => {
        if (isOpen && contentRef.current)
          setMaxH(contentRef.current.scrollHeight);
      });
      r.observe(contentRef.current);
      return () => r.disconnect();
    } else {
      setMaxH(0);
    }
  }, [isOpen, plan]);

  const ToggleIcon = useMemo(
    () =>
      isOpen ? (
        <ChevronUp className="w-3 h-3 text-gray-600 transition-transform" />
      ) : (
        <ChevronDown className="w-3 h-3 text-gray-600 transition-transform" />
      ),
    [isOpen]
  );

  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
  ];

  return (
    <div
      className={`rounded-2xl cursor-pointer border ${
        isOpen ? "border-gray-300" : "border-0"
      }`}
    >
      {/* Header */}
      <div
        style={{ borderColor: bgColor }}
        className="flex justify-between gap-2 md:gap-4 rounded-t-2xl p-5 bg-[#EAEAEA] items-start"
      >
        <div
          onClick={() => onSelect(plan.id)}
          className={`w-6 h-6 rounded-sm border flex items-center justify-center ${
            selected
              ? "bg-orangedeep text-white"
              : "border-gray-600 border-2 text-gray-400"
          }`}
        >
          {selected ? "✓" : ""}
        </div>

        <div
          onClick={onToggle}
          className="flex items-start gap-3 flex-1 select-none"
        >
          <div className="flex-1">
            <div className="flex flex-row justify-between items-center">
              <div className="flex gap-3">
                <div
                  style={{ backgroundColor: bgColor }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-sm flex items-center justify-center text-2xl"
                >
                  <img src={image} alt={plan.name} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base self-center">
                  {plan.name}
                </h3>
              </div>
              {ToggleIcon}
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-xs">
                <span className="text-navyteal px-1 py-1 rounded-full">
                  {plan.durationText}
                </span>
                <span className="px-1">|</span>
                {plan.trial_days > 0 && (
                  <span className="text-navyteal px-1 py-1 rounded-full">
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

      {/* Collapsible content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-100`}
        style={{ maxHeight: isOpen ? maxH : 0 }}
      >
        <div ref={contentRef} className="p-6 pt-4 space-y-2">
          {plan.subjects?.length > 0 && (
            <div className="mt-2 flex items-start gap-2">
              <span className="text-navyteal font-semibold text-sm ml-1 mb-1 text-nowrap">
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
              <div className="flex items-center gap-3">
                <Calender1 />
                <span className="text-navyteal text-sm font-semibold text-nowrap">
                  موعد البداية :
                </span>
                <span className="text-gray-800 font-medium text-sm">
                  {formatArabicDate(plan.times[0].start_date)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            {plan.weeklyClasses > 0 && (
              <span className="flex items-center gap-2 text-[#BA7C28] text-sm md:text-lg font-semibold py-1 rounded-full">
                <img src={Books} alt="" />
                <span className="border-l border-[#D9D9D9] pl-2">
                  {plan.weeklyClasses} حصص أسبوعياً
                </span>
                <img src={Books} alt="" />
                <span>{plan.monthlyClasses} حصص شهريا</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlanCard);
