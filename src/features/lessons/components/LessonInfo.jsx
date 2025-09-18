import { useMemo, useState, useEffect } from "react";
import { useModal } from "@/components/feedback/modal/useModal";
import { useCountdown } from "../hooks/useCountdown";
import { useLessonStatus } from "./useLessonStatus";
import { useLessonHandlers } from "./useLessonHandlers";
import { LessonButton } from "./LessonButton";
import { LessonInfo } from "./LessonInfo";

const LessonCard = ({ item, color, image, lessonDate }) => {
  const { openStatusModal } = useModal();
  const [hintMsg, setHintMsg] = useState("");

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
    const lessonDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    if (lessonDay < today) return "ended";
    if (now >= start && now <= end) return "live";
    if (now > end) return "ended";

    return "upcoming";
  }, [start, end]);

  const canEnterNow = useMemo(
    () => lessonStatus === "live" || canEnterLesson || isExpired,
    [lessonStatus, canEnterLesson, isExpired]
  );

  // Custom hooks
  const { statusText, statusColor, statusIcon } = useLessonStatus(
    item, start, end, timeRemaining, canEnterLesson, isExpired, lessonStatus
  );

  const { handleEnterLesson, handleOpenContent, handleCardClick, hintTimerRef } = 
    useLessonHandlers(item, lessonStatus, canEnterNow, openStatusModal);

  // Cleanup
  useEffect(() => {
    return () => {
      hintTimerRef.current && clearTimeout(hintTimerRef.current);
    };
  }, [hintTimerRef]);

  return (
    <div className="relative">
      <div
        style={{ borderColor: color }}
        className={`flex flex-row items-center xs:items-stretch justify-between rounded-tr-4xl rounded-bl-4xl border-[0.5px] !border-l-gray-400 !border-t-gray-400 !border-b-gray-400 border-r-quran border-r-10 sm:border-r-14 w-full py-4 md:py-8 px-4 overflow-hidden`}
        onClick={() => handleCardClick(setHintMsg)}
        role={lessonStatus !== "ended" ? "button" : undefined}
        tabIndex={lessonStatus !== "ended" ? 0 : -1}
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
            lessonStatus={lessonStatus}
            canEnterNow={canEnterNow}
            onEnterLesson={handleEnterLesson}
            onOpenContent={handleOpenContent}
          />
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