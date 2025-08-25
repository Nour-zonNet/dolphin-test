import React from "react";

export const VideoPlayer = () => {
  return (
    <div className="w-full max-w-[696px] mx-auto mt-6 rounded-2xl overflow-hidden border-[0.5px] border-solid border-[#00000066]">
      {/* Video Thumbnail */}
      <div className="relative h-[300px] bg-[url(https://c.animaapp.com/mer0eh3xn7npjs/img/shutterstock-331074809-1024x683-1-1.png)] bg-cover bg-center">
        {/* Play Button and Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            className="w-[60px] h-[60px] mb-4"
            alt="Play"
            src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-5.svg"
          />
          <p className="font-semibold text-white text-xl">
            مشاهدة الدرس المسجل
          </p>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
          <img
            className="w-[78px]"
            alt="Controls"
            src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-2610531.svg"
          />
          <div className="bg-[#00000080] rounded-[64px] px-5 py-0.5">
            <span className="font-semibold text-white text-xl">
              50:07
            </span>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6 bg-white">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-center justify-start gap-6">
          <h2 className="font-semibold text-foundation-bluenormal-active text-normalblue text-xl">
            الدرس الرابع: الأفعال المساعدة
          </h2>
          <div className="flex items-center gap-4 text-[#BA7C28]">
            <div className="flex items-center gap-4">
            <img
              className="w-6 h-6"
              alt="Duration"
              src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-4.svg"
            />
            <span className="font-semibold text-foundation-orangenormal-active text-lg">
              50 دقيقة
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img
              className="w-[18.06px] h-[18.02px]"
              alt="Calendar"
              src="https://c.animaapp.com/mer0eh3xn7npjs/img/calendar-1.svg"
            />
            <span className="font-semibold text-foundation-orangenormal-active text-lg">
              17 أغسطس
            </span>
          </div>
          </div>
        </div>
          <div className="flex items-center gap-4">
            <img
              className="w-6 h-6"
              alt="Teacher"
              src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-2.svg"
            />
            <span className="font-semibold text-text text-lg text-normalblue">
              أ. حنان
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer