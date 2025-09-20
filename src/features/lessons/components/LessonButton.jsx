import { FileIcon, SessionIcon } from "@/utils/icons";
import books from "@/assets/schedule/books.svg";
import sandGlass from "@/assets/schedule/sandGlass.svg";
import clock from "@/assets/schedule/clock.svg";
import delay from "@/assets/schedule/delay.svg";
import { LESSON_STATUS } from "../../../utils";

export const LessonButton = ({
  lessonStatus,
  canEnterNow,
  onEnterLesson,
  onOpenContent,
  lessons,
}) => {
  if (lessonStatus === LESSON_STATUS.ENDED) {
    return (
      <>
        <div className="flex justify-center items-center">
          <img
            loading="lazy"
            src={books}
            alt="ended"
            className="w-16 xs:w-auto"
          />
        </div>
        {lessons && (
          <button
            onClick={onOpenContent}
            className="px-4 py-2 text-nowrap text-xs md:text-base lg:text-lg font-semibold flex items-center justify-center gap-2 rounded-3xl bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked text-navyteal cursor-pointer"
          >
            <FileIcon />
            عرض المحتوى
          </button>
        )}
      </>
    );
  }

  if (lessonStatus === LESSON_STATUS.DELAYED) {
    return (
      <>
        <div className="flex justify-center items-center">
          <img
            loading="lazy"
            src={delay}
            alt="delayed"
            className="w-20 "
          />
        </div>
        {/* <button
          disabled
          aria-disabled
          className="px-4 py-2 text-nowrap text-xs md:text-base lg:text-lg font-semibold flex items-center justify-center gap-2 rounded-3xl bg-blue-200 text-blue-800 cursor-not-allowed"
        >
          الحصة مؤجلة
        </button> */}
      </>
    );
  }

  // 🟨 الحصص العادية (upcoming/live)
  const isEnabled = canEnterNow;
  const iconSrc = isEnabled ? sandGlass : clock;

  return (
    <>
      <div className="flex justify-center items-center">
        <img
          loading="lazy"
          src={iconSrc}
          alt="status"
          className="w-16 xs:w-auto"
        />
      </div>
      <button
        onClick={onEnterLesson}
        disabled={!isEnabled}
        aria-disabled={!isEnabled}
        title={isEnabled ? "دخول الحصة" : "سيتم تفعيل الزر عند بدء الحصة"}
        className={[
          "px-4 py-2 text-nowrap text-xs md:text-base lg:text-lg font-semibold flex items-center justify-center gap-2 rounded-3xl",
          isEnabled
            ? "bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked text-navyteal cursor-pointer"
            : "bg-[#7A8085] text-[#FAFBFC] cursor-not-allowed opacity-70",
        ].join(" ")}
      >
        <SessionIcon className="w-4 lg:w-6" />
        دخول الحصة
      </button>
    </>
  );
};
