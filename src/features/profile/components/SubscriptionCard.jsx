import React from "react";
import abc from "@/assets/packages/english.svg";
import { Line } from "@/utils/Illustrations";
const SubscriptionCard = ({
  subscriptionDate,
  expiryDate,
  status = "فعالة",
}) => {
  return (

     <div className="w-full rounded-3xl border-[0.5px] border-solid border-[#3c3c4322] p-4 md:p-6">
      <div className="flex items-start flex-col md:flex-row justify-between">
        <div className="flex lg:items-center flex-col gap-8 md:gap-10 lg:gap-20 items-start lg:flex-row">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-4">
              <img
                src={abc}
                alt="letters"
                className="bg-englishLevelOne rounded w-[30px] h-[30px] md:h-[50px] md:w-[50px]"
              />
                <div>
                  <h3 className="font-semibold md:text-base lg:text-xl text-sm text-navyteal text-nowrap">باقة تأسيس اللغة الإنجليزية </h3>
                  <h3 className="font-semibold md:text-base lg:text-xl text-sm text-navyteal mt-2">(المستوي الأول)</h3>
                </div>
              </div>
                {/* Status for mobile */}
                <div className="flex md:hidden items-center justify-center gap-2 mt-4 lg:mt-0 bg-[#F8E0BF] rounded-3xl px-4 md:px-6 py-1">
                  <img
                    className="w-4 h-4"
                    alt="Status"
                    src="https://c.animaapp.com/mf29nm7vjLRxgE/img/frame-14.svg"
                  />
                  <span className="font-semibold text-[#1b648e] text-sm md:text-base">
                    {status}
                  </span>
                </div>
          </div>

          <div className="flex items-center gap-4">
            <Line className="stroke-[#185A80] hidden md:block" fill="#185A80" />
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 md:gap-4">
                <span className="font-semibold text-[#666565] text-sm md:text-base text-nowrap">
                  تاريخ الاشتراك:
                </span>
                <span className="font-semibold text-black text-sm md:text-base text-nowrap">
                  {subscriptionDate}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#666565] text-sm md:text-base text-nowrap">
                  تاريخ الانتهاء:
                </span>
                <span className="font-semibold text-black text-sm md:text-base text-nowrap">
                  {expiryDate}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center gap-2 mt-4 lg:mt-0 bg-[#F8E0BF] rounded-3xl px-4 md:px-6 py-1">
          <img
            className="w-4 h-4 md:w-6 md:h-6"
            alt="Status"
            src="https://c.animaapp.com/mf29nm7vjLRxgE/img/frame-14.svg"
          />
          <span className="font-semibold text-[#1b648e] text-sm md:text-base">
            {status}
          </span>
        </div>
        </div>
      </div>
  );
};

export default SubscriptionCard;
