import { useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";
import { useDispatch } from "react-redux";
import { getSessionLink } from "../store/lessonsSlice";

export const useLessonHandlers = (
  item,
  lessonStatus,
  canEnterNow,
  openStatusModal
) => {
  const navigate = useNavigate();
  const hintTimerRef = useRef(null);
  const dispatch = useDispatch();
  const handleEnterLesson = useCallback(async () => {
    try {
      // اطلب رابط الجلسة من الـ API
      const res = await dispatch(getSessionLink(item.id));

      if (res.error || !res.payload) {
        // لو في خطأ من الـ API
        openStatusModal(MODAL_TYPES.ERROR, {
          title: "خطأ في فتح الحصة",
          message: "حدث خطأ أثناء محاولة فتح الحصة. حاول مرة أخرى.",
          onConfirm: () => {},
          onClose: () => {},
        });
        return;
      }

      const sessionUrl =
        res.payload || `https://online.learnatdolphin.com/${item.session_link}`;

      const isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);
      const features = isMobile ? "_blank" : "_blank,noopener,noreferrer";

      const newWindow = window.open(sessionUrl, features);

      if (!newWindow) {
        openStatusModal(MODAL_TYPES.ERROR, {
          title: "لم يتم فتح الحصة",
          message:
            "المتصفح منع فتح نافذة جديدة. اضغط موافق لفتح الحصة في نفس النافذة.",
          onConfirm: () => (window.location.href = sessionUrl),
          onClose: () => {},
        });
      }
    } catch (error) {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "خطأ غير متوقع",
        message: "حدث خطأ غير متوقع أثناء محاولة فتح الحصة.",
        onConfirm: () => {},
        onClose: () => {},
      });
      console.error("handleEnterLesson error:", error);
    }
  }, [dispatch, item.id, item.session_link, openStatusModal]);

  // const handleOpenContent = useCallback(() => {
  //   navigate("/schedule/lessoncontent", {
  //     state: { lesson: item, lessonId: item?.id },
  //     replace: false,
  //   });
  // }, [navigate, item]);
  const handleOpenContent = useCallback(() => {
    navigate("/schedule/lessoncontent/" + item.lessons[0].id, {
      state: { lesson: item, lessonId: item?.id },
      replace: false,
    });
  }, [navigate, item]);

  const handleCardClick = useCallback(
    (setHintMsg) => {
      if (lessonStatus === "ended") return;

      hintTimerRef.current && clearTimeout(hintTimerRef.current);

      setHintMsg(
        canEnterNow ? "اضغط علي زر دخول الحصة للبدء" : "انتظر موعد بدء الحصة"
      );

      hintTimerRef.current = setTimeout(() => {
        setHintMsg("");
        hintTimerRef.current = null;
      }, 3500);
    },
    [lessonStatus, canEnterNow]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, []);

  return {
    handleEnterLesson,
    handleOpenContent,
    handleCardClick,
    hintTimerRef,
  };
};
