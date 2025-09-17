// hooks/useContent.js
import { useSelector, useDispatch } from "react-redux";
import {
  fetchContentByLessonId,
  selectContent,
  selectContentRaw,
  selectContentLoading,
  selectContentError,
} from "../store/contentSlice";

export const useContent = (lessonId) => {
  const dispatch = useDispatch();

  const content = useSelector((s) =>
    lessonId != null ? selectContent(s, lessonId) : null
  );
  const raw = useSelector((s) =>
    lessonId != null ? selectContentRaw(s, lessonId) : null
  );
  const loading = useSelector((s) =>
    lessonId != null ? selectContentLoading(s, lessonId) : s?.content?.loading
  );
  const error = useSelector((s) =>
    lessonId != null ? selectContentError(s, lessonId) : s?.content?.error
  );

  const getContent = (id) => dispatch(fetchContentByLessonId(id));

  return { content, raw, loading, error, getContent, fetchContentByLessonId };
};
