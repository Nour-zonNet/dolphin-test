import React from "react";
import Button from "../../../ui/Button";
import { CorrectCircle, Cross } from "@/utils/icons";
import groupCompletionImg from "@/assets/images/group-completed.png";

const GroupCompletionModal = ({ onClose }) => {
  return (
    <div className="relative w-[90%] mx-auto md:w-screen md:max-w-md lg:max-w-xl bg-white rounded-2xl p-6 z-50">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Cross className="w-2 md:w-4 h-2 md:h-4" />
      </button>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-sm md:text-lg lg:text-xl font-bold text-navyteal">
          معاينة الجدول الاسبوعي
        </h2>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 my-4 border-b border-dashed border-subtext/50"></div>

      {/* Illustration */}
      <div className="flex justify-center items-center py-8">
        <img src={groupCompletionImg} alt="Group Completion" className="w-32 md:w-50 lg:w-60" />
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-navyteal text-sm md:text-lg lg:text-xl font-bold">
          استوفت المجموعة عدد الحصص المحدد
        </p>
      </div>

      {/* Button */}
      {/* <div className="flex justify-center items-center mt-8">
        <Button
          onClick={onClose}
          icon={<CorrectCircle color="#E89B32" fill="black" />}
          text="موافق"
        />
      </div> */}
    </div>
  );
};

export default GroupCompletionModal;
