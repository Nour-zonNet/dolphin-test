import { useTranslation } from "react-i18next";
import teacherIcon from "@/assets/schedule/teacher.svg";
import groupIcon from "@/assets/schedule/group.svg";
import timeIcon from "@/assets/schedule/time.svg";
import { formatArabicTime } from "@/utils/dateHelpers";

export const LessonInfo = ({
  item,
  color,
  image,
  statusIcon,
  statusText,
  statusColor,
}) => {
  const { t } = useTranslation();

  return (
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
          <h2 className="text-sm text-navyteal md:text-[1.25rem] font-semibold leading-snug">
            {item.subject}
          </h2>
          <h2 className="text-sm text-navyteal md:text-[1.25rem] font-semibold leading-snug">
            {item.description}
          </h2>
        </div>
      </div>

      {/* Teacher & Group */}
      <div className="flex  items-center  space-x-3 mt-4 xs:mt-6 px-2 relative z-10">
        <div className="font-semibold flex items-center gap-2">
          <img
            src={teacherIcon}
            alt="teacher icon"
            loading="lazy"
            className="w-4 h-4 xs:w-6 xs:h-6"
          />
          <span className="text-status text-nowrap text-xs md:text-base">
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
          <span className="text-status text-nowrap text-xs xs:text-base md:text-lg">
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
          <span className="text-xs md:text-base">
            {formatArabicTime(item.start_time)}
          </span>
        </div>
        <div className="font-semibold flex items-center gap-2">
          {statusIcon}
          <span className={`text-xs md:text-base font-semibold ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
};
