// src/components/GlobalLoader.jsx
import { useSelector } from "react-redux";
import { selectGlobalLoading, selectGlobalError } from "../../store/selectors";
import { Overlay, Spinner } from "./components";
import { useEffect } from "react";
import { useModal } from "./modal/useModal";
import { MODAL_TYPES } from "../../constants/MODAL_TYPES";
import { useMediaQuery } from "react-responsive";

const GlobalLoader = () => {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const isTablet = useMediaQuery({ minWidth: 481, maxWidth: 800 });
  const isLoading = useSelector(selectGlobalLoading);
  const error = useSelector(selectGlobalError);
  const { openStatusModal } = useModal();
  useEffect(() => {
    if (error) {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "فشل العملية",
        message: error,
      });
    }
  }, [error, openStatusModal]);
  let spinnerSize = 100; 
  if (isTablet) spinnerSize = 80;
  if (isMobile) spinnerSize = 60;
  if (!isLoading) return null;
  return (
    <Overlay ariaLabel="Application is loading">
      <Spinner size={spinnerSize}/>
    </Overlay>
  );
};

export default GlobalLoader;
