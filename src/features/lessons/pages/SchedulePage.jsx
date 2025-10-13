import { ScheduleSlider } from "../components";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { useSessionRatingModal } from "@/features/lessons/hooks/useSessionRatingModal";

const SchedulePage = () => {
  const dispatch = useDispatch();
  const { eligibleSessions, handleSubmitRatings, handleCloseModal } = useSessionRatingModal();

  return (
    <div className="pt-28 md:pt-41">
      <ScheduleSlider />
      {/* Temporary test button to open Session Rating Modal */}
      <div className="fixed bottom-30 left-4 z-50 cursor-pointer">
        <button
          type="button"
          onClick={() =>
            dispatch(
              openModal({
                type: MODAL_TYPES.SESSION_RATING,
                props: {
                  sessions: eligibleSessions,
                  onSubmit: handleSubmitRatings,
                  onClose: handleCloseModal,
                },
              })
            )
          }
          className="px-3 py-2 rounded-md bg-orangedeep text-navyteal text-sm shadow z-50 cursor-pointer"
        >
          إضافة تقييم  
        </button>

      </div>
    </div>
  );
};

export default SchedulePage;
