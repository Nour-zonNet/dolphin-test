import React from "react";
import { Link } from "react-router-dom";
import { RightArrow } from "../../../utils/icons";
import { HomeKite } from "../../../utils/Illustrations";

const HeaderIllustration = ({handleBack}) => {
  // h-26 sm:h-32 md:h-40 lg:h-48
  return (
    <div className="relative ">
      {/* زر السهم (Responsive sizes) */}
      <div
        onClick={()=> handleBack()}
        className="
          absolute right-0 top-0 mx-4 sm:mx-4 md:mx-6 lg:mx-20  my-6 sm:my-6 md:my-12 lg:my-15 
          border-[0.5px] border-bordercolor
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
          rounded-full flex items-center justify-center
        "
      >
          <RightArrow  className="w-5 h-5 sm:w-6  md:w-7 lg:w-10 " />
      </div>

      {/* HomeKite في النص وبأحجام مرنة */}
      <div className="absolute  left-0 lg:left-10 mx-4 flex justify-end ">
        <HomeKite className="w-45 sm:w-73 md:w-80 lg:w-120 h-auto" />
      </div>
    </div>
  );
};

export default HeaderIllustration;
