import React from "react";
import { Link } from "react-router-dom";
import { RightArrow } from "../../../../utils/icons";

export const LessonHeader = () => {
  return (
    <div className="w-full bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-8 px-20 flex items-center relative">

      {/* Back Button */}
      <Link
        to="/schedule"
        className="outline-0 border border-bordercolor w-[60px] h-[60px] rounded-full flex items-center justify-center"
      >
        <RightArrow />
      </Link>

      {/* Centered Content */}
      <div className="flex-1 text-center">
        <h1 className="font-bold text-navyteal text-2xl">محتوي الدرس</h1>
        <p className="font-semibold text-[#BA7C28] text-xl mt-2">
          تأسيس اللغة الإنجليزية (المستوي الأول)
        </p>
      </div>
    </div>
  );
};

export default LessonHeader;
