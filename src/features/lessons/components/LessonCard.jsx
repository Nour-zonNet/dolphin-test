import { useMemo, useState, useEffect } from "react";
import { useModal } from "@/components/feedback/modal/useModal";
import { useCountdown } from "../hooks/useCountdown";
import { useLessonStatus } from "../hooks/useLessonStatus";
import { useLessonHandlers } from "../hooks/useLessonHandlers";
import { LessonButton } from "./LessonButton";
import { LessonInfo } from "./LessonInfo";
import { LESSON_STATUS } from "../../../utils";

const LessonCard = ({ item, color, image, lessonDate }) => {
  const { openStatusModal } = useModal();
  const [hintMsg, setHintMsg] = useState("");
  const  HINT_TIMEOUT_MS = 4000;

  useEffect(() => {
    if (!hintMsg) return;
    const t = setTimeout(() => setHintMsg(""), HINT_TIMEOUT_MS);
    return () => clearTimeout(t); // reset timer on rapid clicks / unmount
  }, [hintMsg]);

  // Date calculations
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

  // Countdown and status logic
  const { timeRemaining, isExpired, canEnterLesson } = useCountdown(
    item.start_time,
    lessonDate
  );

  const lessonStatus = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lessonDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );

    if (lessonDay < today) return LESSON_STATUS.ENDED;
    if (item.delay) return LESSON_STATUS.DELAYED;
    if (now >= start && now <= end) return LESSON_STATUS.LIVE;
    if (now > end) return LESSON_STATUS.ENDED;

    return LESSON_STATUS.UPCOMING;
  }, [start, item.delay, end]);

  const canEnterNow = useMemo(
    () => lessonStatus === "live" || canEnterLesson,
    [lessonStatus, canEnterLesson]
  );

  // Custom hooks
  const { statusText, statusColor, statusIcon } = useLessonStatus(
    item,
    start,
    end,
    timeRemaining,
    canEnterLesson,
    isExpired,
    lessonStatus
  );

  const { handleEnterLesson, handleOpenContent, handleCardClick } =
    useLessonHandlers(item, lessonStatus, canEnterNow, openStatusModal);

  return (
    <div className="relative">
      <div
        style={{ borderColor: color }}
        className={`flex flex-row items-center xs:items-stretch justify-between rounded-tr-4xl rounded-bl-4xl border-[0.5px] !border-l-gray-400 !border-t-gray-400 !border-b-gray-400 border-r-quran border-r-10 sm:border-r-14 w-full py-4 md:py-8 px-4 overflow-hidden`}
        // onClick={() =>
        //   lessonStatus !== LESSON_STATUS.ENDED && handleCardClick(setHintMsg)
        // }
        // role={lessonStatus !== LESSON_STATUS.ENDED ? "button" : undefined}
        // tabIndex={lessonStatus !== LESSON_STATUS.ENDED ? 0 : -1}
          onClick={() => {
            if (lessonStatus === LESSON_STATUS.ENDED) {
              if (!item?.lessons || item?.lessons?.length === 0) {
                setHintMsg("الحصة انتهت ولم يتم رفع المحتوي بعد");
              } else {
                setHintMsg("اضغط علي زر عرض المحتوي");
              }
              return;
            }
            // default behavior for non-ended states
            handleCardClick(setHintMsg);
          }}
          role="button"
          tabIndex={0}
      >
        <LessonInfo
          item={item}
          color={color}
          image={image}
          statusIcon={statusIcon}
          statusText={statusText}
          statusColor={statusColor}
        />

        {/* Right section */}
        <div className="flex flex-col items-center justify-center mr-auto xs:space-y-3.5 gap-2 xs:gap-0 px-2 relative z-10 space-y-2">
          <LessonButton
            delay={item.delay}
            lessonStatus={lessonStatus}
            canEnterNow={canEnterNow}
            onEnterLesson={handleEnterLesson}
            onOpenContent={handleOpenContent}
            lessons={item.lessons}
          />
        </div>
      </div>

      {/* {hintMsg && lessonStatus !== LESSON_STATUS.ENDED && lessonStatus !== LESSON_STATUS.DELAYED &&(
        <div className="mt-2 text-green-600 text-sm font-semibold">
          {hintMsg}
        </div>
      )} */}
        {hintMsg && (
          <div
            className={[
              "mt-2 text-sm font-semibold transition-opacity duration-300",
              lessonStatus === LESSON_STATUS.ENDED
                ? (!item?.lessons || item?.lessons?.length === 0 ? "text-red-600" : "text-[#ba7c28]")
                : (lessonStatus === LESSON_STATUS.DELAYED ? "text-gray-600" : "text-green-600"),
            ].join(" ")}
          >
            {hintMsg}
          </div>
        )}
    </div>
  );
};

export default LessonCard;