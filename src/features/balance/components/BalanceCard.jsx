import React from "react";
import { useSelector } from "react-redux";
import card from "@/assets/balance/card.webp";
import FormatWithCurrency from '@/utils/FormatWithCurrency';

const BalanceCard = ({ user }) => {
  const { currentBalance } = useSelector((state) => state.balance);
  
  return (
    <div className="flex items-center justify-center w-[90%] md:w-[60%] xl:w-[35%] mx-auto mb-10">
        <div className="relative inline-block mt-6 md:mt-12 px-4 mx-auto">
        {/* The card image */}
        <div className="flex items-center justify-center">
          <img
              src={card}
              alt="Balance Card"
              className="w-full"
          />
        </div>

        {/* Centered text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-base md:text-lg lg:text-2xl font-semibold text-white">الرصيد الحالي</h2>
            <h2 className="text-base md:text-lg lg:text-[32px] font-bold text-orangedeep mt-0 md:mt-2 flex gap-2 md:gap-4 items-center">
              <FormatWithCurrency
                amount={currentBalance}
                fractionDigits={0}
                className="flex items-center gap-2"
                symbolFill="#e89b32"
                symbolClass="w-4 md:w-6 lg:w-8"
              />
            </h2>
        </div>

        {/* Bottom-right text */}
        <div className="absolute bottom-2 md:bottom-10 right-10">
            <p className="text-sm md:text-lg xl:text-[32px] font-bold text-white">{user?.name || "—"}</p>
            <p className="text-sm md:text-lg xl:text-[28px] font-normal text-white mt-2">{user?.phoneNumber || "—"}</p>
        </div>
        </div>
    </div>
  );
};

export default BalanceCard;
