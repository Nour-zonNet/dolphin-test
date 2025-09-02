import { Cross, Check, Info } from "../../../../utils/icons";
import Button from "../../../ui/Button";

const ReactivateModal = ({ onClose, onConfirm, subscriptionData = {} }) => {
  const {
    packageName = "باقة الصحة العامة",
    message = "هل أنت متأكد من رغبتك في إرسال طلب إعادة تفعيل الاشتراك؟ سيتم مراجعة طلبك من قبل فريق العمل وسيتم اعادة التفعيل قريباً.",
  } = subscriptionData;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-lg mx-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Info />
        </div>
        <h2 className="text-lg font-bold text-navyteal  mb-2">
          طلب إعادة تفعيل الاشتراك
        </h2>
      </div>

      {/* Package Info */}
      <div className="mb-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 text-center ">
            {packageName}
          </h3>
        </div>
      </div>

      {/* Message */}
      <div className="mb-8">
        <p className="text-navyteal text-xl  leading-relaxed  text-center">
          {message}
        </p>
      </div>

      {/* Action Button */}
        <Button
          onClick={handleConfirm}
          icon={<Check color="#0c2d40" />}
          text="تأكيد الإرسال"
          className="w-full sm:w-full md:w-full lg:w-full  py-3 px-6   "
        />

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm">سيتم إشعارك عند مراجعة الطلب</p>
      </div>
    </div>
  );
};

export default ReactivateModal;
