import { useTranslation } from "react-i18next";
import { Cross } from "../../../../utils/icons";
import Button from "../../../ui/Button";

const EmailRequiredModal = ({ onClose, onNavigateToProfile }) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-screen max-w-md bg-white rounded-2xl p-6 shadow-lg z-50">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Title */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 text-center font-cairo">
          {t("emailRequired.title")}
        </h2>
      </div>

      {/* Separator line */}
      <div className="mt-4 border-t border-dashed border-gray-300"></div>

      {/* Message */}
      <div className="mt-6">
        <p className="text-center text-gray-700 text-base font-cairo">
          {t("emailRequired.message")}
        </p>
      </div>

      {/* Profile Button */}
      <div className="flex justify-center items-center mt-8">
        <button
          onClick={() => {
            if (onNavigateToProfile) {
              onNavigateToProfile();
            }
            onClose();
          }}
          className="w-full bg-orangedeep hover:cursor-pointer text-navyteal font-bold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2"
        >
          {/* <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg> */}
          <span className="text-navyteal font-bold font-cairo">الملف الشخصي</span>
        </button>
      </div>
    </div>
  );
};

export default EmailRequiredModal;
