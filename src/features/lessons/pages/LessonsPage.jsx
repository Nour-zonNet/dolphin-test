import { HomeSupportBtn } from "@/components/layout";
import { ScheduleSlider } from "../components";

const SchedulePage = () => {
  return (
    <div className="py-36 md:py-41">
      <ScheduleSlider />
      <HomeSupportBtn className="fixed bottom-25 lg:bottom-24 right-0 z-50" />
    </div>
  );
};

export default SchedulePage;
