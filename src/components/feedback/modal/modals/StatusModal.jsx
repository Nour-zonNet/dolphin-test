import { MODAL_TYPES } from "../../../../constants/MODAL_TYPES";
import { CorrectCircle, Cross } from "../../../../utils/icons";
import { useTranslation } from "react-i18next";
import Button from "../../../ui/Button";
import successImg from "../../../../assets/modal/successModal.svg"
import failImg from "../../../../assets/modal/warningModal.svg"

const   StatusModal = ({ type, onClose, title, message }) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-lg mx-10">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100"
      >
        <Cross width="14" height="14" />
      </button>

      {/* Image + Head */}
      <div className="flex flex-col items-center mt-6">
        <img className="w-40 h-auto" alt={type} src={type == MODAL_TYPES.SUCCESS  ? successImg : failImg } />
        <h2
          className={`mt-4 font-bold ${type == MODAL_TYPES.SUCCESS  ?"text-green-500" : "text-red-500"} text-xl md:text-2xl text-center font-cairo`}
        >
          {title}
        </h2>
      </div>
      
      {/* Message */}
      <p className="mt-6 text-center text-gray-700 text-base md:text-lg font-cairo">
        {message}
      </p>

      {/* Button */}
      <div className="flex justify-center items-center mt-8">
        <Button onClick={onClose} icon={<CorrectCircle color="#E89B32" fill="black" />} text={t('common.ok')} />
      </div>
    </div>
  );
};

export default StatusModal;
