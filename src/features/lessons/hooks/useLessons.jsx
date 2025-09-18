
import { useSelector, useDispatch } from "react-redux";
import { fetchLessons, getSessionLink, clearLessonsError, clearSessionLink } from "../store/lessonsSlice";

export const useLessons = () => {
  const dispatch = useDispatch();
  const { items, link, loading, error } = useSelector((s) => s.lessons); 

  return {
    items,
    link,
    loading,
    error,
    fetchAll: () => dispatch(fetchLessons()),
    getLink: (roomUId) => dispatch(getSessionLink(roomUId)),
    clearError: () => dispatch(clearLessonsError()),
    clearLink: () => dispatch(clearSessionLink()),
  };
};
