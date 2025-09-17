import { useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Cross, Clock, Teacher } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { formatTime12Hour } from "@/utils/dateHelpers";
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
    if (n >= 1 && n <= 7) return WEEK_ORDER[(n - 1) % 7];
  }
  const s = String(dayRaw).trim().toLowerCase();

  const EN = { sunday:"sunday", sun:"sunday", monday:"monday", mon:"monday",
    tuesday:"tuesday", tue:"tuesday", tues:"tuesday", wednesday:"wednesday", wed:"wednesday",
    thursday:"thursday", thu:"thursday", thurs:"thursday", friday:"friday", fri:"friday",
    saturday:"saturday", sat:"saturday" };
  if (EN[s]) return EN[s];

  const AR = {
    "الأحد":"sunday","الاحد":"sunday","احد":"sunday",
    "الاثنين":"monday","الإثنين":"monday","الاثنينِ":"monday","اثنين":"monday","إثنين":"monday",
    "الثلاثاء":"tuesday","ثلاثاء":"tuesday",
    "الأربعاء":"wednesday","الاربعاء":"wednesday","اربعاء":"wednesday",
    "الخميس":"thursday","خميس":"thursday",
    "الجمعة":"friday","جمعه":"friday","الجمعةِ":"friday",
    "السبت":"saturday","سبت":"saturday",
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

  // unified close handler (supports either prop shape)
  const close = useCallback(() => {
    if (typeof onClose === "function") onClose();
    else if (typeof setOpen === "function") setOpen(false);
  }, [onClose, setOpen]);

  // portal target (SSR safe)
  const portalTarget = (typeof window !== "undefined") ? document.body : null;

  // refetch ONCE per "open" cycle (don’t put this after a conditional return)
  const didRefetch = useRef(false);
  useEffect(() => {
    if (!open) { didRefetch.current = false; return; }
    if (!didRefetch.current) {
      refetch?.();
      didRefetch.current = true;
    }
  }, [open, refetch]);

  // lock body scroll + ESC close (always declare; guard inside)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // optional filter by groups
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (!Array.isArray(groupInfos) || groupInfos.length === 0) return items;
    const ids = new Set(groupInfos.map(g => g.groupId));
    return items.filter(it => ids.has(it.group_id ?? it.groupId ?? it.group));
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
        __time: it.start_time || it.time || it.session_time || it.startTime || "",
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
    () => Object.keys(mergedByDay).sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b)),
    [mergedByDay]
  );
  const maxRows = days.length ? Math.max(...days.map((d) => (mergedByDay[d] || []).length)) : 0;
  const hasAnyLessons = days.some((d) => (mergedByDay[d] || []).length > 0);

  // ⬇️ early return AFTER all hooks are declared (keeps hook order stable)
  if (!open || !portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      {/* center */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
          {/* header */}
          <div className="flex justify-between items-center py-4 sm:py-6 sticky top-0 bg-white z-10 px-4 sm:px-6">
            <h2 className="text-[#185A80] text-base md:text-xl font-bold w-full text-center">
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

          {/* content */}
          {!loading && !error && days.length > 0 && hasAnyLessons && (
            <>
              {/* mobile */}
              <div className="block sm:hidden pb-4 px-4 sm:px-6">
                <div className="space-y-4">
                  {days.map((day) => {
                    const list = mergedByDay[day] || [];
                    return (
                      <div key={day} className="bg-softblue/30 rounded-2xl p-4">
                        <h3 className="text-navyteal font-semibold text-lg mb-3 text-center bg-softblue rounded-xl py-2">
                          {t(`lessons.${day}`)}
                        </h3>
                        <div className="space-y-3">
                          {list.map((it, idx) => (
                            <div key={idx} className="flex items-start justify-between bg-white rounded-xl p-3 shadow-sm">
                              <div className="flex flex-col text-darkblue">
                                <span className="text-navyteal text-sm font-semibold">{it.__subject || "—"}</span>
                                {it.__group ? <span className="text-xs text-gray-500">{it.__group}</span> : null}
                              </div>
                              <div className="mt-1 flex flex-col items-center gap-2 text-sm text-normalblue">
                                <div className="flex items-center gap-2">
                                  <Clock width="16" height="16" />
                                  <span className="font-medium">{formatTime12Hour(it.__time)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Teacher width="16" height="16" />
                                  <span className="font-medium">{it.__teacher || "—"}</span>
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

              {/* desktop */}
              <div className="hidden sm:block overflow-x-auto pb-4 px-4 sm:px-6">
                <table className="w-full min-w-[52rem] text-center border-collapse">
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
                                    {it.__group ? (
                                      <span className="block text-xs text-gray-500 mt-1">{it.__group}</span>
                                    ) : null}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-normalblue">
                                    <Teacher width="16" height="16" /> <span>{it.__teacher || "—"}</span>
                                  </div>
                                </div>
                              ) : (
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

          {/* loading */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          )}

          {/* empty */}
          {!loading && !error && (!days.length || !hasAnyLessons) && (
            <div className="text-center py-8 text-gray-500">{t("packages.noLesson")}</div>
          )}

          {/* error */}
          {!loading && error && (
            <div className="text-center py-8 text-red-600">
              {t("common.error")} — {String(error?.message || t("common.tryAgain"))}
            </div>
          )}
        </div>
      </div>
    </div>,
    portalTarget
  );
};

export default AllPackagesSchedulePopup;
