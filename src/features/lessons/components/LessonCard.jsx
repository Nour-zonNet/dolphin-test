import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import teacherIcon from "@/assets/schedule/teacher.svg";
import groupIcon from "@/assets/schedule/group.svg";
import timeIcon from "@/assets/schedule/time.svg";
import clock from "@/assets/schedule/clock.svg";
import sandGlass from "@/assets/schedule/sandGlass.svg";
import books from "@/assets/schedule/books.svg";
import { formatArabicTime } from "@/utils/dateHelpers";
import { NotifyIcon, SandGlass, TimeCheck } from "@/utils/icons";

// import { getSessionLink } from "../store/lessonsSlice";
// import { useDispatch } from "react-redux";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { useCountdown } from "../hooks/useCountdown";
import { FileIcon, SessionIcon } from "@/utils/icons";
import { useNavigate } from "react-router-dom";
// import { closeModal } from "../../../store/modalSlice";

const LessonCard = ({ item, color, image, lessonDate }) => {
  const { openStatusModal } = useModal();
  const [hintMsg, setHintMsg] = useState("");
  const hintTimerRef = useRef(null);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  
  useEffect(() => {
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, []);
  
  const { start, end } = useMemo(() => {
    const [hours, minutes, seconds] = item.start_time.split(":").map(Number);

    const baseDate = new Date(
      new Date(lessonDate).toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
    );

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

  const { timeRemaining, isExpired, canEnterLesson } = useCountdown(
    item.start_time,
    lessonDate
  );

  const lessonStatus = useMemo(() => {
    const now = new Date();
    if (now >= start && now <= end) return "live";
    if (now > end) return "ended";
    return "upcoming";
  }, [start, end]);
  
  const canEnterNow = useMemo(
    () => lessonStatus === "live" || canEnterLesson || isExpired,
    [lessonStatus, canEnterLesson, isExpired]
  );

  const handleCardClick = useCallback(() => {
    if (lessonStatus === "ended") {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      setHintMsg("");
      return;
    }
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setHintMsg(canEnterNow ? "اضغط علي زر دخول الحصة للبدء" : "انتظر موعد بدء الحصة");
    hintTimerRef.current = setTimeout(() => {
      setHintMsg("");
      hintTimerRef.current = null;
    }, 3500);
  }, [lessonStatus, canEnterNow]);

  const handleEnterLesson = useCallback(() => {
    const url = `https://online.learnatdolphin.com/${item.session_link}`;

    const features = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent)
      ? "_blank"
      : "_blank,noopener,noreferrer";

    const newWindow = window.open(url, features);
    // const newWindow =null

    if (!newWindow) {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "لم يتم فتح الحصة",
        message:
          "المتصفح منع فتح نافذة جديدة. اضغط موافق لفتح الحصة في نفس النافذة.",
        onConfirm: () => {
          window.location.href = url;
        },
        onClose: () => {},
      });
    }
  }, [item.session_link, openStatusModal]);

  // Open lesson content page
  const handleOpenContent = useCallback(() => {
    navigate("/schedule/lessoncontent", {
      state: {
        lesson: item,
        lessonId: item?.id,
      },
      replace: false,
    });
  }, [navigate, item])
  // const renderButton = useCallback(() => {
  //   if (lessonStatus === "ended") {
  //     return (
  //       <div className="flex justify-center text-center items-center align-middle">
  //         <img
  //           loading="lazy"
  //           src={books}
  //           alt="ended"
  //           className="cursor-pointer w-16 xs:w-auto"
  //         />
  //       </div>
  //     );
  //   }

  //   if (
  //     lessonStatus === "upcoming" &&
  //     timeRemaining &&
  //     !isExpired &&
  //     !canEnterLesson
  //   ) {
  //     return (
  //       <div className="flex justify-center text-center items-center align-middle">
  //         <img
  //           src={clock}
  //           loading="lazy"
  //           alt="clock"
  //           className="cursor-pointer w-16 xs:w-auto"
  //         />
  //       </div>
  //     );
  //   }

  //   if (
  //     lessonStatus === "live" ||
  //     (lessonStatus === "upcoming" && (isExpired || canEnterLesson))
  //   ) {
  //     return (
  //       <>
  //         <div className="flex justify-center text-center items-center align-middle">
  //           <img
  //             src={sandGlass}
  //             alt="clock"
  //             loading="lazy"
  //             className="cursor-pointer w-16 xs:w-auto"
  //           />
  //         </div>
  //         <button
  //           onClick={handleEnterLesson}
  //           className="px-4 py-2 text-nowrap text-navyteal text-xs xs:text-[18px] font-semibold flex items-center justify-center gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked rounded-3xl hover:cursor-pointer"
  //         >
  //           دخول الحصة
  //         </button>
  //       </>
  //     );
  //   }

  //   return null;
  // }, [
  //   lessonStatus,
  //   timeRemaining,
  //   isExpired,
  //   canEnterLesson,
  //   handleEnterLesson,
  // ]);
  const renderButton = useCallback(() => {
  // عند انتهاء الحصة: لا نعرض زر الدخول
  if (lessonStatus === "ended") {
    return (
      <>
        <div className="flex justify-center text-center items-center align-middle">
          <img
            loading="lazy"
            src={books}
            alt="ended"
            className="w-16 xs:w-auto"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenContent();
          }}
          className="px-4 py-2 text-nowrap text-xs md:text-base lg:text-lg font-semibold flex items-center justify-center gap-2 rounded-3xl bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked text-navyteal cursor-pointer"
        >
          <FileIcon />
          عرض المحتوى
        </button>
    </>
    );
  }

  // هل الزر مسموح الآن؟
  // const isEnabled =
  //   lessonStatus === "live" || canEnterLesson || isExpired;
  const isEnabled = canEnterNow;
  const iconSrc =
    lessonStatus === "live" || isEnabled ? sandGlass : clock;
  return (
    <>
      <div className="flex justify-center text-center items-center align-middle">
        <img
          src={iconSrc}
          loading="lazy"
          alt="status"
          className="w-16 xs:w-auto"
        />
      </div>

      <button
        // onClick={isEnabled ? handleEnterLesson : undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (isEnabled) handleEnterLesson();
        }}
        disabled={!isEnabled}
        aria-disabled={!isEnabled}
        title={
          isEnabled ? "دخول الحصة" : "سيتم تفعيل الزر عند بدء الحصة"
        }
        className={[
          "px-4 py-2 text-nowrap text-xs md:text-base lg:text-lg font-semibold flex items-center justify-center gap-2 rounded-3xl",
          isEnabled
            ? "bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked text-navyteal cursor-pointer"
            : "bg-[#7A8085] text-[#FAFBFC] cursor-not-allowed opacity-70"
        ].join(" ")}
      >
        <SessionIcon className="w-4 lg:w-6" />
        دخول الحصة
      </button>
    </>
  );
