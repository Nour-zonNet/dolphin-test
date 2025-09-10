import React, { useRef, useState } from "react";
import playVideo from "@/assets/schedule/play-video.svg";
import stopVideo from "@/assets/schedule/stop-video.svg";
import { Fullscreen, Settings } from "@/utils/icons";
import { useTranslation } from "react-i18next";

const VideoPlayer = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full lg:h-[660px] mx-auto lg:mt-0 rounded-2xl overflow-hidden border border-[#00000066]">
      <div
        className="relative lg:h-[500px] md:h-[250px] h-[180px] w-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video ref={videoRef} className="w-full h-full object-cover" poster="https://c.animaapp.com/mer0eh3xn7npjs/img/shutterstock-331074809-1024x683-1-1.png">
          متصفحك لا يدعم تشغيل الفيديو.
        </video>

        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/1 cursor-pointer" onClick={togglePlay}>
            <p className="lg:mt-30 mt-20 font-semibold text-white text-sm md:text-xl z-10">{t("lesson_content.watch_recorded")}</p>
          </div>
        )}

        {isPlaying && isHovered && (
          <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20">
            <img src={playVideo} alt="Pause" className="w-10 md:w-14" />
          </button>
        )}

        {(!isPlaying || (isPlaying && isHovered)) && (
          <div onClick={togglePlay} className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 cursor-pointer">
            <button>
              <img src={!isPlaying ? stopVideo : playVideo} alt={!isPlaying ? "Play" : "Pause"} className="w-10 md:w-14" />
            </button>
          </div>
        )}

        <div className="absolute md:bottom-12 bottom-2 left-6 right-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Fullscreen className="md:w-5 md:h-5 cursor-pointer" onClick={() => videoRef.current.requestFullscreen()} />
            <Settings fill="white" className="md:w-5 cursor-pointer" />
          </div>
          <span className="bg-black/50 rounded-[64px] px-3 py-1 text-sm">50:07</span>
        </div>
      </div>

      <div className="md:p-6 p-2 bg-white">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-sm md:text-xl text-normalblue">الدرس الرابع: الأفعال المساعدة</h2>
            <div className="flex items-center gap-6 text-[#BA7C28] mt-2">
              <div className="flex items-center gap-2">
                <img className="w-6 h-6" alt="Duration" src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-4.svg" />
                <span className="font-semibold text-[12px] md:text-lg">50 دقيقة</span>
              </div>
              <div className="flex items-center gap-2">
                <img className="w-5 h-5" alt="Calendar" src="https://c.animaapp.com/mer0eh3xn7npjs/img/calendar-1.svg" />
                <span className="font-semibold text-[12px] md:text-lg">17 أغسطس</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img className="w-6 h-6" alt="Teacher" src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-2.svg" />
            <span className="font-semibold text-[16px] md:text-lg text-normalblue">أ. حنان</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;


