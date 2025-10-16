import React from "react";
import { Gift, Plus } from "@/utils/icons";
import { useModal } from "@/components/feedback/modal/useModal";

/**
 * Enhanced Balance Actions Buttons Component
 * Uses the centralized modal system for better state management
 */
const BalanceActionsButtons = () => {
  const { openAddBalanceModal, openAddCouponModal } = useModal();

  const handleAddBalance = () => {
    openAddBalanceModal((data) => {
      console.log('Balance added:', data);
      // TODO: Handle balance addition logic
    });
  };

  const handleAddCoupon = () => {
    openAddCouponModal((data) => {
      console.log('Coupon applied:', data);
      // TODO: Handle coupon application logic
    });
  };

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row w-[90%] xl:w-[40%] lg:w-[70%] mx-auto gap-[18px] justify-center items-center my-8 md:my-14">
        <button
          onClick={handleAddBalance}
          disabled={true}
          className="flex w-full h-[45px] md:h-[65px] lg:h-[70px] items-center justify-center gap-2 px-4 py-2 bg-orangedeep cursor-pointer rounded-[32px] hover:bg-foundationorangenormal-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 md:w-4 lg:w-6" />
          <div className="font-semibold text-sm md:text-2xl">إضافة رصيد</div>
        </button>
        
        <button
          onClick={handleAddCoupon}
          disabled={true}
          className="flex w-full h-[45px] md:h-[65px] lg:h-[70px] items-center justify-center gap-2 px-4 py-2 border border-orangedeep cursor-pointer rounded-[32px] hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Gift className="w-4 lg:w-6" />
          <div className="font-semibold text-sm md:text-2xl">
            كوبون لإضافة رصيد
          </div>
        </button>
      </div>
    </div>
  );
};

export default BalanceActionsButtons;