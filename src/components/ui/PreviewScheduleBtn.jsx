// src/features/lessons/components/PreviewScheduleBtn.jsx
import React, { useState, useCallback, useRef } from "react";
import { DatePicker } from "@/utils/icons";
import AllPackagesSchedulePopup from "@/features/lessons/pages/LessonContentPage/components/AllPackagesSchedulePopup";
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons } from "../../features/lessons/store/lessonsSlice";

const PreviewScheduleBtn = ({
  groupInfos,
  preloadTTLms = 0,
  className = "",
  label = "معاينة الجدول الاسبوعي",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const items = useSelector((s) => s.lessons?.items || []);

  const preloadDoneThisPageRef = useRef(false);
  const lastFetchRef = useRef(0);

  const shouldPreloadNow = () => {
    if (!preloadDoneThisPageRef.current) return true;

    if (preloadTTLms && preloadTTLms > 0) {
      const now = Date.now();
      if (!lastFetchRef.current || now - lastFetchRef.current > preloadTTLms) {
        return true;
      }
    }

    if (!Array.isArray(items) || items.length === 0) return true;

    return false;
  };

  const handleOpen = useCallback(
    async (e) => {
      e?.stopPropagation?.();

      const needPreload = shouldPreloadNow();
      if (!needPreload) {
        setIsOpen(true);
        return;
      }

      try {
        await dispatch(fetchLessons()).unwrap();
        preloadDoneThisPageRef.current = true;
        lastFetchRef.current = Date.now();
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to preload schedule:", err);
        alert("تعذر تحميل الجدول الآن. حاول مرة أخرى.");
      }
    },
    [dispatch, items, preloadTTLms]
  );

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`flex items-center justify-center gap-2 bg-orangedeep text-darkblue px-4 lg:px-6 py-2.5 lg:py-3 rounded-full w-full mx-auto my-6 lg:my-0 hover:bg-btnClicked focus:bg-btnClicked cursor-pointer ${className}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-busy="false"
      >
        <DatePicker className="w-4 md:w-6" />
        <span className="text-nowrap text-sm md:text-base font-semibold lg:font-medium">
          {label}
        </span>
      </button>

      <AllPackagesSchedulePopup
        open={isOpen}
        onClose={handleClose}
        groupInfos={groupInfos}
      />
    </>
  );
};

export default PreviewScheduleBtn;
