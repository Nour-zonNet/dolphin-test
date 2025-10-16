import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Cross, Clock, Teacher, ChevronDown, PrintIcon, LeftArrow } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { formatTime12Hour } from "@/utils/dateHelpers";
import Divider from "@/components/ui/Divider";

const WEEK_ORDER = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function normalizeDay(dayRaw, startDate) {
  if (dayRaw == null) {
    if (startDate) {
      const d = new Date(startDate);
      return WEEK_ORDER[d.getDay()] || null;
    }
    return null;
  }
  const n = Number(dayRaw);
  if (!Number.isNaN(n)) {
    if (n >= 0 && n <= 6) return WEEK_ORDER[n];
    if (n >= 1 && n <= 7) return WEEK_ORDER[(n - 1) % 7];
  }
  const s = String(dayRaw).trim().toLowerCase();

  const EN = {
    sunday: "sunday",
    sun: "sunday",
    monday: "monday",
    mon: "monday",
    tuesday: "tuesday",
    tue: "tuesday",
    tues: "tuesday",
    wednesday: "wednesday",
    wed: "wednesday",
    thursday: "thursday",
    thu: "thursday",
    thurs: "thursday",
    friday: "friday",
    fri: "friday",
    saturday: "saturday",
    sat: "saturday",
  };
  if (EN[s]) return EN[s];

  const AR = {
    الأحد: "sunday",
    الاحد: "sunday",
    احد: "sunday",
    الاثنين: "monday",
    الإثنين: "monday",
    الاثنينِ: "monday",
    اثنين: "monday",
    إثنين: "monday",
    الثلاثاء: "tuesday",
    ثلاثاء: "tuesday",
    الأربعاء: "wednesday",
    الاربعاء: "wednesday",
    اربعاء: "wednesday",
    الخميس: "thursday",
    خميس: "thursday",
    الجمعة: "friday",
    جمعه: "friday",
    الجمعةِ: "friday",
    السبت: "saturday",
    سبت: "saturday",
  };
  const sAr = s.replace(/أ|إ|آ/g, "ا").replace(/ة/g, "ه").replace(/\s+/g, "");
  for (const k of Object.keys(AR)) {
    const keyNorm = k.replace(/أ|إ|آ/g, "ا").replace(/ة/g, "ه");
    if (sAr === keyNorm) return AR[k];
  }
  if (startDate) {
    const d = new Date(startDate);
    return WEEK_ORDER[d.getDay()] || null;
  }
  return null;
}

