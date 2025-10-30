///////////////////////////////////////// external chrome tab
import React from "react";
// import { Gift, Plus } from "@/utils/icons";
import { useModal } from "@/components/feedback/modal/useModal";
import { Gift, Plus } from "lucide-react";

const BalanceActionsButtons = () => {
  const { openAddBalanceModal, openAddCouponModal } = useModal();

  const handleAddBalance = () => {
    openAddBalanceModal((data) => {
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
        
        setTimeout(() => {
          window.open(data.url, '_blank');
        }, 1000); 
      } else {
      }
    });
  };

  const handleAddCoupon = () => {
    openAddCouponModal(() => {
      // coupon application logic
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

// ////////////////////////////////// iframe 
// import React, { useState } from "react";
// import { useModal } from "@/components/feedback/modal/useModal";
// import { Gift, Plus, X } from "lucide-react";

// /**
//  * Enhanced Balance Actions Buttons Component with Embedded Payment
//  */
// const BalanceActionsButtons = () => {
//   const { openAddBalanceModal, openAddCouponModal } = useModal();
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentUrl, setPaymentUrl] = useState("");

//   const handleAddBalance = () => {
//     openAddBalanceModal((data) => {
//       if (data && data.invoice_id && data.url) {
//         // Store the transaction data
//         sessionStorage.setItem('currentTransaction', JSON.stringify({
//           id: data.invoice_id,
//           amount: data.amount,
//           currency: 'SAR',
//           status: 'pending',
//           createdAt: new Date().toISOString(),
//           bonusAmount: data.amount * 0.2,
//         }));
//         localStorage.setItem('pendingTransaction', JSON.stringify({
//           id: data.invoice_id,
//           amount: data.amount,
//           currency: 'SAR',
//           status: 'pending',
//           createdAt: new Date().toISOString(),
//           bonusAmount: data.amount * 0.2,
//         }));
        
//         // Set payment URL and show modal instead of opening new tab
//         setPaymentUrl(data.url);
//         setShowPaymentModal(true);
//       }
//     });
//   };

//   const handleAddCoupon = () => {
//     openAddCouponModal(() => {
//       // coupon application logic
//     });
//   };

//   const handlePaymentClose = () => {
//     setShowPaymentModal(false);
//     setPaymentUrl("");
//   };

//   // Function to handle payment completion (you'll need to implement this based on callbacks)
//   const handlePaymentSuccess = () => {
//     console.log("Payment completed successfully");
//     handlePaymentClose();
//     // Refresh balance or show success message
//   };

//   return (
//     <div>
//       {/* Payment Modal with Iframe */}
//       {showPaymentModal && paymentUrl && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center p-4 border-b">
//               <h3 className="text-lg font-semibold">إتمام عملية الدفع</h3>
//               <button
//                 onClick={handlePaymentClose}
//                 className="text-gray-500 hover:text-gray-700 p-1"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
            
//             {/* Iframe Container */}
//             <div className="flex-1 p-4">
//               <iframe
//                 src={paymentUrl}
//                 className="w-full h-full border-0 rounded-lg"
//                 title="MyFatoorah Payment"
//                 allow="payment *"
//                 allowFullScreen
//               />
//             </div>
            
//             {/* Modal Footer */}
//             <div className="p-4 border-t bg-gray-50">
//               <p className="text-sm text-gray-600 text-center">
//                 بعد إتمام عملية الدفع، سيتم إضافة الرصيد تلقائياً إلى حسابك
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex flex-col md:flex-row w-[90%] xl:w-[40%] lg:w-[70%] mx-auto gap-[18px] justify-center items-center my-8 md:my-14">
//         <button
//           onClick={handleAddBalance}
//           className="flex w-full h-[45px] md:h-[65px] lg:h-[70px] items-center justify-center gap-2 px-4 py-2 bg-orangedeep cursor-pointer rounded-[32px] hover:bg-foundationorangenormal-hover transition-colors"
//         >
//           <Plus className="w-3 md:w-4 lg:w-6" />
//           <div className="font-semibold text-sm md:text-2xl">إضافة رصيد</div>
//         </button>
        
//         <button
//           onClick={handleAddCoupon}
//           disabled={true}
//           className="flex w-full h-[45px] md:h-[65px] lg:h-[70px] items-center justify-center gap-2 px-4 py-2 border border-orangedeep cursor-pointer rounded-[32px] hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <Gift className="w-4 lg:w-6" />
//           <div className="font-semibold text-sm md:text-2xl">
//             كوبون لإضافة رصيد
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BalanceActionsButtons;