import React from "react";
import { ArrowNext } from "@/utils/icons";

const LessonCard = ({ 
  title, 
  subtitle, 
  date, 
  buttonText = "ابدأ الدرس", 
  image, 
  onStart 
}) => {
  return (
    <div className="flex w-full items-center justify-between text-black rounded-lg p-4 border border-[#B3B3B3]">
      {/* Left Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <h3 className="text-sm md:text-xl font-semibold">{title}</h3>
          <h3 className="text-sm md:text-xl font-semibold">{subtitle}</h3>
        </div>

        {/* Date + Button */}
        <div className="flex items-center gap-10">
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-orangedeep text-navyteal font-semibold text-sm md:text-[16px] px-4 py-2 rounded-full cursor-pointer"
          >
            <ArrowNext />
            {buttonText}
          </button>
          <p className="text-[#BA7C28] font-semibold text-sm md:text-[16px]">{date}</p>
        </div>
      </div>

      {/* Image */}
      <div>
        <img src={image} alt={title} className="max-w-[120px]" />
      </div>
    </div>
  );
};

export default LessonCard;
