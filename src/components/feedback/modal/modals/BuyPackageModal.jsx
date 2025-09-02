import React from "react";
import { Cross, CreditCard, Package, Calendar } from "@/utils/icons";

const BuyPackageModal = ({ onClose, packageData = {}, isExtendMode = false }) => {

  console.log(packageData)
  // Generate features based on package data
  const features = [
    `${packageData.durationText} اشتراك`,
    packageData.weeklyClasses > 0 && `${packageData.weeklyClasses} حصص أسبوعياً`,
    packageData.monthlyClasses > 0 && `${packageData.monthlyClasses} حصص شهرية`,
    packageData.trial_days > 0 && `${packageData.trial_days} أيام تجريبية`,
    packageData.subjects.length > 0 && `مادة: ${packageData.subjects.map(s => s.name).join("، ")}`,
    packageData.times.length > 0 && `تبدأ في: ${new Date(packageData.times[0].start_date).toLocaleDateString('ar-SA')}`
  ].filter(Boolean);

  const handlePurchase = () => {
    // Handle purchase logic here
    console.log(`${isExtendMode ? 'Extending' : 'Purchasing'} package:`, packageData);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Cross width={20} height={20} />
        </button>
        <div className="flex items-center space-x-3 space-x-reverse">
          <h2 className="text-xl font-bold text-gray-900">
            {isExtendMode ? "تمديد الباقة" : "شراء الباقة"}
          </h2>
        </div>
        <div></div>
      </div>

      {/* Package Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-navyteal mb-2">{ packageData.name}</h3>
          <div className="flex items-center justify-end space-x-2 space-x-reverse mb-4">
            <span className="text-base font-bold text-blue-600">{ packageData.finalPrice} ريال</span>
            { packageData.discountPercentage > 0 &&  packageData.originalPrice >  packageData.finalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{ packageData.originalPrice} ريال</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  خصم { packageData.discountPercentage}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">المميزات:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 space-x-reverse text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
          { packageData.canUseWallet === "yes" && (
            <div className="mt-2 flex items-center space-x-2 space-x-reverse p-3 border border-gray-200 rounded-lg">
              <span className="text-gray-700">استخدام رصيد المحفظة</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 space-x-reverse p-6 border-t border-gray-200">
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
          {isExtendMode ? "تمديد الباقة" : "شراء الباقة"}
        </button>
      </div>
    </div>
  );
};

export default BuyPackageModal;