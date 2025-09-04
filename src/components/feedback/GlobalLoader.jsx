// src/components/GlobalLoader.jsx
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "../../store/selectors";
import { Overlay, Spinner } from "./components";

const GlobalLoader = () => {
  const isLoading = useSelector(selectGlobalLoading);

  if (!isLoading) return null;

  return (
    <Overlay ariaLabel="Application is loading">
      <Spinner size={48} />
    </Overlay>
  );
};

export default GlobalLoader;
