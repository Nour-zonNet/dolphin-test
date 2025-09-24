// src/components/feedback/GlobalError.jsx
import { useSelector } from "react-redux";
import { selectGlobalError } from "../../store/selectors";
import { useEffect } from "react";
import { useModal } from "./modal/useModal";
import { MODAL_TYPES } from "../../constants/MODAL_TYPES";

const GlobalError = () => {
  const error = useSelector(selectGlobalError);
  const { openStatusModal } = useModal();

  useEffect(() => {
    if (error) {
      openStatusModal(MODAL_TYPES.ERROR, {
        // title: "فشل العملية",
        message: error,
      });
    }
  }, [error, openStatusModal]);

  // This component doesn't render anything visible
  // It only handles error side effects
  return null;
};

export default GlobalError;
