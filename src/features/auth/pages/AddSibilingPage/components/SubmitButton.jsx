import React from "react";
import { LeftArrow } from "@/utils/icons";

const SubmitButton = ({ isSubmitting, onSubmit }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      onClick={onSubmit}
      className={`cursor-pointer w-full py-2 sm:py-3 flex items-center justify-center gap-2 px-4 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors mt-4 ${
        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {isSubmitting ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <LeftArrow color="#061A2F" />
      )}
      <span className="font-semibold text-navyteal text-sm sm:text-base md:text-lg [font-family:'Cairo',Helvetica]">
        {isSubmitting ? "جاري الإضافة..." : "حفظ ومتابعة"}
      </span>
    </button>
  );
};

export default SubmitButton;
