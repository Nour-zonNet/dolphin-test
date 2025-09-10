import React from "react";
import card from "@/assets/balance/card.svg";
import { Riyal } from "@/utils/Illustrations";

const BalanceCard = ({ user }) => {
  return (
    <div className="flex items-center justify-center w-[90%] mx-auto">
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
            <h2 className="text-base md:text-2xl font-semibold text-white">الرصيد الحالي</h2>
            <h2 className="text-base md:text-[32px] font-bold text-orangedeep mt-0 md:mt-2 flex gap-2 md:gap-4 items-center">
              <span>0</span> 
              <Riyal className="w-4 md:w-6 lg:w-8"/>
            </h2>
        </div>

        {/* Bottom-right text */}
        <div className="absolute bottom-2 md:bottom-10 right-10">
            <p className="text-sm md:text-[32px] font-bold text-white">{user?.name || "—"}</p>
            <p className="text-sm md:text-[28px] font-normal text-white mt-2">{user?.phoneNumber || "—"}</p>
        </div>
        </div>
    </div>
  );
};

export default BalanceCard;
