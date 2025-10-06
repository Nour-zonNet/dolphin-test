import { useMemo } from "react";
import { NotifyIcon, SandGlass, TimeCheck } from "@/utils/icons";
import { getArabicDay } from "../../../utils/dateHelpers";
import { Cross } from "lucide-react";
import { Cancel } from "../../../utils/icons";

export const useLessonStatus = (
  item,
  start,
  end,
  timeRemaining,
  canEnterLesson,
  isExpired,
  lessonStatus
) => {
  return useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lessonDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );

    if (lessonStatus === "canceled") {
      return {
        statusText: "الحصة ملغية",
        statusColor: "text-red-500",
        statusIcon: <Cancel className="w-4 fill-red-500 text-red-500" fill="red" />,
      };
    }

    if (lessonStatus === "delayed") {
      return {
        statusText: `تم تأجيل الحصة ليوم ${getArabicDay(
          item.delay.day_of_week
        )}`,
        statusColor: "text-gray-600",
        statusIcon: <TimeCheck  fill={"#111"} className="w-4" />,
      };
    }

    if (lessonDay < today) {
      return {
        statusText: "انتهت الحصة",
        statusColor: "text-[#4193C3]",
        statusIcon: <TimeCheck fill={"#4193C3"} className="w-4" />,
      };
    }

    // 🟨 إذا كانت ليست اليوم
    const isSameDay =
      start.getDate() === now.getDate() &&
      start.getMonth() === now.getMonth() &&
      start.getFullYear() === now.getFullYear();

    if (!isSameDay) {
      const dayNum = start.toLocaleDateString("en-US", {
        day: "numeric",
        timeZone: "Asia/Riyadh",
      });
      const monthName = start.toLocaleDateString("ar-EG", {
        month: "long",
        timeZone: "Asia/Riyadh",
      });
      const weekdayName = start.toLocaleDateString("ar-EG", {
        weekday: "long",
        timeZone: "Asia/Riyadh",
      });

      return {
        statusText: `الحصة يوم ${weekdayName} ${dayNum} ${monthName} `,
        statusColor: "text-[#ba7c28]",
        statusIcon: <SandGlass className="w-4" />,
      };
    }

    // 🟢 نفس اليوم → بناءً على الحالة
    switch (lessonStatus) {
      case "upcoming":
        if (timeRemaining && !isExpired && !canEnterLesson) {
          return {
            statusText: timeRemaining,
            statusColor: "text-[#ba7c28]",
            statusIcon: <SandGlass className="w-4" />,
          };
        } else if (canEnterLesson || isExpired) {
          return {
            statusText: "يمكن الدخول الآن",
            statusColor: "text-green-600",
            statusIcon: <NotifyIcon className="w-4" />,
          };
        }
        return {
          statusText: "قريباً",
          statusColor: "text-[#ba7c28]",
          statusIcon: <SandGlass className="w-4" />,
        };

      case "live":
        return {
          statusText: "الحصة بدأت",
          statusColor: "text-green-600",
          statusIcon: <NotifyIcon className="w-4" />,
        };

      case "ended":
        return {
          statusText: "انتهت الحصة",
          statusColor: "text-red-500",
          statusIcon: <TimeCheck className="w-4" />,
        };

      default:
        return {
          statusText: "انتهت الحصة",
          statusColor: "text-red-500",
          statusIcon: <TimeCheck className="w-4" />,
        };
    }
  }, [start, lessonStatus, item?.delay?.day_of_week, timeRemaining, isExpired, canEnterLesson]);
};
