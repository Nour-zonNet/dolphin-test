import React from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Plus } from "@/utils/icons";
import { useModal } from "@/components/feedback/modal/useModal";

/**
 * Enhanced Balance Actions Buttons Component
 * Uses the centralized modal system for better state management
 */
const BalanceActionsButtons = () => {
  const navigate = useNavigate();
  const { openAddBalanceModal, openAddCouponModal } = useModal();

  const handleAddBalance = () => {
    openAddBalanceModal((data) => {
      
      // After payment initiation, redirect directly to MyFatora
      if (data && data.invoice_id && data.url) {
        
        // Store the transaction data for the status page
        sessionStorage.setItem('currentTransaction', JSON.stringify({
          id: data.invoice_id,
          amount: data.amount,
          currency: 'SAR',
          status: 'pending',
          createdAt: new Date().toISOString(),
          bonusAmount: data.amount * 0.2, // 20% bonus
        }));
        localStorage.setItem('pendingTransaction', JSON.stringify({
          id: data.invoice_id,
          amount: data.amount,
          currency: 'SAR',
          status: 'pending',
          createdAt: new Date().toISOString(),
          bonusAmount: data.amount * 0.2,
        }));
        
        // Add a small delay to make the network request visible in console
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000); // 1 second delay
      } else {
        console.error('Invalid payment data received:', data);
      }
    });
  };

  const handleAddCoupon = () => {
    openAddCouponModal((data) => {
      // TODO: Handle coupon application logic
    });
  };

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row w-[90%] xl:w-[40%] lg:w-[70%] mx-auto gap-[18px] justify-center items-center my-8 md:my-14">
        <button
          onClick={handleAddBalance}
          className="flex w-full h-[45px] md:h-[65px] lg:h-[70px] items-center justify-center gap-2 px-4 py-2 bg-orangedeep cursor-pointer rounded-[32px] hover:bg-foundationorangenormal-hover transition-colors"
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