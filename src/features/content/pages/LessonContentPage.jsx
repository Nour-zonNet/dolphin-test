
import { HomeSupportBtn } from "../../../components";
import { AttachmentsSection } from "../attachments/components";
import { LessonHeader, VideoPlayer } from "../lesson/components";
import { QuizSection } from "../quiz/components";

export const LessonContentPage = () => {
  return (
    // Tablet Layout
    <>
      <LessonHeader />
    <div className="block lg:hidden">
      <div
        className="w-[95%] mx-auto bg-white overflow-hidden"
      >
          <VideoPlayer />
          <AttachmentsSection />
          <QuizSection />
          <HomeSupportBtn />
      </div>
    </div>

    {/* Desktop Layout */}
      <div
        className="hidden lg:flex lg:w-[92%] w-[95%] mx-auto bg-white overflow-hidden items-start justify-between mt-14 gap-20"
      >
        <div className="flex flex-col w-1/2 h-full">
            <VideoPlayer />
            <QuizSection />
        </div>
        {/* Right Side: Quiz */}
        <div className="w-1/2 h-full">
            <AttachmentsSection />
        </div>
        <HomeSupportBtn />
      </div>
    </>
  );
};

export default LessonContentPage