import { HomeSupportBtn } from "../../../components";
import { HorizontalLine, VerticalLine } from "@/utils/Illustrations";
import { AttachmentsSection } from "../attachments/components";
import { LessonHeader, VideoPlayer } from "../lesson/components";
import { QuizSection } from "../quiz/components";

export const LessonContentPage = () => {
  return (
    // Tablet Layout
    <>
      <LessonHeader />
      <div className="">
        <div className="w-[90%] mx-auto flex items-center flex-col xl:flex-row gap-14 mt-10 md:mt-14 bg-white overflow-hidden">
          <div className="xl:w-1/2 w-full">
            <VideoPlayer />
          </div>
          <div className="flex flex-col xl:flex-row items-center gap-10 xl:w-1/2 w-full">
            <VerticalLine className="hidden xl:flex" />
            <HorizontalLine className="flex xl:hidden w-[100%]" />
            <div className="w-full">
              <AttachmentsSection />
              <QuizSection />
            </div>
          </div>
          <HomeSupportBtn />
        </div>
      </div>

      {/* Desktop Layout */}
      {/* <div className="hidden lg:flex lg:w-[90%] w-[95%] mx-auto bg-white overflow-hidden items-center justify-between mt-14 gap-20"> */}
        {/* <div className="flex flex-col w-1/2 h-full">
          <VideoPlayer />
        </div> */}
        {/* Right Side: Quiz */}
        {/* <div className="w-1/2 h-full">
          <AttachmentsSection />
          <QuizSection />
        </div>
        <HomeSupportBtn />
      </div> */}
    </>
  );
};

export default LessonContentPage;
