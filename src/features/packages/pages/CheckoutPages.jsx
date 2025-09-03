import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { useSubscriptions } from "../../subscription/hooks/useSubscriptions";

// Helper function to get package icon based on subjects
const getPackageIcon = (subjects) => {
  if (!subjects || subjects.length === 0)
    return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file-2.png";
  const subjectName = subjects[0].name;
  switch (subjectName) {
    case "البرمجة":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--1--1.png";
    case "الرياضيات":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file-2.png";
    case "العلوم":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--3--1.png";
    case "اللغة العربية":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--3--1.png";
    case "اللغة الإنجليزية":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--1--1.png";
    default:
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file-2.png";
  }
};

// Main Screen Component
export const Checkout = () => {
  const location = useLocation();
  const [discountApplied, setDiscountApplied] = useState(false);
  const { createTrialSubscription } = useSubscriptions();
  const { openStatusModal } = useModal();

  // Get selected packages data from navigation state
  const { selectedPackages = [], totalPrice = 0 } = location.state || {};
  useEffect(() => {
    console.log(selectedPackages);
  }, [selectedPackages]);
  const onSubmit = async () => {
    await createTrialSubscription(
      selectedPackages.map((sub) => ({
        package_id: sub.id,
        start_date: null,
      }))
    );
    onPay();
  };

  const onPay = () => {
    openStatusModal(MODAL_TYPES.SUCCESS, {
      title: "تم الدفع بنجاح",
      message: "شكراً لك! تم تأكيد عملية الدفع وسيتم تفعيل الباقات المختارة.",
      onClose: () => console.log("closed"),
    });
  };
  return (
    <div className="relative min-h-screen bg-white" data-model-id="2176:1306">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full h-16 md:h-20 lg:h-24 bg-white shadow-sm">
        <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">
          <img
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
            alt="قائمة"
            src="https://c.animaapp.com/mf3u5boioWZVpp/img/---.svg"
          />
          <h1 className="text-xl md:text-2xl font-bold text-[#08233f] font-cairo  flex-1 text-center">
            شراء الباقة
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <GroupWrapper />
        <Frame selectedPackages={selectedPackages} />
        <Group
          setDiscountApplied={setDiscountApplied}
          totalPrice={totalPrice}
        />
        <FrameWrapper onSubmitTrial={onSubmit} onPay={onPay} />
      </main>

      {/* Success Message */}
      {discountApplied && (
        <div className="fixed bottom-20 right-4 md:right-8 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-cairo text-sm md:text-base text-center z-40">
          تم تفعيل كود الخصم بنجاح
        </div>
      )}

      {/* Floating Action Button */}
      <img
        className="fixed w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bottom-4 right-4 md:bottom-8 md:right-8 z-30"
        alt="زر الإجراء"
        src="https://c.animaapp.com/mf3u5boioWZVpp/img/fab.svg"
      />
    </div>
  );
};

