import React from "react";
import { packageFactory } from "../factory/packageFactory";
import { Calendar, Calender1 } from "@/utils/icons";
import Books from "@/assets/packages/books.svg";
import { Info } from "@/utils/icons";
import FormatWithCurrency  from "@/utils/FormatWithCurrency";

const PlanCard = ({ plan, selected, onSelect, formatPrice }) => {
  const { image, bgColor } = packageFactory(plan.id.image);
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
      className={` rounded-2xl   cursor-pointer border-0   ${
        selected ? "border-1  border-gray-400/60" : "border-gray-200/40 "
      }`}
      onClick={() => onSelect(plan.id)}
    >
      <div className="flex justify-between gap-2 md:gap-4 rounded-t-2xl  border-r-10 border-health p-5 bg-[#EAEAEA] items-start ">
        <div
          className={`w-6 h-6 rounded-sm  border flex items-center justify-center ${
            selected
              ? "bg-orangedeep border-oranbg-orangedeep text-white"
              : "border-gray-600 border-2  text-gray-400"
          }`}
        >
          {selected ? "✓" : ""}
        </div>
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-1">
            <div className="flex  gap-3">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 bg-[${bgColor}] rounded-sm flex items-center justify-center text-2xl`}
              >
                <img src={image} alt="" srcSet="" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base self-center">
                {plan.name}
              </h3>
            </div>

            <div className="flex  justify-between flex-nowrap items-center  mt-2">
              <div>
                <span className=" text-navyteal text-xs px-1 py-1 rounded-full">
                  {plan.durationText}
                </span>
                <span>|</span>
                {plan.trial_days > 0 && (
                  <span className=" text-navyteal text-xs px-1 py-1 rounded-full">
                    {plan.trial_days} أيام تجريبية
                  </span>
                )}
              </div>
              {/* <span>|</span> */}

              <span className="flex items-center gap-2 float-end self-end text-left text-base">
                {" "}
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

      {selected && (
        <div className=" pt-4 border-t border-gray-100 p-6 space-y-2 ">
          {plan.subjects && plan.subjects.length > 0 && (
            <div className="mt-2 flex items-center">
              <span className="text-navyteal font-semibold text-sm block ml-1 mb-1">
                المواد المشمولة :
              </span>
              <div className="flex flex-wrap gap-2">
                {plan.subjects.map((s, i) => {
                  const randomColor = colors[i % colors.length]; // stable per index

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
          {plan.times && plan.times.length > 0 && (
            <div className="flex flex-row justify-between item items-center">
              <div className=" flex items-center  space-x-3">
                <Calender1 />
                <span className="text-navyteal text-sm font-semibold text-nowrap">
                  موعد البداية :{" "}
                </span>
                <span className="text-gray-800 font-medium text-sm">
                  {new Date(plan.times[0].start_date).toLocaleDateString(
                    "ar-EG"
                  )}
                </span>
              </div>
              {plan.times &&
                plan.times.length > 0 &&
                plan.times.some((t) => new Date(t.start_date) < new Date()) && (
                    <span className="border-dashed py-1 border-orangedeep text-sm border px-4 rounded-full md:text-base text-nowrap">
                      تم بدء الباقة
                    </span>
                )}
            </div>
          )}
          <div className="flex items-center justify-between">
               {plan.weeklyClasses > 0 && (
            <span className=" flex items-center gap-2 text-[#BA7C28] text-sm md:text-lg  font-semibold py-1 rounded-full">
              <img src={Books} alt="" srcSet="" />
              <span className="border-l-3 border-[#D9D9D9] pl-2">
                {plan.weeklyClasses} حصص أسبوعياً
              </span>
              <img src={Books} alt="" srcSet="" />
              <span>{plan.monthlyClasses} حصص شهريا</span>
            </span>
          )}
            {/* <span className="text-nowrap flex items-center gap-2 text-sm  text-status">
              <Info className="span w-5 text-status " />
              تفاصيل الباقة
            </span> */}
          </div>
       

          {/* <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">نوع الباقة: </span>
              <span className="text-gray-800 font-medium">
                {plan.type === "paid" ? "مدفوعة" : "مجانية"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">الحصص الشهرية: </span>
              <span className="text-gray-800 font-medium">
                {plan.monthlyClasses} حصة
              </span>
            </div>
            <div>
              <span className="text-gray-500">الحالة: </span>
              <span className="text-gray-800 font-medium">
                {plan.status === "active" ? "نشطة" : "غير نشطة"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">يمكن استخدام المحفظة: </span>
              <span className="text-gray-800 font-medium">
                {plan.canUseWallet === "yes" ? "نعم" : "لا"}
              </span>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default React.memo(PlanCard);
