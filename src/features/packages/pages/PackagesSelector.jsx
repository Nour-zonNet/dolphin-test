import React, { useState, useEffect } from "react";
import { usePackages } from "../hooks/usePackages";
import { useModal } from "@/components/feedback/modal/useModal";
const DataPlanSelector = () => {
  const { all } = usePackages();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);

  const { openBuyPackageModal } = useModal();
  // Map icons based on package subjects
  const getPackageIcon = (subjects) => {
    if (!subjects || subjects.length === 0) return "📦";

    const subjectName = subjects[0].name;
    switch (subjectName) {
      case "البرمجة":
        return "💻";
      case "الرياضيات":
        return "🧮";
      case "العلوم":
        return "🔬";
      case "اللغة العربية":
        return "📖";
      case "اللغة الإنجليزية":
        return "🔤";
      default:
        return "📦";
    }
  };

  // Format price display
  const formatPrice = (plan) => {
    if (plan.discountPercentage > 0) {
      return (
        <div className="flex flex-col items-end">
          <span className="text-orange-600 font-bold text-lg">
            {plan.finalPrice} ريال
          </span>
          <span className="text-gray-400 line-through text-sm">
            {plan.originalPrice} ريال
          </span>
          <span className="text-green-600 text-xs font-medium">
            خصم {plan.discountPercentage}%
          </span>
        </div>
      );
    } else {
      return (
        <span className="text-orange-600 font-bold text-lg">
          {plan.finalPrice} ريال
        </span>
      );
    }
  };

  // Filter plans based on search query
  useEffect(() => {
    console.log(selectedPlan)
    if (all && all.length > 0) {
      if (searchQuery) {
        const filtered = all.filter((plan) =>
          plan.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPlans(filtered);
      } else {
        setFilteredPlans(all);
      }
    }
  }, [searchQuery, all, selectedPlan]);

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId === selectedPlan ? null : planId);
  };

  // Get selected plan details
  const selectedPlanDetails = selectedPlan
    ? all.find((plan) => plan.id === selectedPlan)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-blue-900">0 ريال</span>
            <span className="text-gray-700 font-semibold">الرصيد</span>
          </div>
          <h1 className="font-bold text-lg sm:text-2xl text-gray-800 text-center">
            اختر باقتك المناسبة
          </h1>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xl text-gray-600">☰</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="استكشف الباقات..."
            className="flex-1 text-gray-700 focus:outline-none text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="text-gray-500 ml-2">🔍</span>
        </div>
      </div>

      {/* Warning */}
      <div className="container mx-auto px-4 mt-4">
        <div className="flex items-start gap-2 bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
            <span className="text-red-600 text-sm font-bold">!</span>
          </div>
          <p className="text-red-700 text-sm">
            تنبيه: اذا كنت قد اشتركت من خلال موقعنا وقمت بالسداد، يرجى تجاهل
            الفترة التجريبية. سيتم تحديث اشتراكك لاحقاً من قبل خدمة العملاء
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="container mx-auto px-4 mt-6 grid grid-cols-1 gap-4 pb-28">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl p-4 border cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                : "border-gray-200 hover:border-blue-400"
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <div className="flex justify-between items-start">
              {/* Icon and basic info */}
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mt-1">
                  {getPackageIcon(plan.subjects)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {plan.name}
                  </h3>
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
                    </div>
                  )}
                </div>
              </div>

              {/* Price and selection */}
              <div className="flex flex-col items-end gap-2">
                {formatPrice(plan)}
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {selectedPlan === plan.id ? "✓" : ""}
                </div>
              </div>
            </div>

            {/* Additional details that appear when selected */}
            {selectedPlan === plan.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
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
                    <span className="text-gray-500">
                      يمكن استخدام المحفظة:{" "}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {plan.canUseWallet === "yes" ? "نعم" : "لا"}
                    </span>
                  </div>
                </div>

                {plan.times && plan.times.length > 0 && (
                  <div className="mt-3">
                    <span className="text-gray-500">موعد البدء: </span>
                    <span className="text-gray-800 font-medium">
                      {new Date(plan.times[0].start_date).toLocaleDateString(
                        "ar-SA"
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-700">
            {selectedPlan ? (
              <div>
                <span className="font-medium">الباقة المحددة: </span>
                <span>{selectedPlanDetails?.name}</span>
                <span className="mx-2">•</span>
                <span className="text-orange-600 font-bold">
                  {selectedPlanDetails?.finalPrice} ريال
                </span>
              </div>
            ) : (
              "لم تقم باختيار باقة"
            )}
          </div>
          <button
          onClick={()=>openBuyPackageModal(selectedPlanDetails)}
            className={`font-semibold py-2 px-6 rounded-full transition-colors w-full sm:w-auto ${
              selectedPlan
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedPlan}
          >
            اشترك الآن →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPlanSelector;
