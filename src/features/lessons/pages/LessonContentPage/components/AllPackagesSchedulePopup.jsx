
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Cross, Clock, Teacher } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { formatTime12Hour } from "@/utils/dateHelpers";
import Divider from "@/components/ui/Divider";
import { Spinner } from "@/components/feedback";

const WEEK_ORDER = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

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
    if (n >= 1 && n <= 7) {
      const idxSundayBased = (n - 1) % 7; 
      return WEEK_ORDER[idxSundayBased];
    }
  }

  const s = String(dayRaw).trim().toLowerCase();

  const EN = {
    sunday: "sunday", sun: "sunday",
    monday: "monday", mon: "monday",
    tuesday: "tuesday", tue: "tuesday", tues: "tuesday",
    wednesday: "wednesday", wed: "wednesday",
    thursday: "thursday", thu: "thursday", thurs: "thursday",
    friday: "friday", fri: "friday",
    saturday: "saturday", sat: "saturday",
  };
  if (EN[s]) return EN[s];

  const AR = {
    "الأحد": "sunday", "الاحد": "sunday", "احد": "sunday",
    "الاثنين": "monday", "الإثنين": "monday", "الاثنينِ": "monday", "اثنين": "monday", "إثنين": "monday",
    "الثلاثاء": "tuesday", "ثلاثاء": "tuesday",
    "الأربعاء": "wednesday", "الاربعاء": "wednesday", "اربعاء": "wednesday",
    "الخميس": "thursday", "خميس": "thursday",
    "الجمعة": "friday", "جمعه": "friday", "الجمعةِ": "friday",
    "السبت": "saturday", "سبت": "saturday",
  };
  const sAr = s
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, "");
  for (const k of Object.keys(AR)) {
    const keyNorm = k.replace(/أ|إ|آ/g, "ا").replace(/ة/g, "ه");
    if (sAr === keyNorm) return AR[k];
  }

  // Fallback to start_date
  if (startDate) {
    const d = new Date(startDate);
    return WEEK_ORDER[d.getDay()] || null;
  }
  return null;
}

export default function AllPackagesSchedulePopup({ open, setOpen }) {
  const { t } = useTranslation();
  const { items, loading, error, refetch } = useLessons();
  const loadingUi = open && (loading || (!items?.length && !error));
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    if (items?.length) return;  
    if (typeof refetch === "function") {
      refetch();
    }
  }, [open, items?.length, refetch]);
  // Group and sort lessons by normalized day + time
  const mergedByDay = useMemo(() => {
    if (!open) return {};
    const out = {};
    (items || []).forEach((it) => {
      const dayKey = normalizeDay(
        it.day_of_week ?? it.day ?? it.weekday ?? null,
        it.start_date ?? it.date ?? it.session_date
      );
      if (!dayKey) return;
      if (!out[dayKey]) out[dayKey] = [];

      const timeRaw =
        it.start_time || it.time || it.session_time || it.startTime || "";
      const subj = it.subject || it.name || it.title || "";
      const group = it.group || it.group_name || it.package_name || "";
      const teacher = it.teacher_name || it.teacher || "";

      out[dayKey].push({
        ...it,
        __time: timeRaw,
        __subject: subj,
        __group: group,
        __teacher: teacher,
      });
    });

    Object.keys(out).forEach((day) => {
      out[day].sort((a, b) => String(a.__time).localeCompare(String(b.__time)));
    });

    return out;
  }, [open, items]);

  const days = useMemo(() => {
    const d = Object.keys(mergedByDay);
    return d.sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
  }, [mergedByDay]);

  const maxRows = days.length
    ? Math.max(...days.map((d) => (mergedByDay[d] || []).length))
    : 0;

  const isEmpty =
    !items?.length ||
    days.length === 0 ||
    days.every((d) => (mergedByDay[d] || []).length === 0);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* FULL-PAGE OVERLAY */}
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

      {/* CENTER LAYER */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* CARD */}
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="flex justify-between items-center py-4 sm:py-6 sticky top-0 bg-white z-10 px-4 sm:px-6 no-scrollbar">
            <h2 className="text-[#185A80] text-base md:text-xl font-bold w-full text-center">
              معاينة الجدول الاسبوعي
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 border border-black/20 p-2 rounded-full cursor-pointer"
            >
              <Cross width="16" height="16" />
            </button>
          </div>

          <Divider />

          {/* Loading */}
          {loadingUi  && (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          )}

          {/* Content */}
          {!loadingUi && !error && !isEmpty && (
            <>
              {/* Mobile */}
              <div className="block sm:hidden pb-4 px-4 sm:px-6">
                <div className="space-y-4">
                  {days.map((day) => {
                    const dayLessons = mergedByDay[day] || [];
                    return (
                      <div key={day} className="bg-softblue/30 rounded-2xl p-4">
                        <h3 className="text-navyteal font-semibold text-lg mb-3 text-center bg-softblue rounded-xl py-2">
                          {t(`lessons.${day}`)}
                        </h3>
                        <div className="space-y-3">
                          {dayLessons.map((it, idx) => (
                            <div key={idx} className="flex items-start justify-between bg-white rounded-xl p-3 shadow-sm">
                              <div className="flex items-center gap-2 text-darkblue">
                                <div className="text-navyteal text-sm font-semibold">
                                  {it.__subject || "—"}
                                </div>
                              </div>
                              <div className="mt-2 flex flex-col items-center gap-2 text-sm text-normalblue">
                                <div className="flex items-center gap-2">
                                  <Clock width="16" height="16" fill="#AE7426" />
                                  <span className="font-medium text-[#AE7426]">
                                    {formatTime12Hour(it.__time)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Teacher width="16" height="16" fill="#AE7426" />
                                  <span className="font-medium text-[#AE7426]">{it.__teacher || "—"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto pb-4 px-4 sm:px-6">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-softblue text-navyteal">
                    {days.map((day, idx) => (
                      <th
                        key={day}
                        className={`py-3 px-2 font-medium text-base
                          ${idx === 0 ? "rounded-br-4xl" : ""}
                          ${idx === days.length - 1 ? "rounded-tl-4xl" : ""}`}
                      >
                        {t(`lessons.${day}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxRows }).map((_, rowIdx) => (
                    <tr key={rowIdx} className="border-t border-dashed border-normalblue/60 first:border-t-0">
                      {days.map((day, colIdx) => {
                        const it = (mergedByDay[day] || [])[rowIdx];
                        return (
                          <td key={colIdx} className="p-4 border-l border-normalblue/60 last:border-l-0">
                            {it ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-1 text-sm text-darkblue">
                                  <Clock width="16" height="16" /> {formatTime12Hour(it.__time)}
                                </div>
                                <div className="text-sm font-semibold text-normalblue">
                                  {it.__subject || "—"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-normalblue">
                                  <Teacher width="16" height="16" /> <span>{it.__teacher || "—"}</span>
                                </div>
                              </div>
                            ) : (
                              // ⬇️ show dash for empty cell (when table isn't empty)
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            </>
          )}

          {/* Empty */}
          {!loadingUi && !error && isEmpty && (
            <div className="text-center py-8 text-gray-500">
              {t("packages.noLesson")}
            </div>
          )}

          {/* Error */}
          {!loadingUi && error && (
            <div className="text-center py-8 text-red-600">
              {t("common.error")} — {String(error?.message || t("common.tryAgain"))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
