import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSubscriptions } from "@/features/subscription/hooks/useSubscriptions";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { getPackageIcon } from "./utils";
import { Header } from "../../../../components/layout";

export const Checkout = () => {
  const location = useLocation();
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isSubmittingTrial, setIsSubmittingTrial] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [packageStartDates, setPackageStartDates] = useState({});
  const { createTrialSubscription } = useSubscriptions();
  const { openStatusModal } = useModal();

  const { selectedPackages = [], totalPrice = 0 } = location.state || {};

  useEffect(() => {
    // Useful for debugging data coming from selector
    // console.debug("selectedPackages", selectedPackages);
  }, [selectedPackages]);

  const handleSubmitTrial = useCallback(async () => {
    try {
      setIsSubmittingTrial(true);
      await createTrialSubscription(
        selectedPackages.map((pkg) => ({
          package_id: pkg.id,
          start_date: packageStartDates[pkg.id] || null,
        }))
      );
      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم بدء الفترة التجريبية",
        message: "تم تفعيل الفترة التجريبية للباقات المختارة.",
      });
    } finally {
      setIsSubmittingTrial(false);
    }
  }, [createTrialSubscription, openStatusModal, selectedPackages, packageStartDates]);

  const handlePay = useCallback(() => {
    setIsPaying(true);
    setTimeout(() => {
      openStatusModal(MODAL_TYPES.SUCCESS, {
        title: "تم الدفع بنجاح",
        message: "شكراً لك! تم تأكيد عملية الدفع وسيتم تفعيل الباقات المختارة.",
      });
      setIsPaying(false);
    }, 800);
  }, [openStatusModal]);

  const discountedTotal = useMemo(() => {
    if (!discountApplied) return totalPrice;
    // Apply a simple 10% discount UX-wise when a code is applied
    const discounted = Math.max(0, Math.round(totalPrice * 0.9));
    return discounted;
  }, [discountApplied, totalPrice]);

  const handleApplyDiscount = useCallback(() => {
    setDiscountError("");
    setIsApplyingDiscount(true);
    setTimeout(() => {
      const isValid = discountCode.trim().length >= 4; // simple UX validation
      if (isValid) {
        setDiscountApplied(true);
      } else {
        setDiscountApplied(false);
        setDiscountError("يرجى إدخال كود خصم صالح");
      }
      setIsApplyingDiscount(false);
    }, 400);
  }, [discountCode]);

  return (
    <div className="relative min-h-screen bg-white">
      <Header title={"شراء الباقات"} showBalanceSection={false } />

      <main className="mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8 max-w-6xl">
        <BalanceSummary />
        <SelectedPackages
          selectedPackages={selectedPackages}
          packageStartDates={packageStartDates}
          onChangeStartDate={(id, value) =>
            setPackageStartDates((prev) => ({ ...prev, [id]: value }))
          }
        />
        <DiscountBar
          totalPrice={totalPrice}
          discountedTotal={discountedTotal}
          discountApplied={discountApplied}
          isApplying={isApplyingDiscount}
          error={discountError}
          code={discountCode}
          onCodeChange={setDiscountCode}
          onApply={handleApplyDiscount}
        />
        <Actions
          onSubmitTrial={handleSubmitTrial}
          onPay={handlePay}
          isSubmittingTrial={isSubmittingTrial}
          isPaying={isPaying}
          disabled={!selectedPackages || selectedPackages.length === 0}
        />
      </main>

      {discountApplied && (
        <div className="fixed bottom-20 right-4 md:right-8 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-cairo text-sm md:text-base text-center z-40">
          تم تفعيل كود الخصم بنجاح
        </div>
      )}
    </div>
  );
};


const BalanceSummary = () => (
  <div className="flex flex-row justify-between gap-4 lg:gap-6">
    <div className="relative w-30  sm:w-auto h-20 md:h-30 xl:w-72 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 md:p-6">
      <div className="absolute inset-0 flex items-center justify-center">
        <img className="w-full h-full object-contain" alt="Vector" src="https://c.animaapp.com/mf3u5boioWZVpp/img/vector.svg" />
      </div>
      <div className="relative z-10">
        <div className="text-sm md:text-xl font-semibold text-blue-800 font-cairo  mb-2">رصيد محفظتك</div>
        <div className="text-sm md:text-xl font-semibold text-blue-600 font-cairo ">1000 ريال</div>
      </div>
    </div>

    <div className="flex-1 space-y-3">
      <div className="flex items-center justify-start gap-2">
        <img className="w-5 h-5 md:w-6 md:h-6" alt="Info" src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1.svg" />
        <div className="text-sm md:text-xl font-semibold text-blue-700 font-cairo">رصيدك الحالي متاح للاستخدام</div>
      </div>

      <div className="flex items-center justify-start gap-2">
        <img className="w-5 h-5 md:w-6 md:h-6" alt="Group" src="https://c.animaapp.com/mf3u5boioWZVpp/img/group-1.png" />
        <p className="text-sm md:text-xl font-semibold text-gray-500 font-cairo">مدة الفترة التجريبية: 1 أيام تجريبية مجانية</p>
      </div>
    </div>
  </div>
);

