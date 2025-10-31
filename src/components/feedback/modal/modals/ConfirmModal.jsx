import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Cross, Check, Info, CorrectCircle, WalletGray } from "../../../../utils/icons";
import Button from "../../../ui/Button";
import myFatoorahIcon from "../../../../assets/packages/myfatoorah.png";

const ConfirmModal = ({ onClose, onConfirm, modalData = {} }) => {
  const {
    title = "طلب إعادة تفعيل الاشتراك",
    message = "هل أنت متأكد من رغبتك في إرسال طلب إعادة تفعيل الاشتراك؟ سيتم مراجعة طلبك من قبل فريق العمل وسيتم إعادة التفعيل قريباً.",
    confirmText = "تأكيد الإرسال",
    showPaymentMethods = false,
  } = modalData;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('myfatoorah');

  const handleConfirm = () => {
    const confirmData = showPaymentMethods ? { paymentMethod: selectedPaymentMethod } : undefined;
    if (onConfirm) onConfirm(confirmData);
    onClose();
  };

  return (
    <div className="relative w-screen max-w-md bg-white rounded-2xl p-6 shadow-lg">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100"
      >
        <Cross width="16" height="16" />
      </button>

      {/* Icon + Title */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Info width="20" height="20" className="text-blue-500" />
        </div>
        <h2 className="mt-4 font-bold text-gray-800 text-lg md:text-xl text-center font-cairo">
          {title}
        </h2>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-300 my-4 w-full" />

      {/* Message */}
      <p className="text-center text-gray-700 text-base leading-relaxed font-cairo">
        {message}
      </p>

      {/* Payment Method Selection */}
      {showPaymentMethods && (
        <>
          <p className="text-center text-gray-700 text-base leading-relaxed font-cairo mt-4">
            برجاء اختيار طريقة الدفع لإتمام العملية:
          </p>
          <div className="space-y-3 mt-4">
            {/* MyFatoorah Payment Option */}
            <div 
              className={`flex items-center p-3 rounded-full border-2 cursor-pointer transition-all ${
                selectedPaymentMethod === 'myfatoorah' 
                  ? 'border-orangedeep' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentMethod('myfatoorah')}
            >
              <div className={`w-4 h-4 rounded-full border-2 me-3 flex items-center justify-center ${
                selectedPaymentMethod === 'myfatoorah' 
                  ? 'border-orangedeep bg-orangedeep' 
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'myfatoorah' && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              {/* <span className="text-sm font-medium text-gray-800 flex-1">
                الدفع من خلال ماي فاتورة
              </span> */}
              <span className="text-sm font-medium text-gray-800 flex-1">ادفع الآن</span>
              <img
                className="w-12 h-6 object-contain me-2"
                alt="MyFatoorah"
                src={myFatoorahIcon}
              />
            </div>

            {/* Wallet Payment Option */}
            <div 
              className={`flex items-center p-3 rounded-full border-2 cursor-pointer transition-all ${
                selectedPaymentMethod === 'wallet' 
                  ? 'border-orangedeep' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentMethod('wallet')}
            >
              <div className={`w-4 h-4 rounded-full border-2 me-3 flex items-center justify-center ${
                selectedPaymentMethod === 'wallet' 
                  ? 'border-orangedeep bg-orangedeep' 
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'wallet' && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">
                الدفع من خلال المحفظة
              </span>
              <div className="me-2">
                <WalletGray className="w-6 h-6" fill="#1B648E" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm Button */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleConfirm}
          icon={<CorrectCircle color="#E89B32" fill="black" />}
          text={confirmText}
        />
      </div>
    </div>
  );
};

export default ConfirmModal;