const AllPackagesSchedulePopup = ({ open, onClose, setOpen, groupInfos }) => {
  const { t } = useTranslation();
  // We just read what's already in the store; preloading happens in the button.
  const { items, error } = useLessons();
  const [isPrinting, setIsPrinting] = useState(false);
  
  const close = useCallback(() => {
    if (typeof onClose === "function") onClose();
    else if (typeof setOpen === "function") setOpen(false);
  }, [onClose, setOpen]);

  const handlePrint = useCallback(() => {
    setIsPrinting(true);
    
    // Create a hidden iframe to load the weekly schedule and print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      // Wait for content to be fully loaded and rendered
      setTimeout(() => {
        try {
          // Check if the iframe content is ready
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc.readyState === 'complete') {
            iframe.contentWindow.print();
            // Remove iframe after printing
            setTimeout(() => {
              document.body.removeChild(iframe);
              setIsPrinting(false);
            }, 1000);
          } else {
            // Wait for document to be ready
            iframeDoc.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                iframe.contentWindow.print();
                setTimeout(() => {
                  document.body.removeChild(iframe);
                  setIsPrinting(false);
                }, 1000);
              }, 500);
            });
          }
        } catch (error) {
          console.error('Print failed:', error);
          // Fallback: try opening in new window
          const printWindow = window.open("/weekly-schedule", "_blank");
          if (printWindow) {
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print();
                setTimeout(() => {
                  printWindow.close();
                  setIsPrinting(false);
                }, 1000);
              }, 1000);
            };
          }
          document.body.removeChild(iframe);
          setIsPrinting(false);
        }
      }, 2000); // Wait 2 seconds for full content load
    };
    
    iframe.src = "/weekly-schedule";
  }, []);

  // Lock scroll + ESC while visible (iOS-safe)
  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // ---- Data shaping (no fetching here) ----
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (!Array.isArray(groupInfos) || groupInfos.length === 0) return items;
  
    // Step 1: Match only sessions that have same subject, start_time, day_of_week
    const matched = items.filter((item) =>
      groupInfos.some(
        (g) =>
          g.subject === item.subject &&
          g.start_time === item.start_time &&
          g.day_of_week === item.day_of_week
      )
    );
  
    // Step 2: Remove duplicates (keep unique combinations)
    const seen = new Set();
    const unique = matched.filter((it) => {
      const key = `${it.subject}-${it.start_time}-${it.day_of_week}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  
    return unique;
  }, [items, groupInfos]);

  const mergedByDay = useMemo(() => {
    const out = {};
  
    (filteredItems || []).forEach((it) => {
      const dayKey = normalizeDay(
        it.day_of_week ?? it.day ?? it.weekday ?? null,
        it.start_date ?? it.date ?? it.session_date
      );
      if (!dayKey) return;
  
      const item = {
        ...it,
        __time: it.start_time || it.time || it.session_time || it.startTime || "",
        __subject: it.subject || it.name || it.title || "",
        __group: it.group || it.group_name || it.package_name || "",
        __teacher: it.teacher_name || it.teacher || "",
      };
  
      // initialize day array if needed
      out[dayKey] ||= [];
  
      // ✅ only add if that time doesn't already exist for this day
      const alreadyExists = out[dayKey].some(
        (existing) => existing.__time === item.__time
      );
      if (!alreadyExists) {
        out[dayKey].push(item);
      }
    });
  
    // sort by time
    for (const d of Object.keys(out)) {
      out[d].sort((a, b) => String(a.__time).localeCompare(String(b.__time)));
    }
  
    return out;
  }, [filteredItems]);

  const days = useMemo(
    () =>
      Object.keys(mergedByDay).sort(
        (a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b)
      ),
    [mergedByDay]
  );
  const hasAnyLessons = days.some((d) => (mergedByDay[d] || []).length > 0);

  const [openDays, setOpenDays] = useState({});
  const panelRefs = useRef({});

  useEffect(() => {
    const init = {};
    days.forEach((d) => {
      const count = (mergedByDay[d] || []).length;
      init[d] = count === 1; // auto-open if only one card
    });
    setOpenDays(init);
  }, [days, mergedByDay]);

  const setPanelRef = useCallback(
    (day) => (el) => {
      if (!el) return;
      panelRefs.current[day] = el;
      el.style.overflow = "hidden";
      el.style.transition = "max-height 300ms ease";
      el.style.maxHeight = openDays[day] ? el.scrollHeight + "px" : "0px";
    },
    [openDays]
  );

  const toggleDay = useCallback((day) => {
    const el = panelRefs.current[day];
    setOpenDays((prev) => {
      const next = !prev[day];
      if (el) el.style.maxHeight = next ? el.scrollHeight + "px" : "0px";
      return { ...prev, [day]: next };
    });
  }, []);

  useEffect(() => {
    days.forEach((d) => {
      const el = panelRefs.current[d];
      if (!el) return;
      el.style.maxHeight = openDays[d] ? el.scrollHeight + "px" : "0px";
    });
  }, [days, mergedByDay, openDays]);

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-[9999]" onClick={close}>
      {/* Backdrop: ONLY here we close on click */}
      <div className="absolute inset-0 h-screen bg-black/20" onClick={close} />

      {/* Content: stop click bubbling so it doesn't close */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className="relative w-[90%] max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="معاينة الجدول الاسبوعي"
        >
          <div className="flex justify-between items-center pt-6 pb-2 sticky top-0 bg-white z-10 px-4 sm:px-6">
            <h2 className="text-[#185A80] text-base md:text-xl xl:text-2xl font-bold w-full text-center">
              معاينة الجدول الاسبوعي
            </h2>
            <button
              onClick={close}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 border border-black/20 p-2 rounded-full cursor-pointer"
              aria-label={t("common.close")}
            >
              <Cross width="16" height="16" />
            </button>
          </div>
          <Divider />

          {/* Content (no loader here; data was preloaded) */}
          {!error && (days.length === 0 || !hasAnyLessons) && (
            <div className="px-4 sm:px-6 py-12 text-center text-gray-600">
              لا يوجد حصص لهذا الأسبوع
            </div>
          )}

          {!error && days.length > 0 && hasAnyLessons && (
            <div className="px-4 sm:px-6 pb-6">
              <div className="-m-2 flex flex-wrap items-start">
                {days.map((day) => {
                  const list = mergedByDay[day] || [];
                  const count = list.length;
                  const isSingle = count === 1;
                  const isOpen = !!openDays[day];

                  return (
                    <div key={day} className="w-full md:w-1/2 lg:w-1/3 p-2">
                      <div className="bg-[#E8F0F4] rounded-2xl p-4">
                        {/* Header row becomes a button so the entire area toggles */}
                        <button
                          type="button"
                          onClick={() => toggleDay(day)} // ⬅️ click anywhere (label or chevron)
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 bg-[#B8CFDC] rounded-lg
                            ${
                              count > 1
                                ? "text-navyteal hover:text-[#0d3d56] cursor-pointer"
                                : "cursor-default"
                            }`}
                          aria-expanded={isOpen}
                          aria-controls={`day-panel-${day}`}
                          // Optional: if you ONLY want toggle when there are multiple items, guard it:
                          // onClick={() => count > 1 && toggleDay(day)}
                        >
                          <h3 className="text-navyteal font-semibold text-base sm:text-lg">
                            {t(`lessons.${day}`)}
                          </h3>

                          {count > 1 && (
                            <span
                              className="transition-transform duration-300"
                              aria-hidden="true"
                            >
                              {isOpen ? (
                                <LeftArrow className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </button>

                        <div
                          className={`${
                            isOpen ? "mt-4" : "mt-0 pb-0"
                          } transition-[margin,padding] duration-200`}
                        >
                          {isSingle && isOpen && (
                            <div className="flex items-start justify-between bg-white rounded-xl p-3 shadow-sm">
                              <div className="flex flex-col text-darkblue">
                                <span className="text-navyteal text-sm font-semibold">
                                  {list[0].__subject || "—"}
                                </span>
                                {list[0].__group ? (
                                  <span className="text-xs text-gray-500 mt-2">
                                    {list[0].__group}
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-1 flex flex-col items-center gap-2 text-sm text-[#AE7426]">
                                <div className="flex items-center gap-2">
                                  <Clock width="16" height="16" />
                                  <span className="font-medium">
                                    {formatTime12Hour(list[0].__time)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Teacher width="16" height="16" />
                                  <span className="font-medium">
                                    {list[0].__teacher || "—"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {count > 1 && (
                            <div
                              id={`day-panel-${day}`}
                              ref={setPanelRef(day)}
                              className={isOpen ? "pt-1" : ""}
                            >
                              <div className="grid grid-cols-1 gap-4">
                                {list.map((it, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start justify-between bg-white rounded-xl p-3 shadow-sm"
                                  >
                                    <div className="flex flex-col text-darkblue">
                                      <span className="text-navyteal text-sm font-semibold">
                                        {it.__subject || "—"}
                                      </span>
                                      {it.__group ? (
                                        <span className="text-xs text-gray-500 mt-2">
                                          {it.__group}
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="mt-1 flex flex-col items-center gap-2 text-sm text-[#AE7426]">
                                      <div className="flex items-center gap-2">
                                        <Clock width="16" height="16" />
                                        <span className="font-medium">
                                          {formatTime12Hour(it.__time)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Teacher width="16" height="16" />
                                        <span className="font-medium">
                                          {it.__teacher || "—"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {count === 0 && (
                            <div className="text-center text-sm text-gray-500 py-2">
                              {t("packages.noLesson")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center mt-8 px-6 gap-4">
                {/* ✅ زر عائم للطباعة */}
                <button
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className={`mx-auto text-orangedeep border border-orangedeep p-2 rounded flex items-center justify-center transition-all print:hidden z-50 gap-2 ${
                    isPrinting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-102 hover:cursor-pointer'
                  }`}
                  title={isPrinting ? "جاري التحميل..." : "طباعة الجدول الأسبوعي"}
                >
                  {isPrinting ? (
                    <div className="w-6 h-6 border-2 border-orangedeep border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PrintIcon className="w-6 h-6" />
                  )}
                  {isPrinting ? "جاري التحميل..." : "طباعة الجدول الأسبوعي"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 sm:px-6 py-12 text-center text-red-600">
              حدث خطأ أثناء تحميل الجدول
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AllPackagesSchedulePopup;
