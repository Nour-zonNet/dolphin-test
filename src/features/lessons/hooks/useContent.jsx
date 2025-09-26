
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  fetchContentByLessonId,
  selectContent,
  selectContentRaw,
  selectContentLoading,
  selectContentError,
} from "../store/contentSlice";

const asKey = (id) => (id == null ? null : String(id));

export const useContent = (lessonId) => {
  const dispatch = useDispatch();
  const idKey = asKey(lessonId);

  const content = useSelector((s) => (idKey ? selectContent(s, idKey) : null));
  const raw = useSelector((s) => (idKey ? selectContentRaw(s, idKey) : null));

  const loading = useSelector((s) =>
    idKey ? selectContentLoading(s, idKey) : s?.content?.loading
  );
  const error = useSelector((s) =>
    idKey ? selectContentError(s, idKey) : s?.content?.error
  );

  const getContent = useCallback(
    (id) => dispatch(fetchContentByLessonId(id)),
    [dispatch]
  );

  return { content, raw, loading, error, getContent, fetchContentByLessonId };
};
