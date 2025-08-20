import React from "react";
import highlight from "../../assets/schedule/highlight.svg";
import teacherIcon from "../../assets/schedule/teacher.svg";
import groupIcon from "../../assets/schedule/group.svg";
import timeIcon from "../../assets/schedule/time.svg";
import timerIcon from "../../assets/schedule/timer.svg";
import meetingIcon from "../../assets/packages/meeting.svg";
import clock from "../../assets/schedule/clock.svg";

const PackageCard = ({ title, description, color, image, teacher, group, schedule }) => {
  return (
    <div className="relative inline-block mt-10">
    
    {/* highlight overlay */}
     <img
       src={highlight}
       alt="highlight"
       className="absolute -top-9 -left-6 z-20 pointer-events-none"
   />
    <div className={`flex items-start justify-between rounded-tr-4xl rounded-bl-4xl border border-cardBorder min-h-[200px] w-[600px] py-4 pe-6 overflow-hidden ${color}`}
    >

      <div>
        {/* Header */}
        <div className={`flex items-center gap-2 relative z-10 text-[#08233F] px-2`}>
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

        {/* teacher & Group */}
        <div className="flex items-center gap-2 mt-6 px-2 relative z-10">
          <div className="font-semibold px-1.5 flex items-center gap-2">
            <img src={teacherIcon} alt="teacher icon" className="w-6 h-6" />
            <span className="text-status">{teacher}</span>
          </div>
          <div className="font-semibold px-1.5 flex items-center gap-2">
            <img src={groupIcon} alt="group icon" className="w-6 h-6" />
            <span className="text-status">{group}</span>
          </div>
        </div>
        {/* Timer */}
        <div className="flex items-center gap-2 mt-6 px-2 relative z-10">
          <div className="font-semibold px-1.5 flex items-center gap-2">
            <img src={timeIcon} alt="time icon" className="w-6 h-6" />
            <span className="">م 9.00</span>
          </div>
          <div className="font-semibold px-1.5 flex items-center gap-2">
            <img src={timerIcon} alt="timer icon" className="w-6 h-6" />
            <span className="">متبقي ساعة و 23 دقيقة</span>
          </div>
        </div>
      </div>

        {/* Lessons */}
        <div className="flex flex-col items-center justify-between px-2 relative z-10">
          <div className="">
            <img src={clock} alt="clock" className="cursor-pointer" />
          </div>
          <button className="mb-4 w-[150px] h-[50px] text-nowrap text-navyteal text-[18px] flex items-center justify-center gap-2 mt-4 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-3xl px-4 py-1">
            <img src={meetingIcon} alt="meetingIcon" />
              دخول الحصه
          </button>
        </div>
    </div> 
    </div>
  );
};

export default PackageCard;