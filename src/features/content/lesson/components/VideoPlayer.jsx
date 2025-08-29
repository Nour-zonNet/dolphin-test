import React, { useRef, useState } from "react";
// import { Fullscreen, Settings } from "lucide-react"; // icons
// import lessonVideo from "@/assets/videos/lesson.mp4";
import playVideo from "@/assets/schedule/play-video.svg";
import stopVideo from "@/assets/schedule/stop-video.svg";

const VideoPlayer = () => {
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
    <div className="w-full lg:h-[430px] mx-auto mt-6 lg:mt-0 rounded-2xl overflow-hidden border border-[#00000066]">
      {/* Video Container */}
      <div
        className="relative h-[300px] group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="https://c.animaapp.com/mer0eh3xn7npjs/img/shutterstock-331074809-1024x683-1-1.png"
        >
          {/* <source src={lessonVideo} type="video/mp4" /> */}
          متصفحك لا يدعم تشغيل الفيديو.
        </video>

        {/* Overlay (only if not playing) */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/1 cursor-pointer"
            onClick={togglePlay}
          >
            {/* <button className="">
              <img src={stopVideo} alt="Play" className="" />
            </button> */}
            <p className="mt-30 font-semibold text-white text-xl z-10">
              مشاهدة الدرس المسجل
            </p>
          </div>
        )}

        {/* Hover Play/Pause icon (when playing) */}
        {isPlaying && isHovered && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <img src={playVideo} alt="Pause" className="w-15" />
          </button>
        )}
        {/* Overlay for both states */}
      {(!isPlaying || (isPlaying && isHovered)) && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 cursor-pointer"
        >
          <button>
            <img
              src={!isPlaying ? stopVideo : playVideo}
              alt={!isPlaying ? "Play" : "Pause"}
              className="w-15"
            />
          </button>

          {/* Show text only when video is not playing */}
          {/* {!isPlaying && (
            <p className="mt-4 font-semibold text-white text-xl">
              مشاهدة الدرس المسجل
            </p>
          )} */}
        </div>
      )}

        {/* Controls */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Settings className="w-7 h-7 cursor-pointer" />
            <Fullscreen
              className="w-7 h-7 cursor-pointer"
              onClick={() => videoRef.current.requestFullscreen()}
            />
          </div>
          <span className="bg-black/50 rounded-[64px] px-3 py-1 text-sm">
            50:07
          </span>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6 bg-white">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-xl text-normalblue">
              الدرس الرابع: الأفعال المساعدة
            </h2>

            <div className="flex items-center gap-6 text-[#BA7C28] mt-2">
              {/* Duration */}
              <div className="flex items-center gap-2">
                <img
                  className="w-6 h-6"
                  alt="Duration"
                  src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-4.svg"
                />
                <span className="font-semibold text-lg">50 دقيقة</span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <img
                  className="w-5 h-5"
                  alt="Calendar"
                  src="https://c.animaapp.com/mer0eh3xn7npjs/img/calendar-1.svg"
                />
                <span className="font-semibold text-lg">17 أغسطس</span>
              </div>
            </div>
          </div>

          {/* Teacher */}
          <div className="flex items-center gap-2">
            <img
              className="w-6 h-6"
              alt="Teacher"
              src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame-2.svg"
            />
            <span className="font-semibold text-lg text-normalblue">
              أ. حنان
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
