import { useState } from "react";
import { ScheduleSlider } from "../components";

const SchedulePage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitRatings = (ratings) => {
    console.log('User ratings:', ratings);
    // Handle the submission (API call, etc.)
    setIsModalOpen(false);
  };

  return (
    <div className="pt-28 md:pt-41">
      <ScheduleSlider />
      <div>
    </div>
    </div>
  );
};

export default SchedulePage;