// GroupWrapper Component
export const GroupWrapper = () => {
  return (
    <div className="flex flex-row items- justify-between gap-6   ">
      {/* Balance Info */}
      <div className="relative w-64 lg:w-64 xl:w-72 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            className="w-full h-full object-contain"
            alt="Vector"
            src="https://c.animaapp.com/mf3u5boioWZVpp/img/vector.svg"
          />
        </div>
        <div className="relative z-10">
          <div className="text-lg md:text-xl font-semibold text-blue-800 font-cairo  mb-2">
            رصيد محفظتك
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-blue-600 font-cairo ">
            1000 ريال
          </div>
        </div>
      </div>

      {/* Text Info */}
      <div className="flex-1 space-y-3 ">
        <div className="flex items-center justify-start gap-2">
          <img
            className="w-5 h-5 md:w-6 md:h-6"
            alt="Info"
            src="https://c.animaapp.com/mf3u5boioWZVpp/img/frame-1.svg"
          />
          <div className="text-lg md:text-xl font-semibold text-blue-700 font-cairo">
            رصيدك الحالي متاح للاستخدام
          </div>
        </div>

        <div className="flex items-center justify-start gap-2">
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
};

// FrameWrapper Component (Buttons)
export const FrameWrapper = ({ onSubmitTrial, onPay }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 mt-8">
      {/* Outline Button */}
      <button
        onClick={onSubmitTrial}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border-2 border-orange-400 rounded-full text-deepbg-orangedeep font-semibold hover:bg-orange-50 transition-colors"
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

      {/* Primary Button */}
      <button
        onClick={onPay}
        className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 bg-orangedeep rounded-full text-white font-semibold hover:bg-orange-600 transition-colors"
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
};

// Frame Component (Packages)
export const Frame = ({ selectedPackages = [] }) => {
  // If no packages selected, show message
  if (selectedPackages.length === 0) {
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
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-800 font-cairo text-center">
          الباقات المختارة ({selectedPackages.length})
        </h2>
      </div>

      {/* Packages List - Scrollable Container */}
      <div className="max-h-96 md:max-h-80 lg:max-h-96 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {selectedPackages.map((packageItem, index) => (
            <React.Fragment key={packageItem.id || index}>
              <PackageItem
                title={packageItem.name || `باقة ${index + 1}`}
                price={`${packageItem.finalPrice || 0} ريال`}
                icon={getPackageIcon(packageItem.subjects)}
                showDatePicker={true}
              />
              {index < selectedPackages.length - 1 && (
                <div className="border-t border-gray-200 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Custom scrollbar styling for webkit browsers */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};
// Package Item Component
const PackageItem = ({ title, price, icon, showDatePicker, status }) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4">
      {/* Package Info */}
      <div className="w-full flex items-center gap-3 justify-between ">
        <div className=" flex items-center gap-3 justify-start lg:justify-start">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
            <img
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
              alt="Package"
              src={icon}
            />
          </div>
          <div className=" lg:text-left">
            <div className="font-cairo font-semibold text-lg text-gray-800">
              {title}
            </div>
          </div>
        </div>
        {/* Price */}
        <div className="flex  gap-2">
          <p className="font-cairo font-semibold text-blue-800 text-lg">
            سعر الباقة: <span className="text-xl">{price}</span>
          </p>
        </div>
      </div>

      {/* Date Picker or Status */}
      <div className="w-full lg:w-auto">
        {showDatePicker ? (
          <div className="flex flex-row items-center gap-4">
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
              <span className="font-cairo text-sm text-orange-600">
                {status}
              </span>
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
};

// Group Component (Discount)
export const Group = ({ setDiscountApplied, totalPrice = 0 }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-4 md:p-6 bg-white rounded-xl shadow-sm">
      {/* Discount Section */}
      <div className="w-full">
        <div className="text-lg md:text-xl font-semibold text-gray-800 font-cairo  mb-4">
          هل لديك كود خصم؟
        </div>

        <div className="flex items-center justify-between space-x-10">
          <div className="relative flex-1">
            <div className="flex items-center gap-3 p-4 border border-dashed border-blue-800 rounded-full">
              <img
                className="w-5 h-5 md:w-6 md:h-6"
                alt="Discount"
                src="https://c.animaapp.com/mf3u5boioWZVpp/img/group.png"
              />
              <input
                type="text"
                placeholder="أدخل كود الخصم"
                className="flex-1 font-cairo  outline-none bg-transparent"
                defaultValue="hggg76789e"
              />
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setDiscountApplied(true)}
              >
                <img
                  className="w-5 h-5 md:w-6 md:h-6"
                  alt="Apply"
                  src="https://c.animaapp.com/mf3u5boioWZVpp/img/filled.svg"
                />
              </button>
            </div>
          </div>
          {/* Total Price */}
          <div className="text-xl md:text-2xl font-bold text-blue-800 font-cairo">
            الاجمالي: {totalPrice} ريال
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
