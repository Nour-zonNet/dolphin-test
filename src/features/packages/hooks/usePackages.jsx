import { useSelector, useDispatch } from "react-redux";
import { fetchAllPackages, fetchMyPackages } from "../store/packagesSlice";

export const usePackages = () => {
  const dispatch = useDispatch();
  const { all, mine, loading, error } = useSelector((state) => state.packages);

  return {
    all,
    mine,
    loading,
    error,
    fetchAllPackages: () => dispatch(fetchAllPackages()),
    fetchMyPackages: () => dispatch(fetchMyPackages()),
  };
};
