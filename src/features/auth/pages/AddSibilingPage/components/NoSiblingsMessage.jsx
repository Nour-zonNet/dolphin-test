import React from "react";
import { LeftArrow } from "@/utils/icons";
import { Link } from "react-router-dom";

const NoSiblingsMessage = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200 mt-4">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-gray-800 text-lg mb-2 [font-family:'Cairo',Helvetica]">
        لا يوجد إخوة
      </h3>
      <p className="text-status text-sm [font-family:'Cairo',Helvetica]">
        يمكنك إضافة إخوة لاحقاً من خلال الإعدادات
      </p>
      <Link
        className="cursor-pointer w-full py-2 sm:py-3 flex items-center justify-center gap-2 px-4 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors mt-4"
        to="/"
      >
        <LeftArrow color="#061A2F" />
        <span className="font-semibold text-navyteal text-sm sm:text-base md:text-lg [font-family:'Cairo',Helvetica]">
          متابعة
        </span>
      </Link>
    </div>
  );
};

export default NoSiblingsMessage;
