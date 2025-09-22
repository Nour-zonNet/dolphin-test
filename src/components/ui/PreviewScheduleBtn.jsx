import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DatePicker } from "@/utils/icons";
import AllPackagesSchedulePopup from "@/features/lessons/pages/LessonContentPage/components/AllPackagesSchedulePopup";
import { useLessons } from "@/features/lessons/hooks/useLessons";

// Session keys (reset on page refresh/tab close)
const PRELOAD_DONE_KEY = "schedule_preloaded_this_session";
const LAST_FETCH_TS_KEY = "schedule_last_fetch_ts";

const PreviewScheduleBtn = ({
  groupInfos,
  preloadTTLms = 0, // set to e.g. 300000 to force refresh every 5 minutes within session
  className = "",
  label = "معاينة الجدول الاسبوعي",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preloading, setPreloading] = useState(false);
  const { refetch, items = [], loading } = useLessons();

  // cache session flags in refs for quick reads
  const sessionPreloadedRef = useRef(false);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    try {
      sessionPreloadedRef.current = sessionStorage.getItem(PRELOAD_DONE_KEY) === "1";
      const ts = Number(sessionStorage.getItem(LAST_FETCH_TS_KEY));
      lastFetchRef.current = Number.isFinite(ts) ? ts : 0;
    } catch {
      sessionPreloadedRef.current = false;
      lastFetchRef.current = 0;
    }
  }, []);

  // Lock scroll while preloading overlay is shown (iOS-safe)
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

  const shouldDoInitialPreload = () => {
    // 1) First time in this tab session?
    if (!sessionPreloadedRef.current) return true;

    // 2) TTL expired (optional)
    if (preloadTTLms && preloadTTLms > 0) {
      const now = Date.now();
      if (!lastFetchRef.current || now - lastFetchRef.current > preloadTTLms) {
        return true;
      }
    }

    // 3) If store is empty for some reason, fetch before opening
    if (!Array.isArray(items) || items.length === 0) return true;

    return false;
  };

  const handleOpen = useCallback(async (e) => {
    e?.stopPropagation?.();

    const needPreload = shouldDoInitialPreload();

    if (!needPreload) {
      setIsOpen(true);
      return;
    }

    try {
      setPreloading(true);
      await refetch();
      // mark session-preloaded and timestamp
      sessionPreloadedRef.current = true;
      lastFetchRef.current = Date.now();
      try {
        sessionStorage.setItem(PRELOAD_DONE_KEY, "1");
        sessionStorage.setItem(LAST_FETCH_TS_KEY, String(lastFetchRef.current));
      } catch {}
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

  // Full-page spinner overlay (portal to body)
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
