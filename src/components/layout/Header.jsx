import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Balance, RightArrow } from "@/utils/icons";

export const Header = ({ title, balance, showBalanceSection = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // go to previous page in history
  };

  return (
    // <div className="w-full relative bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-8">
    <div className=" py-4 md:py-6 lg:py-8 shadow-sm">
      <div className="w-[90%] mx-auto flex items-center md:items-center justify-between">
        {/* Back Button */}
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="outline-0 border border-bordercolor md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center"
        >
          <RightArrow className="w-[20px] md:w-[40px]" />
        </button>

        {/* Centered Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-navyteal md:text-2xl text-[16px]">
          {title}
        </h1>

        {/* Right Section (optional) */}
        {showBalanceSection && (
          <div className="flex items-center flex-row gap-2">
            <div className="flex items-center gap-2">
              <Balance className="w-4 md:w-6" />
              <p className="font-bold text-navyteal md:text-xl text-xs">
                الرصيد
              </p>
            </div>
            <span className="font-bold text-navyteal md:text-2xl text-xs">
              {balance} ريال
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
