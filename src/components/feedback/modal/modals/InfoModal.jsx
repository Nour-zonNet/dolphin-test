import { Cross } from "../../../../utils/icons";
import Button from "../../../ui/Button";

const InfoModal = ({ 
  open, 
  onClose, 
  title, 
  description, 
  actions = [], 
  className = "" 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className={`relative w-full max-w-md bg-white rounded-2xl p-6 shadow-lg mx-10 ${className}`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <Cross width="14" height="14" />
        </button>

        {/* Header */}
        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center font-cairo">
            {title}
          </h2>
        </div>

        {/* Description */}
        {description && (
          <div className="mt-4">
            <p className="text-center text-gray-700 text-base md:text-lg font-cairo">
              {description}
            </p>
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className={`mt-8 flex ${actions.length === 1 ? 'justify-center' : 'justify-between'} gap-3`}>
            {actions.map((action, index) => (
              <Button
                key={index}
                text={action.label}
                onClick={action.onClick}
                className={action.className || ""}
                {...action.props}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal;
