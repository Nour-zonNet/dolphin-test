// src/components/GlobalLoader.jsx
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "../../store/selectors";

const GlobalLoader = () => {
  const isLoading = useSelector(selectGlobalLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-white/70">
      <div className="w-12 h-12 border-4 border-orangedeep border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoader;
