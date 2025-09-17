import { HomeSupportBtn } from "@/components";
import { HorizontalLine, VerticalLine } from "@/utils/Illustrations";
import { useContent } from "../../hooks/useContent";
import {
  LessonHeader,
  VideoPlayer,
  AttachmentsSection,
  QuizSection,
} from "./components";
import { useParams } from "react-router-dom";

const LessonContentPage = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const lessonId = Number.isFinite(numericId) ? numericId : undefined;

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
            <div className="w-full mb-10">
              <AttachmentsSection />
              <QuizSection lessonId={lessonId} />
            </div>
          </div>
          <HomeSupportBtn />
        </div>
      </div>
    </>
  );
};

export default LessonContentPage;
