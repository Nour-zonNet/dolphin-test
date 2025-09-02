import React from "react";
import { Cross, CreditCard, Package, Calendar } from "@/utils/icons";

const BuyPackageModal = ({ onClose, packageData = {}, isExtendMode = false }) => {
  const {
    name = "الباقة الأساسية",
    price = 99,
    duration = "3 أشهر",
    features = ["دروس يومية", "تمارين تفاعلية", "شهادة إتمام"],
    originalPrice = 149,
    discount = "33%"
  } = packageData;

  const handlePurchase = () => {
    // Handle purchase logic here
    console.log(`${isExtendMode ? 'Extending' : 'Purchasing'} package:`, packageData);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Package width={24} height={24} />
          <h2 className="text-xl font-bold text-gray-900">
            {isExtendMode ? "تمديد الباقة" : "شراء الباقة"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Cross width={20} height={20} />
        </button>
      </div>

      {/* Package Details */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
          <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
            <span className="text-3xl font-bold text-blue-600">{price} ريال</span>
            {originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{originalPrice} ريال</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  خصم {discount}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-gray-600">
            <Calendar width={16} height={16} />
            <span>{duration}</span>
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
