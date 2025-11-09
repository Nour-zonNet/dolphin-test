import React, { useState } from "react";
import { useSelector } from "react-redux";
import Divider from "@/components/ui/Divider";
import { ArrowNext } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { applyCoupon, applyCouponToSubscription } from "@/services/api";

const AddCouponModal = ({ onClose, onSubmit, subscriptionId, forSubscription = false }) => {
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentBalance } = useSelector((state) => state.balance);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!couponCode || couponCode.trim() === "") {
      setError("يرجى إدخال كود الكوبون");
      return;
    }

    if (couponCode.trim().length < 3) {
      setError("كود الكوبون غير صحيح");
      return;
    }

    try {
      setLoading(true);
      
      // Call the appropriate API based on use case
      let response;
      if (forSubscription && subscriptionId) {
        // Apply coupon to subscription (add days)
        response = await applyCouponToSubscription(subscriptionId, couponCode.trim());
      } else {
        // Apply coupon to wallet (add balance)
        response = await applyCoupon(couponCode.trim());
      }
      
      if (response.success) {
        // Call onSubmit callback with coupon data
        onSubmit?.({
          couponCode: couponCode.trim(),
          amount: response.amount || 0,
          daysAdded: response.days_added || response.daysAdded || 0,
          message: response.message || (forSubscription ? "تم إضافة الأيام بنجاح" : "تم إضافة الكوبون بنجاح")
        });

        // Close modal
        onClose();
        
      } else {
        throw new Error(response.message || "فشل في تطبيق الكوبون");
      }
    } catch (error) {
      // Coupon error
      setError(error.message || "حدث خطأ أثناء تطبيق الكوبون");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen w-[90%] max-w-xl bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] p-4 md:p-6">
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
                {forSubscription ? "استخدام كوبون لإضافة أيام" : "كوبون لإضافة رصيد"}
              </h2>
              {!forSubscription && (
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
              )}
            </div>
          </div>
          <Divider />

          <form onSubmit={handleSubmit} className="py-4 md:py-8 space-y-4 md:space-y-8">
            {/* Coupon Code */}
            <div className="space-y-4">
              <label className="flex items-start justify-between flex-col lg:flex-row font-semibold text-navyteal text-sm md:text-2xl">
                <span className="text-nowrap">كود الكوبون</span>
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="ادخل كود الكوبون"
                className="w-full h-10 md:h-18 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[12px] md:text-lg placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors"
                required
              />
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
              disabled={!couponCode || loading}
              className="cursor-pointer w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-orangedeep rounded-[60px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 md:w-6 h-4 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ArrowNext className="w-4 md:w-6" />
              )}
              <span className="font-semibold text-navyteal text-base md:text-2xl">
                {loading ? "جاري المعالجة..." : "تطبيق الكوبون"}
              </span>
            </button>
          </form>
      </div>
    </div>
  );
};

export default AddCouponModal;

