import { CheckCircle } from "lucide-react";
import { Cross, Check, Info, CorrectCircle } from "../../../../utils/icons";
import Button from "../../../ui/Button";

const ConfirmModal = ({ onClose, onConfirm, modalData = {} }) => {
  const {
    title = "طلب إعادة تفعيل الاشتراك",
    message = "هل أنت متأكد من رغبتك في إرسال طلب إعادة تفعيل الاشتراك؟ سيتم مراجعة طلبك من قبل فريق العمل وسيتم إعادة التفعيل قريباً.",
    confirmText = "تأكيد الإرسال",
  } = modalData;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
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
