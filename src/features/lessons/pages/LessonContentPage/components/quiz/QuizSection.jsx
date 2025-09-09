import React from "react";
import brain from "@/assets/schedule/brain.svg";
import { ArrowNext } from "@/utils/icons";
import { Draw } from "@/utils/Illustrations";
import { useTranslation } from "react-i18next";

export const QuizSection = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full mx-auto mt-10 lg:mt-6 md:p-8 p-4 h-[180px] lg:h-[215px] rounded-2xl border-[0.5px] border-solid border-black bg-status">
      <div className="flex items-start justify-between flex-col">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center md:gap-4 gap-2 mb-4">
            <div className="flex items-center justify-center md:w-[60px] md:h-[60px] w-[40px] h-[40px] bg-white rounded-full">
              <img className="md:w-8 md:h-8 w-6 h-6" alt="Quiz" src={brain} />
            </div>
            <div>
              <h2 className="font-semibold text-white md:text-lg text-sm">{t("lesson_content.exam")}</h2>
              <p className="font-semibold text-white md:text-lg text-[12px] mt-2 text-nowrap">10 اسئله |  20 دقيقة</p>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <button className="cursor-pointer flex items-center justify-center md:gap-4 gap-2 md:py-2.5 py-1.5 rounded-3xl mb-4 bg-orangedeep md:w-[200px] w-[120px]">
              <ArrowNext className="w-4 md:w-6" />
              <span className="font-semibold text-navyteal md:text-lg text-sm">ابدأ الاختبار</span>
            </button>
          </div>
        </div>
        <p className="font-semibold text-white md:text-lg text-sm">ابدأ هذا الاختبار القصير لتتعرف على مستوي فهمك</p>
        <div className="absolute left-0 bottom-0 overflow-hidden rounded-bl-2xl">
          <Draw />
        </div>
      </div>
    </div>
  );
};

export default QuizSection;


