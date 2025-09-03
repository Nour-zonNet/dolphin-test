import { useSelector } from "react-redux";
import { fetchAllPackages, fetchMyPackages } from "../store/packagesSlice";

export const usePackages = () => {
  const { all, mine, loading, error } = useSelector((state) => state.packages);

  return {
    all,
    mine,
    loading,
    error,
    fetchAllPackages: fetchAllPackages,
    fetchMyPackages: fetchMyPackages,
  };
};
