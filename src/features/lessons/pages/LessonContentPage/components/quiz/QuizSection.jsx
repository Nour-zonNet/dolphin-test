// components/QuizSection.jsx
import React, { useCallback } from "react";
import brain from "@/assets/schedule/brain.svg";
import { ArrowNext } from "@/utils/icons";
import { Draw } from "@/utils/Illustrations";

const fixExamLink = (linkRaw) => {
  if (!linkRaw) return null;
  let link = String(linkRaw).trim();
  // يحذف أي host خارجي ويحتفظ بالرابط الداخلي
  link = link.replace(/https?:\/\/[^/]+\/(https?:\/\/)/i, "$1");
  if (!/^https?:\/\//i.test(link)) link = `https://${link}`;
  try {
    return new URL(link).toString();
  } catch {
    return null;
  }
};

const FIXED_FROM_API = "https://admintest.learnadolphin.com/https://admin.com";
const CLEAN_URL = fixExamLink(FIXED_FROM_API); // => https://admin.com

const QuizSection = () => {
  const handleClick = useCallback(() => {
    if (!CLEAN_URL) return;
    window.open(CLEAN_URL, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="relative w-full mx-auto mt-10 lg:mt-6 md:p-8 p-4 h-[200px] lg:h-[230px] rounded-2xl border border-black/30 bg-status shadow-md transition-all">
      <div className="flex items-start justify-between flex-col h-full">
        <div className="flex items-center justify-between w-full">
          {/* left side */}
          <div className="flex items-center md:gap-4 gap-2 mb-4">
            <div className="flex items-center justify-center md:w-[64px] md:h-[64px] w-[44px] h-[44px] bg-white rounded-full shadow">
              <img
                className="md:w-9 md:h-9 w-6 h-6"
                alt="Quiz"
                src={brain}
              />
            </div>
            <div>
              <h2 className="font-bold text-white md:text-lg text-base">
                الاختبار
              </h2>
              <p className="font-medium text-white md:text-md text-xs mt-1">
                10 أسئلة | 20 دقيقة
              </p>
            </div>
          </div>

          {/* right side */}
          <div className="flex flex-col items-start relative z-10">
            <button
              type="button"
              onClick={handleClick}
              className="cursor-pointer flex items-center justify-center md:gap-3 gap-2 md:py-2.5 py-1.5 px-4 rounded-3xl mb-4 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked md:w-[200px] w-[140px] text-sm md:text-base font-semibold text-navyteal transition-colors"
            >
              <ArrowNext className="w-4 md:w-5" />
              <span>ابدأ الاختبار</span>
            </button>
          </div>
        </div>

        {/* description */}
        <p className="font-medium text-white md:text-base text-sm">
          ابدأ هذا الاختبار القصير لتتعرف على مستوى فهمك
        </p>

        {/* decoration */}
        <div className="absolute left-0 bottom-0 overflow-hidden rounded-bl-2xl pointer-events-none">
          <Draw />
        </div>
      </div>
    </div>
  );
};

export default QuizSection;
