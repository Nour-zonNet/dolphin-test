import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LeftArrow, LeftArrowFilled, RightArrow } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { useSubscriptions } from "@/features/subscription/hooks/useSubscriptions";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

const PlansFooter = ({
  disabled,
  selectedCount,
  selectedPlanDetails = [],
  totalPrice = 0,
}) => {
  const navigate = useNavigate();
  const [isProcessingTrial, setIsProcessingTrial] = useState(false);
  const { createTrialSubscription } = useSubscriptions();
  const { openStatusModal } = useModal();

  const handleSubscribeNow = () => {
    // Navigate to checkout with selected packages data
    navigate("/checkout", {
      state: {
        selectedPackages: selectedPlanDetails,
        totalPrice: totalPrice,
        selectedCount: selectedCount,
      },
    });
  };

  const handleTryPlatform = useCallback(async () => {
    if (!selectedPlanDetails || selectedPlanDetails.length === 0) {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "خطأ في البيانات",
        message: "لم يتم اختيار أي باقات للفترة التجريبية.",
      });
      return;
    }

    setIsProcessingTrial(true);
    
    try {
      await createTrialSubscription(
        selectedPlanDetails.map((pkg) => ({
          package_id: pkg.id,
          start_date: null,
        }))
      );

      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم بدء الفترة التجريبية",
        message: "تم تفعيل الفترة التجريبية للباقات المختارة.",
        onClose: () => (window.location.href = "/schedule"),
      });
    } catch (error) {
      setIsProcessingTrial(false);
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "حدث خطأ",
        message: "لم نتمكن من تفعيل الفترة التجريبية، حاول مرة أخرى لاحقًا.",
      });
    }
  }, [createTrialSubscription, openStatusModal, selectedPlanDetails]);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="container mx-auto flex flex-row justify-between items-center gap-3">
        <div className="text-sm text-gray-700">
          {selectedCount > 0 ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="font-medium">
                {selectedCount} باقة(ات) محددة
              </span>
        
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-1 text-orangedeep font-bold">
                الإجمالي: 
                <FormatWithCurrency
                    amount={totalPrice} 
                    className="text-orangedeep font-bold"
                    symbolClass="w-4 h-4 md:w-5 md:h-5"
                    symbolFill="#e89b32"
                  />
              </span>
            </div>
          ) : (
            "لم تقم باختيار أي باقة"
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={handleSubscribeNow}
            className={`font-semibold flex flex-row items-center gap-2 flex-nowrap py-2 px-4 rounded-full transition-colors text-nowrap cursor-pointer ${
              disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orangedeep hover:bg-btnClicked text-navyteal"
            }`}
            disabled={disabled}
          >
            <LeftArrowFilled className="w-4" />
            اشترك الآن
            {selectedCount > 0 && (
              <span
                className="
        rounded-full 
        w-5 h-5 
        flex items-center justify-center 
        text-navyteal text-xs 
        bg-[#ae7426] 
        mr-1
      "
              >
                {selectedCount}
              </span>
            )}
          </button>
          
          <button
            onClick={handleTryPlatform}
            className={`font-semibold flex flex-row items-center gap-2 flex-nowrap py-2 px-4 rounded-full transition-colors text-nowrap cursor-pointer ${
              disabled || isProcessingTrial
                ? "border border-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-btnClicked hover:bg-orangedeep text-navyteal"
            }`}
            disabled={disabled || isProcessingTrial}
          >
            {isProcessingTrial ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LeftArrowFilled className="w-4" />
            )}
            {isProcessingTrial ? "جاري المعالجة..." : "جرب المنصة الان"}
            {selectedCount > 0 && !isProcessingTrial && (
              <span
                className="
        rounded-full 
        w-5 h-5 
        flex items-center justify-center 
        text-navyteal text-xs 
        bg-orangedeep
        mr-1
      "
              >
                {selectedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlansFooter);
