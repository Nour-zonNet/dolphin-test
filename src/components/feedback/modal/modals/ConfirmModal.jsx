import { Cross, Check } from "../../../../utils/icons";
import Button from "../../../ui/Button";

const ConfirmModal = ({ onClose, onConfirm, modalData = {} }) => {
  const {
    title = "تأكيد الإجراء",
    message = "هل أنت متأكد من رغبتك في تنفيذ هذا الإجراء؟",
    confirmText = "تأكيد",
    cancelText = "إلغاء",
    type = "default", // default, danger, warning
    icon = null,
  } = modalData;

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-800 font-cairo mb-2">
          {title}
        </h2>
        {icon && (
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      <div className="mb-8">
        <p className="text-gray-700 text-base leading-relaxed font-cairo text-center">
          {message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 space-x-reverse">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          {cancelText}
        </button>
        <Button
          onClick={handleConfirm}
          icon={<Check color="white" />}
          text={confirmText}
          className={`flex-1 text-white py-3 px-4 rounded-lg font-medium ${getButtonStyles()}`}
        />
      </div>
    </div>
  );
};

export default ConfirmModal;
