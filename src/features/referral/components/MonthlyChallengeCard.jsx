import React from "react";
import challengeImage from "@/assets/images/dolphin-challenge.png";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
const MonthlyChallengeCard = () => {
  // TODO: Get from API
  const currentProgress = 10;
  const targetProgress = 15;
  const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);
  const registrationReward = 12;
  const subscriptionReward = 15;

  return (
    <div className="bg-white border border-[#D9D9D9] rounded-[16px] p-6 md:p-8 space-y-4 w-full h-full flex flex-col">
      <h3 className="font-bold text-black text-base md:text-xl lg:text-2xl">تحدي الشهر</h3>
      <div className="flex items-center justify-between">
        <div className="flex flex-col w-2/3">
          {/* Challenge Description */}
          <p className="text-sm md:text-base text-black leading-relaxed">
            ادع {targetProgress} صديق هذا الشهر واحصل علي{" "}
            <span className="inline-flex items-center">
              <FormatWithCurrency
                amount={registrationReward}
                fractionDigits={0}
                className="text-[#2E7D32] font-bold text-sm md:text-base lg:text-lg"
                symbolFill="#2E7D32"
                symbolClass="w-3 h-3 md:w-4 md:h-4"
              />
            </span>{" "}
            عند تسجيلهم و{" "}
            <br />
            <span className="inline-flex items-center">
              <FormatWithCurrency
                amount={subscriptionReward}
                fractionDigits={0}
                className="text-[#2E7D32] font-bold text-sm md:text-base lg:text-lg"
                symbolFill="#2E7D32"
                symbolClass="w-3 h-3 md:w-4 md:h-4"
              />
            </span>{" "}
            عند اشتراكهم في أي باقة
          </p>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-6">
            <div className="w-full bg-[#DDDFDD] rounded-full h-4 md:h-6 overflow-hidden">
              <div
                className="h-full bg-orangedeep transition-all duration-300 rounded-full flex items-center justify-end pr-1"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* {progressPercentage > 15 && (
                  <span className="text-xs text-navyteal font-bold">
                    {Math.round(progressPercentage)}%
                  </span>
                )} */}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-black flex items-center">
              <span>{targetProgress}</span><span className="text-gray-500"> / </span><span className="text-orangedeep">{currentProgress}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="">
          <img src={challengeImage} alt="challenge" className="w-24 md:w-32 lg:w-auto" />
        </div>
      </div>
    </div>
  );
};

export default MonthlyChallengeCard;

