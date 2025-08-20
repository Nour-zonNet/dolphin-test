import React from "react";
import vector from "../../assets/packages/vector.svg";
import frame from "../../assets/packages/frame.svg";
import checked from "../../assets/packages/check.svg";
import scheduleIcon from "../../assets/packages/schedule.svg";
import whatsapp from "../../assets/packages/whatsapp.svg";
import telegram from "../../assets/packages/telegram.svg";

const PackageCard = ({ title, description, color, image, status, group, schedule }) => {
  return (
    <div className="relative inline-block">
    
    {/* Frame overlay */}
     <img
       src={frame}
       alt="frame"
       className="absolute -top-10 left-15 w-[100%] h-[125%] z-20 pointer-events-none"
   />
    <div className={`relative rounded-[10.45px] border border-cardBorder min-h-[200px] w-[550px] overflow-hidden transform skew-x-[0.6deg]`}
    >

      {/* Header */}
      <div className={`flex items-center gap-2 relative z-10 h-[75px] text-white px-2 ${color}`}>
        {image && (
          <img
            src={image}
            alt={title}
            className="w-[50px] h-[50px]"
          />
        )}
        <div>
          <h2 className="text-[1.25rem] font-semibold">{title}</h2>
          <h2 className="text-[1.25rem] font-semibold">{description}</h2>
        </div>
      </div>

      {/* Status & Group */}
      <div className="flex items-center gap-2 mt-6 px-2 relative z-10">
        <div className="bg-[#FCF0E0] w-[120px] h-[36px] font-semibold rounded-3xl px-1.5 flex items-center gap-[15px]">
          <img src={checked} alt="activeIcon" className="w-6 h-6" />
          <span className="text-status">{status}</span>
        </div>
        <p className="text-navyteal font-semibold">{group}</p>
      </div>

      {/* Schedule & Social */}
      <div className="flex items-center justify-between px-2 relative z-10">
        <button className="mb-4 w-[280px] h-[50px] text-navyteal text-[18px] flex items-center justify-center gap-4 mt-4 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-3xl px-4 py-1">
          <img src={scheduleIcon} alt="scheduleIcon" />
          معاينة الجدول الأسبوعي
        </button>
        <div className="flex items-center justify-center gap-7 h-[52px] w-[131px] border border-navyteal rounded-4xl">
          <img src={whatsapp} alt="whatsapp" className="cursor-pointer" />
          <img src={telegram} alt="telegram" className="cursor-pointer" />
        </div>
      </div>
    </div> 
    </div>
  );
};

export default PackageCard;