// }, [lessonStatus, canEnterLesson, isExpired, handleEnterLesson]);
}, [lessonStatus, canEnterNow, handleEnterLesson]);

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
          timeZone: "Asia/Riyadh",
        })} - ${formatArabicTime(item.start_time)}`,
        statusColor: "text-[#ba7c28]",
        statusIcon: <SandGlass className="w-4" />,
      };
    }

    if (lessonStatus === "upcoming") {
      if (timeRemaining && !isExpired && !canEnterLesson) {
        return {
          statusText: timeRemaining, // يعرض العدّاد
          statusColor: "text-[#ba7c28]",
          statusIcon: <SandGlass className="w-4" />,
        };
      } else if (canEnterLesson) {
        return {
          statusText: "يمكن الدخول الآن",
          statusColor: "text-green-600",
          statusIcon: <NotifyIcon className="w-4" />,
        };
      } else if (isExpired) {
        return {
          statusText: "يمكن الدخول الآن",
          statusColor: "text-green-600",
          statusIcon: <NotifyIcon className="w-4" />,
        };
      } else {
        return {
          statusText: "قريباً",
          statusColor: "text-[#ba7c28]",
          statusIcon: <SandGlass className="w-4" />,
        };
      }
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
  }, [
    lessonStatus,
    timeRemaining,
    canEnterLesson,
    isExpired,
    item.start_time,
    start,
  ]);

  return (
    <div className="relative">
      <div
        style={{ borderColor: color }}
            className={`flex flex-row items-center xs:items-stretch justify-between rounded-tr-4xl rounded-bl-4xl border-[0.5px] !border-l-gray-400 !border-t-gray-400 !border-b-gray-400 border-r-quran border-r-10 sm:border-r-14 w-full py-4 md:py-8 px-4 overflow-hidden`}
            // onClick={handleCardClick}
            // role="button"
            // tabIndex={0}
              onClick={lessonStatus !== "ended" ? handleCardClick : undefined}
              role={lessonStatus !== "ended" ? "button" : undefined}
              tabIndex={lessonStatus !== "ended" ? 0 : -1}
        // className={`flex flex-row items-center xs:items-stretch justify-between rounded-tr-4xl rounded-bl-4xl border-[0.5px] !border-l-gray-400 !border-t-gray-400 !border-b-gray-400 border-r-quran border-r-10 sm:border-r-14 w-full py-4 md:py-8 px-4 overflow-hidden`}
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
                <img
                  src={image}
                  loading="lazy"
                  alt={item.name}
                  className="w-10 h-9"
                />
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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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
          {hintMsg && lessonStatus !== "ended" && (
            <div className="mt-2 text-green-600 text-sm font-semibold">
              {hintMsg}
            </div>
          )}
    </div>
  );
};

export default LessonCard;
