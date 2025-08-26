import React from "react";
import brain from "@/assets/schedule/brain.svg";
import { ArrowNext } from "../../../../utils/icons";
import { Draw } from "../../../../utils/Illustrations";

export const QuizSection = () => {
  return (
    <div className="relative w-full mx-auto mt-10 mb-50 p-8 h-[180px] lg:h-[215px] rounded-2xl border-[0.5px] border-solid border-black bg-status">
      <div className="flex items-start justify-between">
        {/* Right Side - Quiz Info */}
        <div className="text-right">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-[60px] h-[60px] bg-white rounded-full">
              <img
                className="w-8 h-8"
                alt="Quiz"
                src={brain}
              />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">اختبار الدرس</h2>
              <p className="font-semibold text-white text-lg mt-2">10 اسئله |  20 دقيقة</p>
            </div>
          </div>

          <p className="font-semibold text-white text-lg">
            ابدأ هذا الاختبار القصير لتتعرف على مستوي فهمك
          </p>
        </div>
        {/* Left Side - Start Button */}
        <div className="flex flex-col items-start">
          <button className="cursor-pointer flex items-center justify-center gap-4 py-2.5 rounded-3xl mb-4 bg-btnClicked w-[200px]">
            <ArrowNext />
            <span className="font-semibold text-navyteal text-lg">
              ابدأ الاختبار
            </span>
          </button>
        </div>
          {/* Decorative Vector */}
          <div className="absolute left-0 bottom-0 overflow-hidden rounded-bl-2xl">
            <Draw />
          </div>
      </div>
    </div>
  );
};

export default QuizSection;
