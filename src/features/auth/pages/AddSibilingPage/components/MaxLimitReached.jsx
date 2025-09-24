import React from "react";
import { Link } from "react-router-dom";
import { LeftArrow } from "@/utils/icons";

const MaxLimitReached = ({ currentCount = 3 }) => {
  return (
    <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-200 mt-4">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-orange-400 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-orange-800 text-lg mb-2 [font-family:'Cairo',Helvetica]">
        تم الوصول للحد الأقصى
      </h3>
      <p className="text-orange-700 text-sm [font-family:'Cairo',Helvetica]">
        لديك {currentCount} إخوة - لا يمكن إضافة أكثر من 3 إخوة
      </p>
      <Link
        className="cursor-pointer w-full py-2 sm:py-3 flex items-center justify-center gap-2 px-4 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors mt-4"
        to="/main-packages"
      >
        <LeftArrow color="#061A2F" />
        <span className="font-semibold text-navyteal text-sm sm:text-base md:text-lg [font-family:'Cairo',Helvetica]">
          متابعة
        </span>
      </Link>
    </div>
  );
};

export default MaxLimitReached;