const SelectedPackages = ({ selectedPackages, packageStartDates, onChangeStartDate }) => {
  if (!selectedPackages || selectedPackages.length === 0) {
    return (
      <div className="w-full bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 relative">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-800 font-cairo text-center">الباقات المختارة</h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500 font-cairo text-lg">لم يتم اختيار أي باقات. يرجى العودة لاختيار الباقات.</p>
          <button onClick={() => window.history.back()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-cairo">العودة لاختيار الباقات</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 relative">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-800 font-cairo text-center">الباقات المختارة ({selectedPackages.length})</h2>
      </div>
      <div className="max-h-[28rem] md:max-h-80 lg:max-h-96 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {selectedPackages.map((pkg, index) => (
            <React.Fragment key={pkg.id || index}>
              <PackageItem
                title={pkg.name || `باقة ${index + 1}`}
                price={`${pkg.finalPrice || 0} ريال`}
                icon={getPackageIcon(pkg.subjects)}
                showDatePicker={true}
                dateValue={packageStartDates[pkg.id] || ""}
                onDateChange={(value) => onChangeStartDate?.(pkg.id, value)}
              />
              {index < selectedPackages.length - 1 && (
                <div className="border-t border-gray-200 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
      `}</style>
    </div>
  );
};

const PackageItem = ({ title, price, icon, showDatePicker, status, dateValue, onDateChange }) => (
  <div className="flex flex-col items-start justify-between gap-4">
    <div className="w-full flex items-center gap-3 justify-between">
      <div className="flex items-center gap-3 justify-start lg:justify-start">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
          <img className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="Package" src={icon} />
        </div>
        <div className="lg:text-left">
          <div className="font-cairo font-semibold text-lg text-gray-800">{title}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <p className="font-cairo font-semibold text-blue-800 text-lg">
          سعر الباقة: <span className="text-xl">{price}</span>
        </p>
      </div>
    </div>
    <div className="w-full lg:w-auto">
      {showDatePicker ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full">
          <div className="font-cairo font-semibold text-gray-800 text-sm md:text-base shrink-0">اختر موعد بداية الباقة:</div>
          <div className="flex-1 flex items-center gap-2 p-2 md:p-3 border border-gray-300 rounded-full bg-white">
            <img className="w-5 h-5 md:w-6 md:h-6" alt="Calendar" src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1410117192.svg" />
            <input
              type="date"
              className="flex-1 font-cairo text-sm text-gray-700 outline-none bg-transparent"
              value={dateValue}
              onChange={(e) => onDateChange?.(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="font-cairo font-semibold text-gray-800 text-sm md:text-base">اختر موعد بداية الباقة:</div>
          <div className="flex items-center gap-2 p-3 border border-gray-400 rounded-full">
            <span className="font-cairo text-sm text-orange-600">{status}</span>
            <img className="w-5 h-5 md:w-6 md:h-6" alt="Calendar" src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1410117192.svg" />
          </div>
        </div>
      )}
    </div>
  </div>
);

const DiscountBar = ({ totalPrice, discountedTotal, discountApplied, isApplying, error, code, onCodeChange, onApply }) => (
  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 md:p-6 bg-white rounded-xl shadow-sm">
    <div className="w-full flex flex-col gap-3 md:gap-4">
      <div className="text-base md:text-lg font-semibold text-gray-800 font-cairo">
        هل لديك كود خصم؟
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full">
        <div className="relative flex-1 w-full">
          <div className={`flex items-center gap-3 p-1 md:p-2 border ${error ? "border-red-400" : "border-dashed border-blue-800"} rounded-full`}>
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Discount"
              src="https://c.animaapp.com/mf3u5boioWZVpp/img/group.png"
            />
            <input
              type="text"
              placeholder="أدخل كود الخصم"
              className="flex-1 font-cairo outline-none bg-transparent text-sm md:text-base"
              value={code}
              onChange={(e) => onCodeChange?.(e.target.value)}
              disabled={isApplying}
            />
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onApply}
              disabled={isApplying}
            >
              {isApplying ? "جارٍ التحقق" : "تطبيق"}
            </button>
          </div>
          {error ? (
            <div className="text-xs text-red-500 font-cairo mt-1 px-3">{error}</div>
          ) : null}
        </div>

        <div className="text-center md:text-right text-sm md:text-lg font-bold text-blue-800 font-cairo shrink-0">
          {discountApplied ? (
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">{totalPrice} ريال</span>
              <span className="text-blue-800">{discountedTotal} ريال</span>
            </div>
          ) : (
            <>الاجمالي: {totalPrice} ريال</>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Actions = ({ onSubmitTrial, onPay, isSubmittingTrial, isPaying, disabled }) => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 mt-8">
    <button
      onClick={onSubmitTrial}
      disabled={disabled || isSubmittingTrial}
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border-2 border-orange-400 rounded-full text-deepbg-orangedeep font-semibold hover:bg-orange-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <img className="w-5 h-5 md:w-6 md:h-6" alt="Icon" src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame.svg" />
      <span className="font-cairo text-base md:text-lg">{isSubmittingTrial ? "جارٍ البدء" : "بدء الفترة التجريبية"}</span>
    </button>
    <button
      onClick={onPay}
      disabled={disabled || isPaying}
      className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 bg-orangedeep rounded-full text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <img className="w-5 h-5 md:w-6 md:h-6" alt="Icon" src="https://c.animaapp.com/mf3u5boioWZVpp/img/left-2.png" />
      <span className="font-cairo text-base md:text-lg">{isPaying ? "جارٍ الدفع" : "ادفع الان"}</span>
    </button>
  </div>
);

export default Checkout;


