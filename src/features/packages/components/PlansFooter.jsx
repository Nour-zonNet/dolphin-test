import React from "react";
import { LeftArrow, LeftArrowFilled, RightArrow } from "../../../utils/icons";

const PlansFooter = ({
  disabled,
  onSubscribe,
  totalPrice,
  selectedCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="container mx-auto flex flex-row justify-between items-center gap-3">
        <div className="text-sm text-gray-700">
          {selectedCount > 0 ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {/* <span className="font-medium">
                {selectedCount} باقة(ات) محددة
              </span> */}
              {/* <span className="hidden sm:block">•</span> */}
              <span className="text-[#185a80] font-bold">
                الإجمالي: {totalPrice} ريال
              </span>
            </div>
          ) : (
            "لم تقم باختيار أي باقة"
          )}
        </div>
        <button
          onClick={onSubscribe}
          className={`font-semibold flex flex-row items-center gap-2 flex-nowrap py-2 px-6 rounded-full transition-colors w-auto sm:w-auto text-nowrap ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-btnClicked hover:bg-orangedeep text-white"
          }`}
          disabled={disabled}
        >
          <LeftArrowFilled className="w-5" />
          اشترك الآن
          {selectedCount > 0 && (
            <span
              className="
      rounded-full 
      w-6 h-6 
      flex items-center justify-center 
      text-white text-sm 
      bg-[#ae7426] 
      mr-1
    "
            >
              {selectedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(PlansFooter);
