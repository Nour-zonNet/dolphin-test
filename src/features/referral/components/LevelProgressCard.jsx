import React from "react";
import { useModal } from "@/components/feedback/modal/useModal";
import medalIcon from "@/assets/images/silver-medal.png";
import notifyIcon from "@/assets/images/notify-icon.png";
import tenFlag from "@/assets/images/ten-flag.png";

const LevelProgressCard = () => {
  const { openLevelsModal } = useModal();
  // TODO: Get from API
  const currentLevel = 1;
  const currentProgress = 4;
  const targetProgress = 10;
  const nextLevelTarget = 4;
  const isCompleted = currentProgress >= targetProgress;
  const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);

  return (
    <div className="bg-white border border-[#D9D9D9] rounded-[24px] p-4 md:p-8 space-y-4 w-full h-full flex flex-col">
      <div className="flex items-center md:items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Badge Icon */}
          <img src={medalIcon} alt="medal" className="w-10 md:w-14 lg:w-18" />
          <div>
            <h3 className="font-semibold text-black text-sm md:text-xl lg:text-2xl text-nowrap">
              {/* المستوي {currentLevel} */} المستوى الأول
            </h3>
            <p className="text-sm md:text-base text-orangedeep font-semibold">
              {isCompleted ? "مكتمل" : "قيد التقدم"}
            </p>
          </div>
        </div>
        {/* All Levels Button */}
        <p 
          onClick={openLevelsModal}
          className="text-sm md:text-lg lg:text-xl text-[#BA7C28] underline cursor-pointer hover:text-[#9a6a1f] transition-colors text-nowrap"
        >
          جميع المستويات
        </p>
      </div>

      {/* Level Progress Bar */}
      <div className="flex items-center relative">
        <div className="w-[90%] h-4 md:h-6 bg-[#D9D9D9] rounded-full">
          <div className="h-full bg-orangedeep rounded-full w-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="absolute lg:-top-12 md:-top-10 -top-7 left-6">
          <img src={tenFlag} alt="ten flag" className="w-10 md:w-14 lg:w-17" />
        </div>
      </div>

      {/* Info Text */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <img src={notifyIcon} alt="notify" className="w-4 h-4" />
          <p className="text-sm md:text-base lg:text-lg text-black">
            ادع {nextLevelTarget} اشخاص للوصول للمستوى {currentLevel + 1}
          </p>
        </div>
        <p className="text-sm md:text-base text-black">
          تحصل على رصيد عند التسجيل، ويزيد رصيدك أكثر عند الاشتراك.
        </p>
      </div>
    </div>
  );
};

export default LevelProgressCard;

