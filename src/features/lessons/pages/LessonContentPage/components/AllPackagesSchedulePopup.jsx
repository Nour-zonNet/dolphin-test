import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Cross, Clock, Teacher, ChevronDown } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { formatTime12Hour } from "@/utils/dateHelpers";
import Divider from "@/components/ui/Divider";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const close = useCallback(() => {
    if (typeof onClose === "function") onClose();
    else if (typeof setOpen === "function") setOpen(false);
  }, [onClose, setOpen]);

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
    const ids = new Set(groupInfos.map((g) => g.groupId));
    return items.filter((it) => ids.has(it.group_id ?? it.groupId ?? it.group));
  }, [items, groupInfos]);

  const mergedByDay = useMemo(() => {
    const out = {};
    const seenSessions = new Set(); // Track unique sessions to prevent duplicates
    
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
                              className={`transition-transform duration-300 ${
                                isOpen ? "rotate-180" : "rotate-0"
                              }`}
                              aria-hidden="true"
                            >
                              <ChevronDown className="w-4 h-4" />
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
              <div className="flex justify-center mt-8">
                {/* ✅ زر عائم للطباعة */}
                <button
                  onClick={() => navigate("/weekly-schedule")}
                  className="  text-white rounded-full w-14 h-14 flex items-center justify-center  hover:scale-110 transition-all hover:cursor-pointer print:hidden z-50"
                  title="طباعة الجدول الأسبوعي"
                >
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25 0C20.0555 0 15.222 1.46622 11.1108 4.21326C6.99953 6.96029 3.79521 10.8648 1.90302 15.4329C0.0108322 20.0011 -0.484251 25.0277 0.480379 29.8773C1.44501 34.7268 3.82603 39.1814 7.32234 42.6777C10.8187 46.174 15.2732 48.555 20.1228 49.5196C24.9723 50.4843 29.9989 49.9892 34.5671 48.097C39.1353 46.2048 43.0397 43.0005 45.7867 38.8893C48.5338 34.778 50 29.9445 50 25C50 18.3696 47.3661 12.0107 42.6777 7.32233C37.9893 2.63392 31.6304 0 25 0ZM33.201 41.1042H16.799C16.2464 41.1042 15.7165 40.8847 15.3258 40.494C14.9351 40.1033 14.7156 39.5734 14.7156 39.0208C14.7156 38.4683 14.9351 37.9384 15.3258 37.5477C15.7165 37.157 16.2464 36.9375 16.799 36.9375H33.201C33.7536 36.9375 34.2835 37.157 34.6742 37.5477C35.0649 37.9384 35.2844 38.4683 35.2844 39.0208C35.2844 39.5734 35.0649 40.1033 34.6742 40.494C34.2835 40.8847 33.7536 41.1042 33.201 41.1042ZM34.674 25.4333L26.4667 33.6458C26.076 34.0364 25.5462 34.2558 24.9938 34.2558C24.4413 34.2558 23.9115 34.0364 23.5208 33.6458L15.3261 25.4521C14.9346 25.0614 14.7143 24.5313 14.7137 23.9782C14.7132 23.4252 14.9323 22.8946 15.3229 22.5031C15.7136 22.1117 16.2437 21.8914 16.7968 21.8908C17.3498 21.8902 17.8804 22.1094 18.2719 22.5L22.9167 27.1448V8.71354C22.9167 8.16101 23.1362 7.6311 23.5269 7.2404C23.9176 6.8497 24.4475 6.63021 25 6.63021C25.5525 6.63021 26.0824 6.8497 26.4732 7.2404C26.8638 7.6311 27.0833 8.16101 27.0833 8.71354V27.1323L31.7281 22.4875C32.1211 22.108 32.6473 21.898 33.1936 21.9028C33.7398 21.9075 34.2623 22.1266 34.6486 22.5129C35.0349 22.8991 35.254 23.4217 35.2587 23.9679C35.2635 24.5142 35.0535 25.0404 34.674 25.4333Z"
                      fill="#E89B32"
                    />
                  </svg>
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
