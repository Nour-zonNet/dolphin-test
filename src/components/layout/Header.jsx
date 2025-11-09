import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { Balance, RightArrow } from "@/utils/icons";
import infoIcon from "@/assets/images/info.svg";
// import FormatWithCurrency from "@/utils/FormatWithCurrency";

export const Header = ({
  title,
  // balance,
  onBack,
  supTitle,
  showBalanceSection = true,
  showArrow = true,
  showInfo = false,
  onInfoClick,
}) => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-5 md:py-8">
      <div className="px-4 md:px-10 mx-auto grid grid-cols-3 items-center">
        {/* Back Button */}
        <div className="flex justify-start">
          {showArrow && (
            <button
              onClick={() => navigate(onBack)}
              className="outline-0 border border-bordercolor md:w-[60px] md:h-[60px] w-[35px] h-[35px] rounded-full flex items-center justify-center cursor-pointer"
            >
              <RightArrow className="w-[20px] md:w-[40px]" />
            </button>
          )}
        </div>

        {/* Centered Title */}
        <div>
          <h1 className="font-bold text-navyteal md:text-2xl text-sm text-center">
            {title}
          </h1>
          <h3 className="font-bold text-nowrap text-orangedeep md:text-2xl text-sm text-center">
            {supTitle}
          </h3>
        </div>

        {/* Right Section (optional) */}
        <div className="flex justify-end">
          {showBalanceSection && (
            <div className="flex items-center gap-2">
              {/* <Balance className="w-4 md:w-6" /> */}
              {/* <span className="font-bold flex items-center gap-2 text-navyteal md:text-2xl text-[16px]">
            الرصيد:
            <FormatWithCurrency
              amount={balance}
              className="font-bold flex items-center gap-1 text-navyteal md:text-2xl text-[16px]"
              symbolClass="w-5 h-5 md:w-8 md:h-8 xl:w-10 xl:h-10"
              symbolFill="#08233f"
            />
          </span> */}
            </div>
          )}
        {showInfo && (
          <button
            onClick={onInfoClick}
            className="cursor-pointer outline-0 border-0 bg-transparent p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Info"
          >
            <img src={infoIcon} alt="info" className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default Header;
