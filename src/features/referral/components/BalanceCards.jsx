import React from "react";
import { useModal } from "@/components/feedback/modal/useModal";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import coinIcon from "@/assets/images/cions.png";
import hourglassIcon from "@/assets/images/sand-clock.png";

const BalanceCards = () => {
  const { openWithdrawModal } = useModal();
  // TODO: Get from API
  const pendingBalance = 10;
  const withdrawableBalance = 50;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
        {/* Withdrawable Balance Card */}
        <div
          onClick={openWithdrawModal}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl p-5 bg-[rgba(232,240,244,0.5)] cursor-pointer hover:bg-[rgba(232,240,244,0.7)] transition-colors"
        >
        {/* Coins Icon */}
        <img src={coinIcon} alt="coin" className="w-12 md:w-auto" />
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-sm md:text-base lg:text-lg text-black">
            الرصيد القابل للسحب
          </span>
          <FormatWithCurrency
            amount={withdrawableBalance}
            fractionDigits={0}
            className="text-[#2E7D32] font-bold text-sm md:text-base lg:text-lg"
            symbolFill="#2E7D32"
            symbolClass="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
          />
        </div>
      </div>

      {/* Pending Balance Card */}
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl p-5 bg-[rgba(250,235,214,0.5)]">
        {/* Hourglass Icon */}
        <div className="">
          <img src={hourglassIcon} alt="hourglass" className="" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-sm md:text-base lg:text-lg text-black">
            الرصيد المعلق
          </span>
          <FormatWithCurrency
            amount={pendingBalance}
            fractionDigits={0}
            className="text-[#2E7D32] font-bold text-sm md:text-base lg:text-lg"
            symbolFill="#2E7D32"
            symbolClass="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceCards;

