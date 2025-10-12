import { useState } from "react";
import { ScheduleSlider } from "../components";
import SessionRatingModal from "../../../components/feedback/modal/modals/SessionRatingModal";
import { useSessionRatingModal } from "../hooks/useSessionRatingModal";

const SchedulePage = () => {
  const {
    isModalOpen,
    shouldShowModal,
    handleSubmitRatings,
    handleCloseModal,
    yesterdaySessions
  } = useSessionRatingModal();

  return (
    <div className="pt-28 md:pt-41">
      <ScheduleSlider />
      
      {/* Session Rating Modal */}
      {shouldShowModal && yesterdaySessions && yesterdaySessions.length > 0 && (
        <SessionRatingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRatings}
          sessions={yesterdaySessions}
        />
      )}
    </div>
  );
};

export default SchedulePage;
