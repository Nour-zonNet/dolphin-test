import React from "react";
import { Link } from "react-router-dom";
import { RightArrow } from "../../../utils/icons";
import { HomeKite } from "../../../utils/Illustrations";

const HeaderIllustration = () => {
  return (
    <div className="relative h-26 sm:h-32 md:h-40 lg:h-48">
      {/* زر السهم (Responsive sizes) */}
      <Link
        to="/verify"
        className="
          absolute right-0 top-0 mx-6 my-12
          border-[0.5px] border-bordercolor
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
          rounded-full flex items-center justify-center
        "
      >
          <RightArrow  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
      </Link>

      {/* HomeKite في النص وبأحجام مرنة */}
      <div className="absolute  left-0 mx-4 flex justify-end ">
        <HomeKite className="w-40 sm:w-70 md:w-80 lg:w-96 h-auto" />
      </div>
    </div>
  );
};

export default HeaderIllustration;
