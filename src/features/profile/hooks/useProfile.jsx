import { useSelector } from "react-redux";

export const useProfile = () => {
  const { loading, error } = useSelector((state) => state.profile);
  const user = useSelector((state) => state.auth.user);
  // const dispatch = useDispatch();

  return {
    user,
    loading,
    error,
  };
};
