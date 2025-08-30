import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import teacherIcon from "@/assets/schedule/teacher.svg";
import groupIcon from "@/assets/schedule/group.svg";
import timeIcon from "@/assets/schedule/time.svg";
import timerIcon from "@/assets/schedule/timer.svg";
import clock from "@/assets/schedule/clock.svg";
// import { File } from "../../../utils/icons";
import { formatArabicTime, getRemainingTime } from "../../../utils/dateHelpers";

const LessonCard = ({ item, color, image }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative pt-7  max-w-[]">
      {/* highlight overlay */}
      <div
        style={{ borderColor: color }}
        className={`flex flex-row items-start xs:items-stretch justify-between rounded-tr-4xl rounded-bl-4xl border border-gray-400 border-r-quran border-r-10  sm:border-r-14  min-h-[200px] w-full py-4 px-4 overflow-hidden `}
      >
        {/* Left section */}
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="flex items-center gap-2 relative z-10 text- px-2">
            {image && (
              <div
                style={{ backgroundColor: color }}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded flex items-center justify-center"
              >
                <img src={image} alt={item.name} className="w-10 h-10 " />
              </div>
            )}
            <div>
              <h2 className="text-lg xs:text-[1.25rem] font-semibold leading-snug">
                {item.subject}
              </h2>
              <h2 className="text-lg xs:text-[1.25rem] font-semibold leading-snug">
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
                className="w-5 h-5 xs:w-6 xs:h-6"
              />
              <span className="text-status text-xs xs:text-base">
                {item.teacher ?? t('lessons.defaultTeacher')}
              </span>
            </div>
            <div className="font-semibold flex items-center gap-2">
              <img
                src={groupIcon}
                alt="group icon"
                className="w-5 h-5 xs:w-6 xs:h-6"
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
                className="w-5 h-5 xs:w-6 xs:h-6"
              />
              <span className="text-xs xs:text-base">
                {formatArabicTime(item.start_time)}
              </span>
            </div>
            <div className="font-semibold flex items-center gap-2">
              <img
                src={timerIcon}
                alt="timer icon"
                className="w-5 h-5 xs:w-6 xs:h-6"
              />
              <span className="text-xs xs:text-base">
                {getRemainingTime(item.start_time)}
             
              </span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-col items-center  justify-center mr-auto xs:space-y-3.5 gap-2 xs:gap-0 px-2 mt-4 xs:mt-0 relative z-10 xs-">
          <div className="flex justify-center text-center items-center align-middle">
            <img
              src={clock}
              alt="clock"
              className="cursor-pointer h-20 xs:w-auto"
            />
          </div>
          <button
            onClick={() => navigate("lessoncontent")}
            className="px-4 py-3 text-nowrap text-navyteal text-xs xs:text-[18px] font-semibold flex items-center justify-center gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-3xl "
          >
            {/* <img src={fileIcon} alt="fileIcon" /> */}
            {/* <File width="" /> */}
            {t('lessons.viewContent')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
