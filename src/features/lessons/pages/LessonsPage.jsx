import { useEffect } from "react";
import { HomeSupportBtn } from "../../../components/layout";
import { ScheduleSlider } from "../components";
import { useLessons } from "../hooks/useLessons";
import { useDispatch } from "react-redux";


const SchedulePage = () => {
  const { fetchLessons } = useLessons();

  const dispatch = useDispatch();
  
  useEffect(() => {
  
  dispatch(fetchLessons()) 
  }, [dispatch]);
  return (
    <div className="py-16">
      <ScheduleSlider />
      <HomeSupportBtn />
    </div>
  );
};

export default SchedulePage;
