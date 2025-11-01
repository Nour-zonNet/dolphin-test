import React from "react";
import { ClosePopup } from "@/utils/icons";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import medalIcon from "@/assets/images/silver-medal.png";
import notifyIcon from "@/assets/images/notify-icon.png";
import levelStar from "@/assets/images/level-star.png";
import levelProgress from "@/assets/images/circle.png";
import lockIcon from "@/assets/images/lock.png";
import secondMedal from "@/assets/images/second-medal.png";
import thirdMedal from "@/assets/images/third-medal.png";

const LevelsModal = ({ onClose }) => {
  // TODO: Get from API
  const levels = [
    {
      id: 1,
      name: "المستوي الاول",
      status: "in_progress",
      currentProgress: 6,
      targetProgress: 10,
      nextLevelTarget: 4,
      registrationReward: null,
      subscriptionReward: null,
      icon: medalIcon,
    },
    {
      id: 2,
      name: "المستوي الثاني",
      status: "locked",
      unlockTarget: 15,
      nextLevelTarget: 3,
      registrationReward: 12,
      subscriptionReward: 17,
      icon: secondMedal, 
    },
    {
      id: 3,
      name: "المستوي الثالث",
      status: "locked",
      unlockTarget: 15,
      nextLevelTarget: null,
      registrationReward: 12,
      subscriptionReward: 17,
      icon: thirdMedal, 
    },
  ];

  const progressPercentage = (level) => {
    if (level.status !== "in_progress") return 0;
    return Math.min((level.currentProgress / level.targetProgress) * 100, 100);
  };

  return (
    <>
      <style>{`
        .levels-modal-scroll::-webkit-scrollbar {
          display: none;
        }
        .levels-modal-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="relative w-[80%] mx-auto max-w-5xl bg-white rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto levels-modal-scroll">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-dashed border-gray-300 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-200 rounded-full border border-gray-300 p-2 transition-colors"
          aria-label="Close"
        >
          <ClosePopup className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Star Icon */}
        <img src={levelStar} alt="level-star" className="w-12 h-12 md:w-16 md:h-16 mb-3" />
        {/* Title */}
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-black">المستويات</h2>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`border border-[#D9D9D9] rounded-[8px] p-6 space-y-4 relative ${
                level.id === 2 || level.id === 3
                  ? "bg-[rgba(224,223,219,0.72)]"
                  : "bg-white"
              }`}
            >
              {/* Lock Icon for locked levels */}
              {level.status === "locked" && (
                <div className="absolute top-4 left-4">
                  <img src={lockIcon} alt="lock" className="w-4 md:w-6" />
                </div>
              )}

               {/* Level Title/Status and Progress in same row */}
               <div className="flex items-center justify-between gap-4">
                 {/* Level Title and Status */}
                 <div className="flex items-center gap-2">
                   {/* Level Icon */}
                   {level.icon && (
                     <div className="">
                       <img src={level.icon} alt="medal" className="w-10 lg:w-14" />
                     </div>
                   )}
                   <div className="">
                     <h3 className="font-bold text-black text-sm md:text-base lg:text-xl mb-2">
                       {level.name}
                     </h3>
                     <p
                       className={`text-sm md:text-base font-semibold ${
                         level.status === "in_progress"
                           ? "text-orangedeep"
                           : "text-[#50575D]"
                       }`}
                     >
                       {level.status === "in_progress" ? "قيد التقدم" : "مغلق"}
                     </p>
                   </div>
                 </div>

                 {/* Progress for in_progress level */}
                 {level.status === "in_progress" && (
                   <div className="relative inline-flex items-center justify-center flex-shrink-0">
                     <img src={levelProgress} alt="level-progress" className="w-10 lg:w-14" />
                     <p className="absolute text-[10px] lg:text-sm text-white text-center inset-0 flex items-center justify-center">
                       {level.currentProgress}/{level.targetProgress}
                     </p>
                   </div>
                 )}
               </div>

              {/* Additional content for in_progress level */}
              {level.status === "in_progress" && (
                <>
                  <div className="flex items-center gap-2">
                    <img src={notifyIcon} alt="notify" className="w-4 h-4" />
                    <p className="text-sm md:text-base text-black">
                      متبقي {level.nextLevelTarget} اشخاص للوصول للمستوى {level.id + 1}
                    </p>
                  </div>

                  <p className="text-sm md:text-base text-black">
                    تحصل على رصيد عند التسجيل، ويزيد رصيدك أكثر عند الاشتراك.
                  </p>
                </>
              )}

              {/* Locked level content */}
              {level.status === "locked" && (
                <>
                  <p className="text-sm md:text-base text-black">
                    ادع {level.unlockTarget} شخص للوصول للمستوى {level.nextLevelTarget || level.id + 1}
                  </p>
                  <p className="text-sm md:text-base text-black">
                    وتحصل على{" "}
                    <span className="inline-flex items-center">
                      <FormatWithCurrency
                        amount={level.registrationReward}
                        fractionDigits={0}
                        className="text-black font-medium text-sm md:text-base"
                        symbolFill="#08233F"
                        symbolClass="w-3 h-3 md:w-4 md:h-4"
                      />
                    </span>{" "}
                    رصيد عند تسجيلهم، ويزيد رصيدك إلي{" "}
                    <span className="inline-flex items-center">
                      <FormatWithCurrency
                        amount={level.subscriptionReward}
                        fractionDigits={0}
                        className="text-black font-medium text-sm md:text-base"
                        symbolFill="#08233F"
                        symbolClass="w-3 h-3 md:w-4 md:h-4"
                      />
                    </span>{" "}
                    عند اشتراكهم في باقة
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default LevelsModal;

