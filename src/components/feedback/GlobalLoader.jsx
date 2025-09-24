// src/components/GlobalLoader.jsx
import { useSelector } from "react-redux";
import { selectGlobalLoading, selectGlobalError } from "../../store/selectors";
import { Overlay, Spinner } from "./components";
import { useEffect } from "react";
import { useModal } from "./modal/useModal";
import { MODAL_TYPES } from "../../constants/MODAL_TYPES";
const GlobalLoader = () => {
  const isLoading = useSelector(selectGlobalLoading);
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
  if (!isLoading) return null;
  return (
    <Overlay ariaLabel="Application is loading">
      <Spinner />
    </Overlay>
  );
};

export default GlobalLoader;
