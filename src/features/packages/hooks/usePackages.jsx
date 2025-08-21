import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "../store/packagesSlice";

export const usePackages = () => {
  const { items, loading, error } = useSelector((state) => state.packages);
  const dispatch = useDispatch();

  return {
    items,
    loading,
    error,
    fetchPackages: () => dispatch(fetchPackages()),
  };
};
