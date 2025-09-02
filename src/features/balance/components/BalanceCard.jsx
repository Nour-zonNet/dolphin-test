import React from "react";
import card from "@/assets/balance/card.svg";

const BalanceCard = () => {
  return (
    <div className="flex items-center justify-center">
        <div className="relative inline-block mt-12 px-4 mx-auto">
        {/* The card image */}
        <img
            src={card}
            alt="Balance Card"
            className=""
        />

        {/* Centered text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-lg md:text-2xl font-semibold text-white">الرصيد الحالي</h2>
            <h2 className="text-xl md:text-[32px] font-bold text-orangedeep mt-2">0 ريال</h2>
        </div>

        {/* Bottom-right text */}
        <div className="absolute bottom-10 right-10">
            <p className="text-xl md:text-[32px] font-bold text-white">يوستينا صلاح</p>
            <p className="text-lg md:text-[28px] font-normal text-white mt-2">966522345678</p>
        </div>
        </div>
    </div>
  );
};

export default BalanceCard;
