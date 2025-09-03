import React from "react";

const PlanCard = ({
  plan,
  selected,
  onSelect,
  getPackageIcon,
  formatPrice,
}) => {
  return (
    <div
      className={` rounded-xl  cursor-pointer border-0  transition-all ${
        selected ? "shadow-md " : "border-gray-200 "
      }`}
      onClick={() => onSelect(plan.id)}
    >
      <div className="flex justify-between gap-4 rounded-t-xl  border-r-10 border-health p-6 bg-[#EAEAEA] items-start ">
        <div
          className={`w-6 h-6 rounded-md  border flex items-center justify-center ${
            selected
              ? "bg-blue-500 border-blue-500 text-white"
              : "border-gray-400  text-gray-400"
          }`}
        >
          {selected ? "✓" : ""}
        </div>
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-1">
            <div className="flex  gap-3">
              <div className="w-12 h-12 bg-health rounded-md flex items-center justify-center  text-2xl">
                {getPackageIcon(plan.subjects)}
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base self-center">
                {plan.name}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {plan.durationText}
              </span>
              {plan.trial_days > 0 && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {plan.trial_days} أيام تجريبية
                </span>
              )}
              {plan.weeklyClasses > 0 && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {plan.weeklyClasses} حصص أسبوعياً
                </span>
              )}
            </div>
            {plan.subjects && plan.subjects.length > 0 && (
              <div className="mt-2">
                <span className="text-gray-600 text-sm">
                  التخصص: {plan.subjects.map((s) => s.name).join("، ")}
                </span>
                <span className=" float-end">  سعر الباقة : { formatPrice(plan)}</span>
              </div>
            )}
          </div>
        </div>

       
      </div>

      {selected && (
        <div className=" pt-4 border-t border-gray-100 p-10">
          <div className="grid grid-cols-2 gap-4 text-sm">
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
          </div>

          {plan.times && plan.times.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-500">موعد البدء: </span>
              <span className="text-gray-800 font-medium">
                {new Date(plan.times[0].start_date).toLocaleDateString("ar-SA")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(PlanCard);
