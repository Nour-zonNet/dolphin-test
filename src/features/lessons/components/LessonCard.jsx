import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import teacherIcon from "@/assets/schedule/teacher.svg";
import groupIcon from "@/assets/schedule/group.svg";
import timeIcon from "@/assets/schedule/time.svg";
import clock from "@/assets/schedule/clock.svg";
import sandGlass from "@/assets/schedule/sandGlass.svg";
import books from "@/assets/schedule/books.svg";
import { formatArabicTime, getRemainingTime } from "../../../utils/dateHelpers";
import { NotifyIcon, SandGlass, TimeCheck } from "../../../utils/icons";

const LessonCard = ({ item, color, image, lessonDate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { start, end } = useMemo(() => {
  // parse HH:mm:ss from API
  const [hours, minutes, seconds] = item.start_time.split(":").map(Number);

  // استخدم اليوم اللي جالك من الـ Slider
  const baseDate = new Date(lessonDate);

  const startDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    seconds || 0
  );

  const durationMinutes = item.duration || 60;
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  return { start: startDate, end: endDate };
}, [item.start_time, item.duration, lessonDate]);
  const lessonStatus = useMemo(() => {
    const now = new Date();
    if (now >= start && now <= end) return "live";
    if (now > end) return "ended";
    return "upcoming";
  }, [start, end]);

  const handleEnterLesson = useCallback(
    () => navigate("lessoncontent"),
    [navigate]
  );
  const renderButton = () => {
    if (lessonStatus === "upcoming") {
      return (
        <>
          <div className="flex justify-center text-center items-center align-middle">
            <img
              src={clock}
              alt="clock"
              className="cursor-pointer w-16 xs:w-auto"
            />
          </div>
          {/* <button
            disabled
            className="px-4 py-2 text-nowrap text-gray-400 text-xs xs:text-[18px] font-semibold flex items-center justify-center gap-2 bg-gray-200 rounded-3xl cursor-not-allowed"
          >
            لم تبدأ بعد
          </button> */}
        </>
      );
    }

    if (lessonStatus === "live") {
      return (
        <>
          <div className="flex justify-center text-center items-center align-middle">
            <img
              src={sandGlass}
              alt="clock"
              className="cursor-pointer w-16 xs:w-auto"
            />
          </div>
          <button
            onClick={handleEnterLesson}
            className="px-4 py-2 text-nowrap text-navyteal text-xs xs:text-[18px] font-semibold flex items-center justify-center gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked rounded-3xl"
          >
            دخول الحصة
          </button>
        </>
      );
    }

    if (lessonStatus === "ended") {
      return (
        <>
          <div className="flex justify-center text-center items-center align-middle">
            <img
              src={books}
              alt="clock"
              className="cursor-pointer w-16 xs:w-auto"
            />
          </div>
          {/* <button
            onClick={handleEnterLesson}
            className="px-4 py-2 text-nowrap text-gray-400 text-xs xs:text-[18px] font-semibold flex items-center justify-center gap-2 bg-gray-200 rounded-3xl cursor-not-allowed"
          >
            عرض المحتوى
          </button> */}
        </>
      );
    }
  };
const { statusText, statusColor, statusIcon } = useMemo(() => {
  const now = new Date();

  // نشوف هل يوم الحصة هو نفس يوم النهارده
  const isSameDay =
    start.getDate() === now.getDate() &&
    start.getMonth() === now.getMonth() &&
    start.getFullYear() === now.getFullYear();

  if (!isSameDay) {
    return {
      statusText: `الحصة يوم ${start.toLocaleDateString("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })} - ${formatArabicTime(item.start_time)}`,
      statusColor: "text-[#ba7c28]",
      statusIcon: <SandGlass className="w-4" />,
    };
  }

  if (lessonStatus === "upcoming") {
    return {
      statusText: `متبقي ${getRemainingTime(item.start_time)}`,
      statusColor: "text-[#ba7c28]",
      statusIcon: <SandGlass className="w-4" />,
    };
  }
  if (lessonStatus === "live") {
    return {
      statusText: "الحصة بدأت",
      statusColor: "text-green-600",
      statusIcon: <NotifyIcon className="w-4" />,
    };
  }
  return {
    statusText: "انتهت الحصة",
    statusColor: "text-red-500",
    statusIcon: <TimeCheck className="w-4" />,
  };
}, [lessonStatus, item.start_time, start]);

  return (
    <div className="relative">
      <div
        style={{ borderColor: color }}
        className={`flex flex-row items-center xs:items-stretch justify-between rounded-tr-4xl rounded-bl-4xl border-[0.5px] !border-l-gray-400 !border-t-gray-400 !border-b-gray-400 border-r-quran border-r-10 sm:border-r-14 w-full py-4 md:py-8 px-4 overflow-hidden`}
      >
        {/* Left section */}
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="flex items-center gap-2 relative z-10 px-2">
            {image && (
              <div
                style={{ backgroundColor: color }}
                className="w-10 h-9 sm:w-12 sm:h-12 rounded-md flex items-center justify-center"
              >
                <img src={image} alt={item.name} className="w-10 h-9" />
              </div>
            )}
            <div>
              <h2 className="text-sm text-navyteal xs:text-[1.25rem] font-semibold leading-snug">
                {item.subject}
              </h2>
              <h2 className="text-sm text-navyteal xs:text-[1.25rem] font-semibold leading-snug">
                {item.description}
              </h2>
            </div>
          </div>

          {/* Teacher & Group */}
          <div className="flex flex-wrap items-center gap-3 mt-4 xs:mt-6 px-2 relative z-10">
            <div className="font-semibold flex items-center gap-2">
              <img
                src={teacherIcon}
                alt="teacher icon"
                className="w-4 h-4 xs:w-6 xs:h-6"
              />
              <span className="text-status text-xs xs:text-base">
                {item.teacher_name ?? t("lessons.defaultTeacher")}
              </span>
            </div>
            <div className="font-semibold flex items-center gap-2">
              <img
                src={groupIcon}
                alt="group icon"
                className="w-4 h-4 xs:w-6 xs:h-6"
              />
              <span className="text-status text-xs xs:text-base md:text-lg">
                {item.group}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex flex-wrap flex-col sm:flex-row gap-3 mt-4 xs:mt-6 px-2 relative z-10">
            <div className="font-semibold flex items-center gap-2">
              <img
                src={timeIcon}
                alt="time icon"
                className="w-4 h-4 xs:w-6 xs:h-6"
              />
              <span className="text-xs xs:text-base">
                {formatArabicTime(item.start_time)}
              </span>
            </div>
            <div className="font-semibold flex items-center gap-2">
              {statusIcon}
              <span
                className={`text-xs xs:text-base font-semibold ${statusColor}`}
              >
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-col items-center justify-center mr-auto xs:space-y-3.5 gap-2 xs:gap-0 px-2 relative z-10 space-y-2">
          {renderButton()}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
