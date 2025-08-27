import React from "react";
import { Link } from "react-router-dom";
import { Balance, RightArrow } from "../../utils/icons";

export const Header = ({ title, balance }) => {
  return (
    <div className="w-full relative bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-8 px-20 flex items-center justify-between">

      {/* Back Button */}
      <Link
        to="/schedule"
        className="outline-0 border border-bordercolor w-[60px] h-[60px] rounded-full flex items-center justify-center"
      >
        <RightArrow />
      </Link>

      {/* Centered Title */}
      <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-navyteal text-2xl">
        {title}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Balance />
        <p className="font-bold text-navyteal text-xl">{balance}</p>
        <span className="font-bold text-navyteal text-2xl">0 ريال</span>
      </div>
    </div>

  );
};

export default Header;
