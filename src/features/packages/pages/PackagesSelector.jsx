import React from "react";
import { useNavigate } from "react-router-dom";
import { usePackages } from "../hooks/usePackages";
import SearchFilterBar from "../components/SearchFilterBar";
import PlanCard from "../components/PlanCard";
import PlansFooter from "../components/PlansFooter";
import { Header } from "../../../components/layout";

const DataPlanSelector = () => {
  const navigate = useNavigate();
  const { all } = usePackages();

  const [selectedPlanIds, setSelectedPlanIds] = React.useState([]);
  const [filteredPlans, setFilteredPlans] = React.useState([]);

  const getPackageIcon = React.useCallback((subjects) => {
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
  }, []);

  const formatPrice = React.useCallback((plan) => {
    if (plan.discountPercentage > 0) {
      return (
        <div className="flex flex-col items-end">
          <span className="text-orangedeep font-bold text-lg">
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
    }
    return (
      <span className="text-orangedeep font-bold text-lg">
        {plan.finalPrice} ريال
      </span>
    );
  }, []);

  const filterSource = React.useMemo(() => {
    if (!Array.isArray(all)) return [];
    return all.map((plan) => ({
      ...plan,
      title: plan.name || "",
      instructor: plan.instructor || "",
      group: plan.group || "",
    }));
  }, [all]);

  React.useEffect(() => {
    setFilteredPlans(filterSource);
  }, [filterSource]);

  const handlePlanSelect = React.useCallback((planId) => {
    setSelectedPlanIds((current) => {
      if (current.includes(planId)) {
        // Remove if already selected
        return current.filter((id) => id !== planId);
      } else {
        // Add to selection
        return [...current, planId];
      }
    });
  }, []);

  const selectedPlanDetails = React.useMemo(() => {
    if (selectedPlanIds.length === 0) return [];
    return (all || []).filter((plan) => selectedPlanIds.includes(plan.id));
  }, [all, selectedPlanIds]);

  const totalPrice = React.useMemo(() => {
    return selectedPlanDetails.reduce(
      (total, plan) => total + (plan.finalPrice || 0),
      0
    );
  }, [selectedPlanDetails]);

  const handleSubscribe = React.useCallback(() => {
    // Navigate to checkout with selected packages data
    navigate("/checkout", {
      state: {
        selectedPackages: selectedPlanDetails,
        totalPrice: totalPrice,
        selectedCount: selectedPlanIds.length
      }
    });
  }, [navigate, selectedPlanDetails, totalPrice, selectedPlanIds.length]);



  return (
    <div className="min-h-screen  space-y-6">
      {/* Header */}
  <Header title=" اختر باقتك المناسبة" balance={0}/>

      {/* Search Bar */}
      <SearchFilterBar
        packages={filterSource}
        onFilterChange={setFilteredPlans}
        placeholder="ابحث عن باقة..."
      />

      {/* Warning */}
      <div className=" mx-auto px-4 mt-4">
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

      {/* Selected Plans Counter */}
      {selectedPlanIds.length > 0 && (
        <div className=" mx-auto px-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm font-medium">
              تم اختيار {selectedPlanIds.length} باقة(ات) - الإجمالي:{" "}
              {totalPrice} ريال
            </p>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className=" mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid gap-4 pb-28">
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlanIds.includes(plan.id)}
            onSelect={handlePlanSelect}
            getPackageIcon={getPackageIcon}
            formatPrice={formatPrice}
          />
        ))}
      </div>

      {/* Footer */}
      <PlansFooter
        selectedPlanDetails={selectedPlanDetails}
        disabled={selectedPlanIds.length === 0}
        onSubscribe={handleSubscribe}
        totalPrice={totalPrice}
        selectedCount={selectedPlanIds.length}
      />
    </div>
  );
};

export default DataPlanSelector;
