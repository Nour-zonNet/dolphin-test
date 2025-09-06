import { HomeSupportBtn } from "@/components";
import { HorizontalLine, VerticalLine } from "@/utils/Illustrations";
import { LessonHeader, VideoPlayer, AttachmentsSection, QuizSection } from "./components";

const LessonContentPage = () => {
  return (
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
    </>
  );
};

export default LessonContentPage;


