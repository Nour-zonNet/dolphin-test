import React from "react";

export const QuizSection = () => {
  return (
    <div className="w-full max-w-[696px] mx-auto mt-8 bg-foundationbluenormal rounded-2xl p-6 border-[0.5px] border-solid border-black">
      <div className="flex items-start justify-between">
        {/* Left Side - Start Button */}
        <div className="flex flex-col items-start">
          <button className="flex items-center justify-center gap-4 px-4 py-2 bg-foundationorangenormal-hover rounded-3xl mb-4">
            <span className="font-semibold text-text text-lg [font-family:'Cairo',Helvetica]">
              ابدأ الاختبار
            </span>
            <img
              className="w-6 h-6"
              alt="Start"
              src="https://c.animaapp.com/mer0eh3xn7npjs/img/left-2.png"
            />
          </button>
          
          {/* Decorative Vector */}
          <img
            className="w-[217px] h-[69px] -ml-4"
            alt="Decoration"
            src="https://c.animaapp.com/mer0eh3xn7npjs/img/vector-2.svg"
          />
        </div>

        {/* Right Side - Quiz Info */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-4 mb-4">
            <h2 className="font-semibold text-white text-lg [font-family:'Cairo',Helvetica]">
              اختبار الدرس
            </h2>
            <div className="flex items-center justify-center w-[60px] h-[60px] bg-white rounded-[50px] opacity-80">
              <img
                className="w-8 h-8"
                alt="Quiz"
                src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-2610539.png"
              />
            </div>
          </div>
          
          <p className="font-semibold text-white text-lg [font-family:'Cairo',Helvetica] mb-4">
            10 اسئله | 20 دقيقة
          </p>
          
          <p className="font-semibold text-white text-lg [font-family:'Cairo',Helvetica]">
            ابدأ هذا الاختبار القصير لتتعرف على مستوي فهمك
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizSection