import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSubscriptions } from "@/features/subscription/hooks/useSubscriptions";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { getPackageIcon } from "./utils";
import { Header } from "../../../../components/layout";

export const Checkout = () => {
  const location = useLocation();
  const [discountApplied, setDiscountApplied] = useState(false);
  const { createTrialSubscription } = useSubscriptions();
  const { openStatusModal } = useModal();

  const { selectedPackages = [], totalPrice = 0 } = location.state || {};

  useEffect(() => {
    // Useful for debugging data coming from selector
    // console.debug("selectedPackages", selectedPackages);
  }, [selectedPackages]);

  const handleSubmitTrial = useCallback(async () => {
     await createTrialSubscription(
      selectedPackages.map((pkg) => ({ package_id: pkg.id, start_date: null }))
    );

    // window.location.href = "/schedule";

    openStatusModal(MODAL_TYPES.SUCCESS, {
      title: "تم بدء الفترة التجريبية",
      message: "تم تفعيل الفترة التجريبية للباقات المختارة.",
      onClose: () => (window.location.href = "/schedule"),
    });
  }, [createTrialSubscription, openStatusModal, selectedPackages]);

  const handlePay = useCallback(() => {
    openStatusModal(MODAL_TYPES.SUCCESS, {
      title: "تم الدفع بنجاح",
      message: "شكراً لك! تم تأكيد عملية الدفع وسيتم تفعيل الباقات المختارة.",
      onClose: () => (window.location.href = "/schedule"),
    });
  }, [openStatusModal]);

  return (
    <div className="relative min-h-screen bg-white">
      <Header onBack={"/main-packages"} balance={0} title=" شراء الباقات" />

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <BalanceSummary />
        <SelectedPackages selectedPackages={selectedPackages} />
        <DiscountBar
          totalPrice={totalPrice}
          onApply={() => setDiscountApplied(true)}
        />
        <Actions onSubmitTrial={handleSubmitTrial} onPay={handlePay} />
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
  <div className="flex flex-col lg:flex-row  items-start lg:items-start  justify-between gap-6">
    <div className="relative w-50 sm:w-50 lg:w-40 xl:w-46 h-40 bg-gradient-to-br mx-auto from-blue-50 to-blue-100 rounded-2xl p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          className="w-full h-full object-contain"
          alt="Vector"
          src="https://c.animaapp.com/mf3u5boioWZVpp/img/vector.svg"
        />
      </div>
      <div className="relative z-10">
        <div className="text-lg md:text-xl text-center md:text-right font-semibold text-black font-cairo mb-2">
          رصيد محفظتك
        </div>
        <div className="text-2xl md:text-3xl text-center  font-semibold text-subtext font-cairo">
          1000 ريال
        </div>
      </div>
    </div>

    <div className="flex-1 space-y-3">
      <div className="flex items-center gap-2">
        <img
          className="w-5 h-5 md:w-6 md:h-6"
          alt="Info"
          src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1.svg"
        />
        <div className="text-lg md:text-xl font-semibold text-normalblue font-cairo">
          رصيدك الحالي متاح للاستخدام
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img
          className="w-5 h-5 md:w-6 md:h-6"
          alt="Group"
          src="https://c.animaapp.com/mf3u5boioWZVpp/img/group-1.png"
        />
        <p className="text-base md:text-lg font-semibold text-gray-500 font-cairo">
          مدة الفترة التجريبية: 1 أيام تجريبية مجانية
        </p>
      </div>
    </div>
  </div>
);

const SelectedPackages = ({ selectedPackages }) => {
  if (!selectedPackages || selectedPackages.length === 0) {
    return (
      <div className="w-full bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 relative">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-800 font-cairo text-center">
            الباقات المختارة
          </h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500 font-cairo text-lg">
            لم يتم اختيار أي باقات. يرجى العودة لاختيار الباقات.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-cairo"
          >
            العودة لاختيار الباقات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 relative">
      <div className="p-4 md:p-6 ">
        <h2 className="text-lg md:text-2xl font-semibold text-normalblue  font-cairo text-center">
          الباقات المختارة ({selectedPackages.length})
        </h2>
      </div>
      <div className="max-h-96 md:max-h-80 lg:max-h-96 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {selectedPackages.map((pkg, index) => (
            <React.Fragment key={pkg.id || index}>
              <PackageItem
                title={pkg.name || `باقة ${index + 1}`}
                price={`${pkg.finalPrice || 0} ريال`}
                icon={getPackageIcon(pkg.subjects)}
                showDatePicker={true}
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

const PackageItem = ({ title, price, icon, showDatePicker, status }) => (
  <div className="flex flex-col items-start justify-between gap-4">
    <div className="w-full flex flex-col  gap-3 justify-between ">
      <div className=" flex items-center gap-3 justify-start lg:justify-start">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
          <img
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
            alt="Package"
            src={icon}
          />
        </div>
        <div className=" lg:text-left">
          <div className="font-cairo font-semibold text-base text-gray-800">
            {title}
          </div>
        </div>
      </div>
      <div className="flex  gap-2">
        <p className="font-cairo font-semibold text-normalblue  text-md">
          سعر الباقة: <span className="text-md">{price}</span>
        </p>
      </div>
    </div>
    <div className="w-full lg:w-auto">
      {showDatePicker ? (
        <div className="flex flex-col   gap-4">
          <div className="font-cairo font-semibold text-gray-800 text-sm md:text-base">
            اختر موعد بداية الباقة:
          </div>
          <div className="flex-1 flex items-center gap-2 p-3 border border-gray-400 rounded-full">
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Calendar"
              src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1410117192.svg"
            />
            <span className="font-cairo text-sm text-gray-700 flex-1 ">
              السبت 09 -08 - 2025
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="font-cairo font-semibold text-gray-800 text-sm md:text-base">
            اختر موعد بداية الباقة:
          </div>
          <div className="flex items-center gap-2 p-3 border border-gray-400 rounded-full">
            <span className="font-cairo text-sm text-orange-600">{status}</span>
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Calendar"
              src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1410117192.svg"
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const DiscountBar = ({ totalPrice, onApply }) => (
  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white rounded-xl ">
    <div className="w-full">
      <div className="text-lg md:text-xl font-semibold text-gray-800 font-cairo mb-4">
        هل لديك كود خصم؟
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="flex items-center gap-3 p-2 px-4 border border-dashed border-blue-800 rounded-full">
            <img
              className="w-5 h-5 md:w-6 md:h-6"
              alt="Apply"
              src="https://c.animaapp.com/mf3u5boioWZVpp/img/filled.svg"
            />
            <input
              type="text"
              placeholder="أدخل كود الخصم"
              className="flex-1 font-cairo outline-none bg-transparent"
              defaultValue="hggg76789e"
            />
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={onApply}
            >
              <img
                className="w-5 h-5 md:w-6 md:h-6"
                alt="Discount"
                src="https://c.animaapp.com/mf3u5boioWZVpp/img/group.png"
              />
            </button>
          </div>
        </div>
        <div className="text-xl md:text-2xl font-bold text-subtext font-cairo">
          الاجمالي: {totalPrice} ريال
        </div>
      </div>
    </div>
  </div>
);

const Actions = ({ onSubmitTrial, onPay }) => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 mt-8">
    <button
      onClick={onSubmitTrial}
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 border-2 border-orangedeep rounded-full text-deepbg-orangedeep font-semibold hover:bg-orange-50 transition-colors"
    >
      <img
        className="w-5 h-5 md:w-6 md:h-6"
        alt="Icon"
        src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame.svg"
      />
      <span className="font-cairo text-base md:text-lg">
        بدء الفترة التجريبية
      </span>
    </button>
    <button
      onClick={onPay}
      className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-2 bg-orangedeep rounded-full text-white font-semibold hover:bg-orange-600 transition-colors"
    >
      <img
        className="w-5 h-5 md:w-6 md:h-6"
        alt="Icon"
        src="https://c.animaapp.com/mf3u5boioWZVpp/img/left-2.png"
      />
      <span className="font-cairo text-base md:text-lg">ادفع الان</span>
    </button>
  </div>
);

export default Checkout;
