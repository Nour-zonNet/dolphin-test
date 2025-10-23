import { ScheduleSlider } from "../components";
import { useSessionRatingModal } from "@/features/lessons/hooks/useSessionRatingModal";
import { useModal } from "@/components/feedback/modal/useModal";
import { useEffect } from "react";

const SchedulePage = () => {
  const { openSessionRatingModal } = useModal();
  const { eligibleSessions, handleSubmitRatings, handleCloseModal, shouldShowModal } = useSessionRatingModal();

  // Handle showing the modal when shouldShowModal becomes true
  useEffect(() => {
    if (shouldShowModal && eligibleSessions.length > 0) {
      // Add a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        openSessionRatingModal(
          eligibleSessions,
          handleSubmitRatings,
          handleCloseModal
        );
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowModal, eligibleSessions, openSessionRatingModal, handleSubmitRatings, handleCloseModal]);

  return (
    <div className="pt-28 md:pt-41">
      <ScheduleSlider />
      
      {/* Debug button for testing */}
      <div className="fixed bottom-40 left-4 z-50">
        <button
          onClick={() => {
            openSessionRatingModal(
              eligibleSessions,
              handleSubmitRatings,
              handleCloseModal
            );
          }}
          className="px-3 py-2 bg-orangedeep text-navyteal text-sm rounded"
        >
          إضافة تقييم 
        </button>
      </div>
    </div>
  );
};

export default SchedulePage;