import { HomeSupportBtn } from "@/components/layout";
import { ScheduleSlider } from "../components";

const SchedulePage = () => {
  return (
    <div className="
      relative
      min-h-screen
      pt-28 md:pt-40    
      pb-28             
      overflow-x-hidden
      overflow-y-auto
    ">
      <div className="container mx-auto px-4">
        <ScheduleSlider />
      </div>

      {/* Wrap the fixed button so it doesn't block scroll/taps outside it */}
      <div className="fixed bottom-18 md:bottom-24 lg:bottom-24 right-0 z-50 pointer-events-none">
        <HomeSupportBtn className="pointer-events-auto" />
      </div>
    </div>
  );
};

export default SchedulePage;
