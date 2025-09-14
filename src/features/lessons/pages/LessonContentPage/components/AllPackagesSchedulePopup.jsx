// AllPackagesSchedulePopup.jsx
import { useEffect, useMemo, useRef } from "react";
import { Cross, Clock, Teacher } from "@/utils/icons"; 
import { useTranslation } from "react-i18next";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { formatTime12Hour } from "@/utils/dateHelpers";
import Divider from "@/components/ui/Divider";

const Spinner = () => (
  <div className="flex items-center justify-center gap-2 py-6 text-normalblue">
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span className="font-medium">جارِ تحميل الجدول...</span>
  </div>
);

const WEEK_ORDER = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

export default function AllPackagesSchedulePopup({ open, setOpen }) {
  const { t } = useTranslation();
  const { items, loading, error } = useLessons();

  const pollRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [open]);

  const mergedByDay = useMemo(() => {
    if (!open) return {};
    const out = {};
    (items || []).forEach((it) => {
      const day = String(it.day_of_week || "").toLowerCase();
      if (!day) return;
      if (!out[day]) out[day] = [];

      const timeRaw = it.start_time || it.time || it.session_time || it.startTime || "";
      const subj = it.subject || it.name || it.title || "";
      const group = it.group || it.group_name || it.package_name || "";
      const teacher = it.teacher_name || it.teacher || "";

      out[day].push({
        ...it,
        __time: timeRaw,
        __subject: subj,
        __group: group,
        __teacher: teacher,
      });
    });

    Object.keys(out).forEach(day => {
      out[day].sort((a, b) => String(a.__time).localeCompare(String(b.__time)));
    });

    return out;
  }, [open, items]);

  const days = useMemo(() => {
    const d = Object.keys(mergedByDay);
    return d.sort((a,b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
  }, [mergedByDay]);

  const isEmpty =
    !items?.length ||
    days.length === 0 ||
    days.every(d => (mergedByDay[d] || []).length === 0);

  if (!open) return null;

  return (
        <div className="fixed inset-0 md:flex items-center justify-center z-500 p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden px-4 sm:px-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative flex items-center py-4 sm:py-6 top-0 bg-white z-10">
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-0 text-gray-600 cursor-pointer hover:text-gray-800 border border-black/20 p-2 rounded-full"
                >
                    <Cross width="16" height="16" />
                </button>
                <h2 className="w-full text-[#185A80] text-center text-base md:text-xl font-bold">
                    معاينة الجدول الاسبوعي
                </h2>
            </div>
            <Divider />

            {loading && <Spinner />}

            {!loading && !error && !isEmpty && (
            <>
                {/* Mobile */}
                <div className="block sm:hidden pb-4 space-y-4">
                {days.map(day => {
                    const dayLessons = mergedByDay[day] || [];
                    return (
                    <div key={day} className="bg-softblue/30 rounded-2xl p-4">
                        <h3 className="text-navyteal font-semibold text-lg mb-3 text-center bg-softblue rounded-xl py-2">
                        {t(`lessons.${day}`)}
                        </h3>
                        <div className="space-y-3">
                        {dayLessons.map((it, idx) => (
                            <div key={idx} className="flex items-start justify-between bg-white rounded-xl p-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-darkblue">
                                        <div className="text-navyteal text-sm font-semibold">
                                        {it.__subject || "—"}
                                        </div>
                                        
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
                            {/* المجموعة */}
                            {/* <div className="mt-2">
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-softblue/60">
                                {it.__group || "—"}
                                </span>
                            </div> */}
                            </div>
                        ))}
                        </div>
                    </div>
                    );
                })}
                </div>

                {/* Desktop */}
                <div className="hidden sm:block overflow-x-auto pb-4">
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
                    {Array.from({ length: Math.max(0, ...days.map(d => (mergedByDay[d] || []).length)) }).map((_, rowIdx) => (
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
                                    <div>
                                    {/* <span className="text-xs font-bold px-2 py-1 rounded-full bg-softblue/60">
                                        {it.__group || "—"}
                                    </span> */}
                                    </div>
                                </div>
                                ) : (
                                <span className="text-gray-400 text-sm">{t("packages.noLesson")}</span>
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

            {!loading && !error && isEmpty && (
            <div className="text-center py-8 text-gray-500">{t("packages.noLesson")}</div>
            )}

            {!loading && error && (
            <div className="text-center py-8 text-red-600">
                {t("common.error")} — {String(error?.message || t("common.tryAgain"))}
            </div>
            )}
        </div>
        </div>
    );
}
