import React from "react";
import { useNavigate } from "react-router-dom";
import { usePackages } from "../hooks/usePackages";
import PlansSearchBar from "../components/PlansSearchBar";
import PlanCard from "../components/PlanCard";
import PlansFooter from "../components/PlansFooter";
import { InfoIcon } from "../../../utils/icons";
import { Header, HomeSupportBtn } from "../../../components/layout";

const DataPlanSelector = () => {
  const navigate = useNavigate();
  const { all } = usePackages();

  const [selectedPlanIds, setSelectedPlanIds] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const formatPrice = React.useCallback((plan) => {
    if (plan.discountPercentage > 0) {
      return (
        <div className="flex flex-col items-end">
          <span className="text-[#BA7C28] font-bold text-base">
            {plan.finalPrice} ريال
          </span>
          <span className="text-gray-400 line-through text-base">
            {plan.originalPrice} ريال
          </span>
          <span className="text-green-600 text-base font-medium">
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

  const filteredPlans = React.useMemo(() => {
    if (!Array.isArray(all) || all.length === 0) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return all;
    return all.filter((plan) =>
      (plan.name || "").toLowerCase().includes(query)
    );
  }, [all, searchQuery]);

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
        selectedCount: selectedPlanIds.length,
      },
    });
  }, [navigate, selectedPlanDetails, totalPrice, selectedPlanIds.length]);

  return (
    <>
      <div className="min-h-svh  space-y-4">
        {/* Header */}
        <Header
          balance={"0"}
          title=" اختر باقتك المناسبة"
          onBack={"/manage-subscription"}
        />

        {/* Search Bar */}
        <PlansSearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Warning */}
        <div className=" mx-auto px-4 mt-4">
          <div className="flex items-start gap-2 p-3 rounded-lg  ">
            <div className="w-6 h-6 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
              <InfoIcon />
            </div>
            <p className="text-[#BF2323DE] text-sm">
              تنبيه: اذا كنت قد اشتركت من خلال موقعنا وقمت بالسداد، يرجى تجاهل
              الفترة التجريبية. سيتم تحديث اشتراكك لاحقاً من قبل خدمة العملاء
            </p>
          </div>
        </div>

        {/* Selected Plans Counter */}
        {/* {selectedPlanIds.length > 0 && (
        <div className=" mx-auto px-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-sm font-medium">
        تم اختيار {selectedPlanIds.length} باقة(ات) - الإجمالي:{" "}
              {totalPrice} ريال
            </p>
            </div>
            </div>
            )} */}

        {/* Plans */}
        <div className=" mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pb-28">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlanIds.includes(plan.id)}
              onSelect={handlePlanSelect}
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
        {/* <div className=" fixed bottom-24 right-4  md:bottom-32 md:right-8 lg:bottom-40 lg:right-12  z-50 ">

<HomeSupportBtn  />
</div> */}
      </div>
      <div className=" fixed bottom-30 right-4  md:bottom-32 md:right-8 lg:bottom-40 lg:right-12  z-50 ">
        <HomeSupportBtn />
      </div>
    </>
  );
};

export default DataPlanSelector;
