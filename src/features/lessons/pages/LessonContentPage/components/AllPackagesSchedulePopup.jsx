import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { Cross, Clock, Teacher } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { formatTime12Hour } from "@/utils/dateHelpers";
import Divider from "@/components/ui/Divider";
import { ChevronDown } from "@/utils/icons";

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
  const { items = [], loading, error, refetch } = useLessons();

  // unified close handler
  const close = useCallback(() => {
    if (typeof onClose === "function") onClose();
    else if (typeof setOpen === "function") setOpen(false);
  }, [onClose, setOpen]);

  // refetch once per open
  const didRefetch = useRef(false);
  useEffect(() => {
    if (!open) {
      didRefetch.current = false;
      return;
    }
    if (!didRefetch.current) {
      refetch?.();
      didRefetch.current = true;
    }
  }, [open, refetch]);

  // lock body scroll + ESC
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // filter by groups
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (!Array.isArray(groupInfos) || groupInfos.length === 0) return items;
    const ids = new Set(groupInfos.map((g) => g.groupId));
    return items.filter((it) => ids.has(it.group_id ?? it.groupId ?? it.group));
  }, [items, groupInfos]);

  // group & sort
  const mergedByDay = useMemo(() => {
    const out = {};
    (filteredItems || []).forEach((it) => {
      const dayKey = normalizeDay(
        it.day_of_week ?? it.day ?? it.weekday ?? null,
        it.start_date ?? it.date ?? it.session_date
      );
      if (!dayKey) return;
      (out[dayKey] ||= []).push({
        ...it,
        __time:
          it.start_time || it.time || it.session_time || it.startTime || "",
        __subject: it.subject || it.name || it.title || "",
        __group: it.group || it.group_name || it.package_name || "",
        __teacher: it.teacher_name || it.teacher || "",
      });
    });
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
      init[d] = count === 1; // open (i.e., content visible) only for single-lesson days
    });
    setOpenDays(init);
  }, [days, mergedByDay]);

  const setPanelRef = useCallback(
    (day) => (el) => {
      if (!el) return;
      panelRefs.current[day] = el;
      el.style.overflow = "hidden";
      el.style.transition = "max-height 300ms ease";
      const isOpen = openDays[day];
      if (isOpen) {
        // single-lesson days usually won't render a panel; but keep safe default
        el.style.maxHeight = el.scrollHeight + "px";
      } else {
        el.style.maxHeight = "0px";
      }
    },
    [openDays]
  );

  const toggleDay = useCallback((day) => {
    const el = panelRefs.current[day];
    setOpenDays((prev) => {
      const next = !prev[day];
      if (el) {
        if (next) {
          const full = el.scrollHeight;
          el.style.maxHeight = full + "px";
        } else {
          el.style.maxHeight = "0px";
        }
      }
      return { ...prev, [day]: next };
    });
  }, []);

  // Recompute panel heights if content changes while open
  useEffect(() => {
    days.forEach((d) => {
      const el = panelRefs.current[d];
      if (!el) return;
      if (openDays[d]) {
        el.style.maxHeight = el.scrollHeight + "px";
      } else {
        el.style.maxHeight = "0px";
      }
    });
  }, [days, mergedByDay, openDays]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      {/* center */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-[90%] max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
          {/* header */}
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

          {/* Empty-state: no sessions this week */}
          {!loading && !error && (days.length === 0 || !hasAnyLessons) && (
            <div className="px-4 sm:px-6 py-12 text-center text-gray-600">
              لا يوجد حصص لهذا الأسبوع
            </div>
          )}
          {/* content */}
          {!loading && !error && days.length > 0 && hasAnyLessons && (
            <div className="px-4 sm:px-6 pb-6">
              {/* DAYS: flex-wrap instead of grid (prevents equal row heights) */}
              <div className="-m-2 flex flex-wrap items-start">
                {days.map((day) => {
                  const list = mergedByDay[day] || [];
                  const count = list.length;
                  const isSingle = count === 1;
                  const isOpen = !!openDays[day];

                  return (
                    // 1 / 2 / 3 columns (mobile/tablet/desktop)
                    <div key={day} className="w-full md:w-1/2 lg:w-1/3 p-2">
                      <div className="bg-[#E8F0F4] rounded-2xl p-4">
                        <div className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 bg-[#B8CFDC] rounded-lg">
                          <h3 className="text-navyteal font-semibold text-base sm:text-lg">
                            {t(`lessons.${day}`)}
                          </h3>

                          {count > 1 && (
                            <button
                              type="button"
                              onClick={() => toggleDay(day)}
                              className="flex items-center justify-center text-navyteal hover:text-[#0d3d56] transition cursor-pointer"
                              aria-expanded={isOpen}
                              aria-controls={`day-panel-${day}`}
                            >
                              <span
                                className={`transition-transform duration-300 ${
                                  isOpen ? "rotate-180" : "rotate-0"
                                }`}
                                aria-hidden="true"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Body */}
                        <div
                          className={`${
                            isOpen ? "mt-4" : "mt-0 pb-0"
                          } transition-[margin,padding] duration-200`}
                        >
                          {/* Single-lesson: show directly */}
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

                          {/* Multi-lesson: expandable panel with smooth height */}
                          {count > 1 && (
                            <div
                              id={`day-panel-${day}`}
                              ref={setPanelRef(day)}
                              className={isOpen ? "pt-1" : ""} // add small top padding only when open
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPackagesSchedulePopup;
