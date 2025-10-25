import React from "react";
import { useNavigate } from "react-router-dom";
import { usePackages } from "../hooks/usePackages";
import PlansSearchBar from "../components/PlansSearchBar";
import PlanCard from "../components/PlanCard";
import PlansFooter from "../components/PlansFooter";
import { InfoIcon } from "@/utils/icons";
import { Header } from "@/components/layout";
import { HomeSupportBtn } from "@/components/layout";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import notFoundPackages from "@/assets/images/allPackages.png";

const DataPlanSelector = () => {
  const navigate = useNavigate();
  const { all } = usePackages();
  
  // Debug: Log available packages
  React.useEffect(() => {
    console.log('PackagesSelector - Available packages:', all);
    console.log('PackagesSelector - Package IDs:', all?.map(pkg => pkg.id));
  }, [all]);

  const [selectedPlanIds, setSelectedPlanIds] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [openPlanId, setOpenPlanId] = React.useState(null);
  const toggleOpen = React.useCallback((id) => {
    setOpenPlanId((prev) => (prev === id ? null : id));
  }, []);

  const formatPrice = React.useCallback((plan) => {
    if (plan.discountPercentage > 0) {
      return (
        <div className="flex flex-col items-end">
          <FormatWithCurrency
            amount={plan.finalPrice}
            className="text-[#BA7C28] font-bold text-base"
            symbolFill="#e89b32"
            symbolClass="w-6 h-6"
          />
          <FormatWithCurrency
            amount={plan.originalPrice}
            className="text-gray-400 line-through text-base"
            symbolFill="#e89b32"
            symbolClass="w-6 h-6"
          />
          <span className="text-green-600 text-base font-medium">
            خصم {plan.discountPercentage}%
          </span>
        </div>
      );
    }
    return (
      <FormatWithCurrency
        amount={plan.finalPrice}
        className="flex items-center gap-1 text-orangedeep font-bold text-lg"
        symbolFill="#e89b32"
        symbolClass="w-6 h-6"
      />
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
    console.log('PackagesSelector - Selecting package ID:', planId);
    setSelectedPlanIds((current) => {
      if (current.includes(planId)) {
        // Remove if already selected
        const newSelection = current.filter((id) => id !== planId);
        console.log('PackagesSelector - Removed from selection:', newSelection);
        return newSelection;
      } else {
        // Add to selection
        const newSelection = [...current, planId];
        console.log('PackagesSelector - Added to selection:', newSelection);
        return newSelection;
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
    console.log('PackagesSelector - Navigating to checkout with:', {
      selectedPlanIds: selectedPlanIds,
      selectedPlanDetails: selectedPlanDetails,
      totalPrice: totalPrice
    });
    
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
      <div className="min-h-svh space-y-4">
        {/* Header */}
        <Header
          balance={"0"}
          showBalanceSection={false}
          title=" اختر باقتك المناسبة"
          onBack={"/manage-subscription"}
        />

        {/* Search Bar */}
        <PlansSearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Warning */}
        <div className="px-6 md:px-18 mt-4">
          <div className="flex items-center gap-1 py-3 rounded-lg  ">
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
        {selectedPlanIds.length > 0 && (
          <div className=" mx-auto px-4">
            {/* <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="flex items-center gap-1 text-blue-700 text-sm font-medium">
                تم اختيار {selectedPlanIds.length} باقة(ات) - الإجمالي:{" "}
                <FormatWithCurrency
                  amount={totalPrice}
                  className="flex items-center gap-1 text-blue-700 text-sm font-medium"
                  symbolFill="#1447e6"
                  symbolClass="w-4"
                />
              </p>
            </div> */}
          </div>
        )}

        {/* Plans */}
        {all.length > 0 ? (
          <div className="mx-auto px-6 md:px-18 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid gap-4 pb-28">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlanIds.includes(plan.id)}
                onSelect={handlePlanSelect}
                formatPrice={formatPrice}
                isOpen={openPlanId === plan.id}
                onToggle={() => toggleOpen(plan.id)}
              />
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col justify-center items-center gap-4 mt-10 mr-20 mx-auto">
            <img
              src={notFoundPackages}
              alt="notFoundPackages"
              className="w-full max-w-[300px] object-contain mx-auto"
            />
            <div className="flex justify-center text-center">
              <button
                onClick={() => navigate("/schedule")}
                className="flex items-center text-xs gap-2 ml-20 bg-orangedeep text-darkblue font-medium px-4 sm:px-6 py-2 rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer sm:text-sm"
              >
                <span className="text-base">الرجوع للرئيسية</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <PlansFooter
          selectedPlanDetails={selectedPlanDetails}
          disabled={selectedPlanIds.length === 0}
          totalPrice={totalPrice}
          selectedCount={selectedPlanIds.length}
        />
      </div>
      <HomeSupportBtn />
    </>
  );
};

export default DataPlanSelector;