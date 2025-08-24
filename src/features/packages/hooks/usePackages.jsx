import { useSelector } from "react-redux";
import { fetchPackages } from "../store/packagesSlice";

export const usePackages = () => {
  const { items, loading, error } = useSelector((state) => state.packages);

  return {
    items,
    loading,
    error,
    fetchPackages: fetchPackages,
  };
};
