import React from "react";
import { Cross, CreditCard, Package, Calendar } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";

const BuyPackageModal = ({ onClose, packageData = [], isExtendMode = false }) => {
  // Handle both single package (object) and multiple packages (array)
  const packages = Array.isArray(packageData) ? packageData : [packageData];
  const isMultiple = packages.length > 1;

  // Calculate total price
  const totalPrice = packages.reduce((total, pkg) => total + (pkg.finalPrice || 0), 0);
  const totalOriginalPrice = packages.reduce((total, pkg) => total + (pkg.originalPrice || 0), 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  // Generate features for multiple packages
  const allFeatures = packages.flatMap((pkg, index) => [
    isMultiple && `الباقة ${index + 1}: ${pkg.name}`,
    `${pkg.durationText} اشتراك`,
    pkg.weeklyClasses > 0 && `${pkg.weeklyClasses} حصص أسبوعياً`,
    pkg.monthlyClasses > 0 && `${pkg.monthlyClasses} حصص شهرية`,
    pkg.trial_days > 0 && `${pkg.trial_days} أيام تجريبية`,
    pkg.subjects?.length > 0 && `مادة: ${pkg.subjects.map(s => s.name).join("، ")}`,
    pkg.times?.length > 0 && `تبدأ في: ${new Date(pkg.times[0].start_date).toLocaleDateString('ar-SA')}`
  ].filter(Boolean));

  const uniqueFeatures = [...new Set(allFeatures)];

  const handlePurchase = () => {
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Cross width={20} height={20} />
        </button>
        <div className="flex items-center space-x-3 space-x-reverse">
          <h2 className="text-xl font-bold text-gray-900">
            {isExtendMode ? "تمديد الباقات" : "شراء الباقات"}
          </h2>
          {isMultiple && (
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {packages.length} باقات
            </span>
          )}
        </div>
        <div></div>
      </div>

      {/* Package Details */}
      <div className="p-6">
        {/* Package List */}
        {isMultiple && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">الباقات المحددة:</h4>
            <div className="space-y-3">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id || index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">
                    {index + 1}. {pkg.name}
                  </span>
                  <FormatWithCurrency
                    amount={pkg.finalPrice}
                    className="text-blue-600 font-medium"
                    symbolFill="#155dfc"
                    symbolClass="w-4 h-4 md:w-5 md:h-5"
                    fractionDigits={0} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
          <div>
            <h3 className="font-bold text-gray-900">المجموع:</h3>
            {totalDiscount > 0 && (
              <p className="text-sm text-green-600">
                وفرت{" "}
                <FormatWithCurrency
                  amount={totalDiscount}
                  className="text-green-600 font-medium"
                  symbolFill="#155dfc"
                  symbolClass="w-4 h-4 md:w-5 md:h-5"
                  fractionDigits={0}
                />
              </p>
            )}
          </div>
          <div className="text-right">
            <FormatWithCurrency
              amount={totalPrice}
              className="text-xl font-bold text-blue-600"
              symbolFill="#155dfc"
              symbolClass="w-4 h-4 md:w-5 md:h-5"
              fractionDigits={0}
            />

            {totalDiscount > 0 && (
              <FormatWithCurrency
                amount={totalOriginalPrice}
                className="text-sm text-gray-400 line-through"
                symbolFill="#155dfc"
                symbolClass="w-4 h-4 md:w-5 md:h-5"
                fractionDigits={0}
              />
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">المميزات:</h4>
          <ul className="space-y-2">
            {uniqueFeatures.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 space-x-reverse text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">طريقة الدفع:</h4>
          <div className="flex items-center space-x-2 space-x-reverse p-3 border border-gray-200 rounded-lg">
            <CreditCard width={20} height={20} />
            <span className="text-gray-700">بطاقة ائتمان / مدى</span>
          </div>
          {packages.some(pkg => pkg.canUseWallet === "yes") && (
            <div className="mt-2 flex items-center space-x-2 space-x-reverse p-3 border border-gray-200 rounded-lg">
              <span className="text-gray-700">استخدام رصيد المحفظة</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 space-x-reverse p-6 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={handlePurchase}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {isExtendMode ? "تمديد الباقات" : `شراء الباقات (${packages.length})`}
        </button>
      </div>
    </div>
  );
};

export default BuyPackageModal;