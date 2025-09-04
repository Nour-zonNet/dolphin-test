import React from "react";

const PlansFooter = ({ selectedPlanDetails, disabled, onSubscribe, totalPrice, selectedCount }) => {

  console.log(selectedPlanDetails)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-sm text-gray-700">
          {selectedCount > 0 ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="font-medium">
                {selectedCount} باقة(ات) محددة
              </span>
              <span className="hidden sm:block">•</span>
              <span className="text-orange-600 font-bold">
                الإجمالي: {totalPrice} ريال
              </span>
            </div>
          ) : (
            "لم تقم باختيار أي باقة"
          )}
        </div>
        <button
          onClick={onSubscribe}
          className={`font-semibold py-2 px-6 rounded-full transition-colors w-full sm:w-auto ${
            disabled 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-btnClicked hover:bg-orangedeep text-white"
          }`}
          disabled={disabled}
        >
          اشترك الآن 
          {selectedCount > 0 && <span className="rounded-full px-3 mr-1  aspect-square bg-health">{`${selectedCount}` }</span>}
         
        </button>
      </div>
    </div>
  );
};

export default React.memo(PlansFooter);