import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Divider from "@/components/ui/Divider";
import { ArrowNext } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { chargeWallet } from "@/services/api";
import { setPaymentInProgress, addToBalance, setLastTransaction } from "@/store/balanceSlice";
import { useAuth } from "@/features/auth/hooks/useAuth";

const AddBalanceModal = ({ onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBalance, paymentInProgress } = useSelector((state) => state.balance);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!amount || amount <= 0) {
      setError("يرجى إدخال مبلغ صحيح");
      return;
    }

    if (amount < 10) {
      setError("الحد الأدنى للإيداع هو 10 ريال");
      return;
    }

    try {
      dispatch(setPaymentInProgress(true));
      
      // Call the wallet charge API
      const response = await chargeWallet(parseFloat(amount));
      
      if (response.success) {
        // Store transaction info in Redux store
        dispatch(setLastTransaction({
          id: response.invoice_id,
          amount: parseFloat(amount),
          currency: 'SAR',
          status: "pending",
          createdAt: new Date().toISOString(),
          bonusAmount: parseFloat(amount) * 0.2, // 20% bonus
        }));

        // Store transaction info in localStorage for persistence
        localStorage.setItem('pendingTransaction', JSON.stringify({
          id: response.invoice_id,
          amount: parseFloat(amount),
          currency: 'SAR',
          status: "pending",
          createdAt: new Date().toISOString(),
          bonusAmount: parseFloat(amount) * 0.2,
        }));

        // Call onSubmit callback with transaction data including payment URL
        onSubmit?.({
          amount: parseFloat(amount),
          invoice_id: response.invoice_id,
          status: "pending",
          url: response.url
        });

        // Close modal
        onClose();
        
      } else {
        throw new Error("فشل في إنشاء طلب الدفع");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "حدث خطأ أثناء معالجة الدفع");
      dispatch(setPaymentInProgress(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] w-[95%] md:w-[60%] my-auto">
        <div className="w-[90%] mx-auto">
          {/* Header */}
          <div className="relative flex items-center justify-between py-2 md:py-8">
            <button
              onClick={onClose}
              className="absolute right-0 w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
            >
              <img
                className="w-6 md:w-auto"
                alt="Close"
                 loading="lazy"
                src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
              />
            </button>
            {/* Title */}
            <div className="w-full text-center">
              <h2 className="font-semibold text-navyteal text-base md:text-[32px]">
                إضافة رصيد
              </h2>
              <div className="text-orangedeep text-sm md:text-2xl font-bold mt-2 flex items-center justify-center gap-2">
                رصيدك الحالي: 
                <div className="flex items-center gap-1">
                  <FormatWithCurrency
                    amount={currentBalance}
                    fractionDigits={0}
                    className="flex items-center gap-2"
                    symbolFill="#e89b32" 
                    symbolClass="w-4 md:w-6 lg:w-8"
                  />
                </div>
              </div>
            </div>
          </div>
          <Divider />

          <form onSubmit={handleSubmit} className="py-4 md:py-8 space-y-4 md:space-y-8">
            {/* Deposit Amount */}
            <div className="space-y-4">
              <label className="flex items-start justify-between flex-col lg:flex-row font-semibold text-navyteal text-sm md:text-2xl">
                <span className="text-nowrap">قيمة الإيداع</span>
                <span className="text-[12px] md:text-base mt-2">(اشحن  رصيدك الآن واحصل علي 20 % هدية مجانية إضافية)</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ادخل المبلغ المراد إيداعه"
                className="w-full h-10 md:h-18 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[12px] md:text-lg placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors"
                required
              />

              {/* Dynamic total with gift */}
              {amount && (
                  <p className="text-[#1C9C30] font-semibold text-sm md:text-lg">
                    إجمالي رصيدك مع الهدية :{" "}
                    <FormatWithCurrency
                      amount={Number(amount) * 1.2}
                      fractionDigits={2} 
                      symbolFill="#1C9C30"
                      symbolClass="w-4 h-4 md:w-6 md:h-6"
                      className="text-[#1C9C30]"
                    />
                  </p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-center font-semibold text-sm md:text-lg mt-2">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!amount || paymentInProgress}
              className="cursor-pointer w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-orangedeep rounded-[60px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentInProgress ? (
                <div className="w-4 md:w-6 h-4 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ArrowNext className="w-4 md:w-6" />
              )}
              <span className="font-semibold text-navyteal text-base md:text-2xl">
                {paymentInProgress ? "جاري المعالجة..." : "ادفع الآن"}
              </span>
            </button>

            {/* Payment in progress message */}
            {paymentInProgress && (
              <p className="text-orangedeep text-center font-semibold text-sm md:text-lg mt-2">
                جاري توجيهك إلى صفحة الدفع...
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBalanceModal;
