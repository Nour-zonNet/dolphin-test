// src/components/feedback/GlobalLoader.jsx
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "../../store/selectors";
import { Overlay, Spinner } from "./components";

const GlobalLoader = () => {
  const isLoading = useSelector(selectGlobalLoading);

  if (!isLoading) return null;
  
  return (
    <Overlay ariaLabel="Application is loading">
      <Spinner />
    </Overlay>
  );
};

export default GlobalLoader;
