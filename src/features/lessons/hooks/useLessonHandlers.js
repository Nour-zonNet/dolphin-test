import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/components/feedback/modal/useModal";
import { MODAL_TYPES } from "@/constants/MODAL_TYPES";

export const useLessonHandlers = (item, lessonStatus, canEnterNow, openStatusModal) => {
  const navigate = useNavigate();
  const hintTimerRef = useRef(null);

  const handleEnterLesson = useCallback(() => {
    const url = `https://online.learnatdolphin.com/${item.session_link}`;
    const isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);
    const features = isMobile ? "_blank" : "_blank,noopener,noreferrer";

    const newWindow = window.open(url, features);

    if (!newWindow) {
      openStatusModal(MODAL_TYPES.ERROR, {
        title: "لم يتم فتح الحصة",
        message: "المتصفح منع فتح نافذة جديدة. اضغط موافق لفتح الحصة في نفس النافذة.",
        onConfirm: () => window.location.href = url,
        onClose: () => {},
      });
    }
  }, [item.session_link, openStatusModal]);

  const handleOpenContent = useCallback(() => {
    navigate("/schedule/lessoncontent", {
      state: { lesson: item, lessonId: item?.id },
      replace: false,
    });
  }, [navigate, item]);

  const handleCardClick = useCallback((setHintMsg) => {
    if (lessonStatus === "ended") return;

    hintTimerRef.current && clearTimeout(hintTimerRef.current);
    
    setHintMsg(canEnterNow 
      ? "اضغط علي زر دخول الحصة للبدء" 
      : "انتظر موعد بدء الحصة"
    );

    hintTimerRef.current = setTimeout(() => {
      setHintMsg("");
      hintTimerRef.current = null;
    }, 3500);
  }, [lessonStatus, canEnterNow]);

  return {
    handleEnterLesson,
    handleOpenContent,
    handleCardClick,
    hintTimerRef
  };
};