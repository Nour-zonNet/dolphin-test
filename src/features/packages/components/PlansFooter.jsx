import React from "react";

const PlansFooter = ({ selectedPlanDetails, disabled, onSubscribe }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-sm text-gray-700">
          {selectedPlanDetails ? (
            <div>
              <span className="font-medium">الباقة المحددة: </span>
              <span>{selectedPlanDetails?.name}</span>
              <span className="mx-2">•</span>
              <span className="text-orange-600 font-bold">{selectedPlanDetails?.finalPrice} ريال</span>
            </div>
          ) : (
            "لم تقم باختيار باقة"
          )}
        </div>
        <button
          onClick={onSubscribe}
          className={`font-semibold py-2 px-6 rounded-full transition-colors w-full sm:w-auto ${
            disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
          disabled={disabled}
        >
          اشترك الآن →
        </button>
      </div>
    </div>
  );
};

export default React.memo(PlansFooter);


