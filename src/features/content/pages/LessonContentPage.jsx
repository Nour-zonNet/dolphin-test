
import { HomeSupportBtn } from "../../../components";
import { AttachmentsSection } from "../attachments/components";
import { LessonHeader, VideoPlayer } from "../lesson/components";
import { QuizSection } from "../quiz/components";

export const LessonContentPage = () => {
  return (
    <>
      <LessonHeader />
    <div
      className=" w-[95%] mx-auto bg-white overflow-hidden"
    >
      <VideoPlayer />
      <AttachmentsSection />
      <QuizSection />
      <HomeSupportBtn />
    </div>
    </>
  );
};

export default LessonContentPage