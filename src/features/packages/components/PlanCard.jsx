import React from "react";

const PlanCard = ({ plan, selected, onSelect, getPackageIcon, formatPrice }) => {
  return (
    <div
      className={`bg-white rounded-xl p-4 border cursor-pointer transition-all ${
        selected ? "border-blue-500 shadow-md ring-2 ring-blue-100" : "border-gray-200 hover:border-blue-400"
      }`}
      onClick={() => onSelect(plan.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mt-1">
            {getPackageIcon(plan.subjects)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{plan.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{plan.durationText}</span>
              {plan.trial_days > 0 && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{plan.trial_days} أيام تجريبية</span>
              )}
              {plan.weeklyClasses > 0 && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{plan.weeklyClasses} حصص أسبوعياً</span>
              )}
            </div>
            {plan.subjects && plan.subjects.length > 0 && (
              <div className="mt-2">
                <span className="text-gray-600 text-sm">التخصص: {plan.subjects.map((s) => s.name).join("، ")}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {formatPrice(plan)}
          <div
            className={`w-6 h-6 rounded-full border flex items-center justify-center ${
              selected ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 bg-white text-gray-400"
            }`}
          >
            {selected ? "✓" : ""}
          </div>
        </div>
      </div>

      {selected && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">نوع الباقة: </span>
              <span className="text-gray-800 font-medium">{plan.type === "paid" ? "مدفوعة" : "مجانية"}</span>
            </div>
            <div>
              <span className="text-gray-500">الحصص الشهرية: </span>
              <span className="text-gray-800 font-medium">{plan.monthlyClasses} حصة</span>
            </div>
            <div>
              <span className="text-gray-500">الحالة: </span>
              <span className="text-gray-800 font-medium">{plan.status === "active" ? "نشطة" : "غير نشطة"}</span>
            </div>
            <div>
              <span className="text-gray-500">يمكن استخدام المحفظة: </span>
              <span className="text-gray-800 font-medium">{plan.canUseWallet === "yes" ? "نعم" : "لا"}</span>
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


