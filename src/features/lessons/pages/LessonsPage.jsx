import { HomeSupportBtn } from "@/components/layout";
import { ScheduleSlider } from "../components";
import withAuth from "@/features/auth/hoc/withAuth";


const SchedulePage = () => {

  

  return (
    <div className="py-16">
      <ScheduleSlider />
      <HomeSupportBtn />
    </div>
  );
};

const ProtectedComponent =withAuth(SchedulePage)
export default ProtectedComponent;