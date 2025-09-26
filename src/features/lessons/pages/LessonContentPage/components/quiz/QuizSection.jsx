// components/QuizSection.jsx
import React, { useCallback, useEffect, useMemo } from "react";
import brain from "@/assets/schedule/brain.svg";
import { ArrowNext } from "@/utils/icons";
import { Draw } from "@/utils/Illustrations";
import { useContent } from "@/features/lessons/hooks/useContent";

const QuizSection = ({ lessonId, hideWhenMissing = true }) => {
  // HOOKS (always run, same order)
  const { content, loading, error, getContent } = useContent(lessonId);

  useEffect(() => {
    if (lessonId) getContent(lessonId);
  }, [lessonId, getContent]);

  const examUrl = content?.examLink || null;

  // define callbacks BEFORE any conditional return
  const handleClick = useCallback(() => {
    if (!examUrl) return;
    window.open(examUrl, "_blank", "noopener,noreferrer");
  }, [examUrl]);

  const disabled = loading || !!error || !examUrl;

  // compute hide flag but DO NOT use hooks below this point
  const shouldHide = useMemo(
    () => hideWhenMissing && !loading && (!examUrl || error),
    [hideWhenMissing, loading, examUrl, error]
  );

  if (shouldHide) return null;

  return (
    <div className="relative w-full mx-auto mt-10 lg:mt-6 md:p-8 p-4 h-[200px] lg:h-[230px] rounded-2xl border-[0.5px] border-black bg-status shadow-md transition-all">
      <div className="flex items-start justify-between flex-col">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center md:gap-4 gap-2 mb-4">
            <div className="flex items-center justify-center md:w-[64px] md:h-[64px] w-[44px] h-[44px] bg-white rounded-full shadow">
              <img className="md:w-9 md:h-9 w-6 h-6" alt="Quiz" src={brain} />
            </div>
            <div>
              <h2 className="font-bold text-white md:text-lg xl:text-xl text-sm">الاختبار</h2>
            </div>
          </div>

          <div className="flex flex-col items-start relative z-10">
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled}
              className={`cursor-pointer flex items-center justify-center md:gap-3 gap-2 md:py-2.5 py-1.5 px-4 rounded-3xl mb-4 md:w-[200px] w-[140px] text-sm md:text-lg font-semibold transition-colors
                ${disabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked text-navyteal"}`}
            >
              <ArrowNext className="w-4 md:w-5" />
              <span>{disabled ? "غير متاح" : "ابدأ الاختبار"}</span>
            </button>

            {!loading && !error && !examUrl && !hideWhenMissing && (
              <span className="text-white/80 text-xs">لا يوجد رابط اختبار بعد</span>
            )}
            {!loading && error && !hideWhenMissing && (
              <span className="text-red-200 text-xs">خطأ في تحميل الاختبار</span>
            )}
          </div>
        </div>

        <p className="font-medium text-white md:text-lg xl:text-xl text-sm text-wrap">
          ابدأ هذا الاختبار القصير لتتعرف على مستوى فهمك
        </p>

        <div className="absolute left-0 bottom-0 overflow-hidden rounded-bl-2xl pointer-events-none">
          <Draw />
        </div>
      </div>
    </div>
  );
};

export default QuizSection;
