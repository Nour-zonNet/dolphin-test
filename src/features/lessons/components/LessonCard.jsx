import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import teacherIcon from "@/assets/schedule/teacher.svg";
import groupIcon from "@/assets/schedule/group.svg";
import timeIcon from "@/assets/schedule/time.svg";
import clock from "@/assets/schedule/clock.svg";
// import { File } from "../../../utils/icons";
import { formatArabicTime, getRemainingTime } from "../../../utils/dateHelpers";
import { SandGlass } from "../../../utils/icons";

const LessonCard = ({ item, color, image }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative  ">
      {/* highlight overlay */}
      <div
        style={{ borderColor: color }}
        className={`flex flex-row items-start xs:items-stretch justify-between rounded-tr-4xl rounded-bl-4xl border-[0.5px] !border-l-gray-400 !border-t-gray-400 !border-b-gray-400 border-r-quran border-r-10  sm:border-r-14   w-full py-4 md:py-8 px-4 overflow-hidden `}
      >
        {/* Left section */}
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="flex items-center gap-2 relative z-10 text- px-2">
            {image && (
              <div
                style={{ backgroundColor: color }}
                className="w-10 h-9 sm:w-12 sm:h-12 rounded-md flex items-center justify-center"
              >
                <img src={image} alt={item.name} className="w-10 h-9 " />
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
                {item.teacher ?? t("lessons.defaultTeacher")}
              </span>
            </div>
            <div className="font-semibold flex items-center gap-2">
              <img
                src={groupIcon}
                alt="group icon"
                className="w-4 h-4 xs:w-6 xs:h-6"
              />
              <span className="text-status text-xs xs:text-base">
                {item.group}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex flex-wrap  flex-col sm:flex-row   gap-3 mt-4 xs:mt-6 px-2 relative z-10">
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
              <SandGlass className="h-4 w-4" />
              <span className="text-xs xs:text-base text-[#ba7c28]">
                {getRemainingTime(item.start_time)}
              </span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-col items-center  justify-center mr-auto xs:space-y-3.5 gap-2 xs:gap-0 px-2 mt-4 xs:mt-0 relative z-10 space-y-2">
          <div className="flex justify-center text-center items-center align-middle">
            <img
              src={clock}
              alt="clock"
              className="cursor-pointer h-16 xs:w-auto"
            />
          </div>
          <button
            onClick={() => navigate("lessoncontent")}
            className="px-4 py-2 text-nowrap text-navyteal text-xs xs:text-[18px] font-semibold flex items-center justify-center gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-3xl "
          >
            <svg
              width="24"
              height="18"
              className="w-4 h-4"
              viewBox="0 0 24 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.075 2.695C1.738 2.363 2.518 2.433 3.112 2.878L5.056 4.76C5.42 2.077 7.72 0 10.5 0H18.5C21.533 0 24 2.468 24 5.5V12.5C24 15.532 21.533 18 18.5 18H10.5C7.728 18 5.433 15.935 5.059 13.264L3.112 15.11C2.766 15.368 2.359 15.501 1.947 15.501C1.612 15.501 1.275 15.414 0.966999 15.236C0.337 14.872 0 14.148 0 13.42V4.434C0 3.693 0.412001 3.026 1.075 2.695ZM8 12.5C8 13.879 9.121 15 10.5 15H18.5C19.878 15 21 13.879 21 12.5V5.5C21 4.121 19.878 3 18.5 3H10.5C9.121 3 8 4.121 8 5.5V12.5Z"
                fill="#061A2F"
              />
            </svg>
            {/* <img src={fileIcon} alt="fileIcon" /> */}
            {/* <File width="" /> */}
            {/* {t("lessons.viewContent")} */}
            دخول الحصة
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
