import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DatePicker } from "@/utils/icons";
import AllPackagesSchedulePopup from "@/features/lessons/pages/LessonContentPage/components/AllPackagesSchedulePopup";
import { useLessons } from "@/features/lessons/hooks/useLessons";

/**
 * Props:
 * - groupInfos: optional filter
 * - preloadTTLms: if > 0, show spinner + refetch again when last fetch is older than TTL
 *   e.g. preloadTTLms={300000} for 5 minutes. Default 0 = only first open after page load.
 * - className, label: UI props
 */
const PreviewScheduleBtn = ({
  groupInfos,
  preloadTTLms = 0,
  className = "",
  label = "معاينة الجدول الاسبوعي",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preloading, setPreloading] = useState(false);
  const { refetch, items = [] } = useLessons();

  // These refs reset on each page load (module init / React mount), so they
  // naturally give you "first time after refresh" behavior.
  const preloadDoneThisPageRef = useRef(false);
  const lastFetchRef = useRef(0);

  // Lock scroll while the full-screen spinner shows (iOS-safe)
  useEffect(() => {
    if (!preloading) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [preloading]);

  const shouldPreloadNow = () => {
    // 1) First open after this page load?
    if (!preloadDoneThisPageRef.current) return true;

    // 2) TTL expired within this page session?
    if (preloadTTLms && preloadTTLms > 0) {
      const now = Date.now();
      if (!lastFetchRef.current || now - lastFetchRef.current > preloadTTLms) {
        return true;
      }
    }

    // 3) Safety: if store is empty for any reason, fetch before opening
    if (!Array.isArray(items) || items.length === 0) return true;

    return false;
  };

  const handleOpen = useCallback(async (e) => {
    e?.stopPropagation?.();

    const needPreload = shouldPreloadNow();
    if (!needPreload) {
      setIsOpen(true);
      return;
    }

    try {
      setPreloading(true);
      await refetch(); // this should populate items in your store/hook
      preloadDoneThisPageRef.current = true;
      lastFetchRef.current = Date.now();
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to preload schedule:", err);
      alert("تعذر تحميل الجدول الآن. حاول مرة أخرى.");
    } finally {
      setPreloading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, items, preloadTTLms]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  // Full-page spinner overlay (portal so it covers the whole page)
  const overlay = preloading
    ? createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <div
            className="h-12 w-12 rounded-full border-4 border-orangedeep border-t-transparent animate-spin"
            role="status"
            aria-label="جاري التحميل"
          />
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`flex items-center justify-center gap-2 bg-orangedeep text-darkblue px-4 lg:px-6 py-2.5 lg:py-3 rounded-full w-full mx-auto my-6 lg:my-0 hover:bg-btnClicked focus:bg-btnClicked cursor-pointer ${className}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-busy={preloading ? "true" : "false"}
      >
        <DatePicker className="w-4 md:w-6" />
        <span className="text-nowrap text-sm md:text-base font-semibold lg:font-medium">
          {label}
        </span>
      </button>

      {overlay}

      <AllPackagesSchedulePopup
        open={isOpen}
        onClose={handleClose}
        groupInfos={groupInfos}
      />
    </>
  );
};

export default PreviewScheduleBtn;
