import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { Balance, RightArrow } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";

export const Header = ({
  title,
  balance,
  onBack,
  showBalanceSection = true,
}) => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="w-full relative bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-4 md:py-8">
      <div className="w-[90%] mx-auto flex items-center md:items-center justify-between">
        {/* Back Button */}
        <button
          onClick={() => navigate(onBack)}
          className="outline-0 border border-bordercolor md:w-[60px] md:h-[60px] w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer"
        >
          <RightArrow className="w-[20px] md:w-[40px]" />
        </button>

        {/* Centered Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-navyteal md:text-2xl text-sm text-center">
          {title}
        </h1>

        {/* Right Section (optional) */}
        {showBalanceSection && (
          <div className="flex items-center flex-row md:flex-row gap-2">
            <div className="flex items-center gap-2">
              <Balance className="w-4 md:w-6" />
            </div>
            <span className="font-bold flex items-center gap-2 text-navyteal md:text-2xl text-[16px]">
              الرصيد:
              <FormatWithCurrency
                amount={balance}
                className="font-bold flex items-center gap-2 text-navyteal md:text-2xl text-[16px]"
                symbolClass=""
                symbolFill="#08233f"
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
