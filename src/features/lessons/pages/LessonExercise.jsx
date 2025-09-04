import React from "react";
import { Board } from "../../Board";

const LessonExercise = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col gap-5 items-center py-4 md:py-6">
      {/* Header */}
      <header className="w-full max-w-4xl bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <img
            className="w-12 h-12 md:w-16 md:h-16"
            alt="Lesson icon"
            src="https://c.animaapp.com/mezm58la2qNPWy/img/---.svg"
          />
          <h1 className="font-bold text-xl md:text-2xl text-right font-cairo self-center">
            تدريبات الدرس
          </h1>
        </div>
      </header>

      <div className="px-4 w-full ">
        <Board />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-4 md:gap-8 justify-center items-center w-full max-w-4xl mb-12">
        {/* Complete Button */}
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-orangedeep rounded-full text-base font-semibold font-cairo text-deepnavy hover:bg-orange-600 transition-colors min-w-[180px]">
          مكتمل
          <img
            className="w-4 h-4"
            alt="Check icon"
            src="https://c.animaapp.com/mezm58la2qNPWy/img/check-2.svg"
          />
        </button>
        {/* Close Button */}
        <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-orangedeep rounded-full text-base font-semibold font-cairo text-deepnavy hover:bg-orange-50 transition-colors min-w-[180px]">
          اغلاق
          <img
            className="w-4 h-4"
            alt="Cross icon"
            src="https://c.animaapp.com/mezm58la2qNPWy/img/cross-1.svg"
          />
        </button>
      </div>

      {/* Navigation Indicator */}
    </div>
  );
};
export default LessonExercise;
