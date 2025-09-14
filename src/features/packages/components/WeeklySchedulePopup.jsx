import { useEffect, useRef, useCallback, useMemo, useState} from "react";
import { Cross } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { Clock, Teacher } from "@/utils/icons";
import { usePackages } from "@/features/packages/hooks/usePackages";
import { formatTime12Hour } from "@/utils/dateHelpers";

const WeeklySchedulePopup = ({
  open,
  setOpen,
  groupId,
  packageName,
  image,
  color,
}) => {
  const { t } = useTranslation();
  const { schedules, loading, error, getSchedule } = usePackages();
  const key = useMemo(() => String(groupId ?? ""), [groupId]);
  // const key = String(groupId);
  useEffect(() => {
    if (open && groupId && schedules?.[key] === undefined) {
      getSchedule(key);
    }
  }, [open, groupId, getSchedule, schedules, key]);
  
  const fetchNow = useCallback(() => {
    if (!key) return;
    
    try {
      return getSchedule(key, { force: true });
    } catch {
      return getSchedule(key);
    }
  }, [getSchedule, key]);

  // Polling controller
  const pollIdRef = useRef(null);

  useEffect(() => {
    if (!open || !key) return;
    fetchNow();
    pollIdRef.current = setInterval(fetchNow, 10000); 
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fetchNow();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      if (pollIdRef.current) {
        clearInterval(pollIdRef.current);
        pollIdRef.current = null;
      }
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [open, key, fetchNow]);
  
  const Spinner = () => (
    <div className="flex items-center justify-center gap-2 py-6 text-normalblue">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <span className="font-medium">جارِ تحميل الجدول...</span>
    </div>
  );
  if (!open) return null;
  // const schedule = schedules?.[groupId] || {};
  const schedule = schedules?.[key] || {};
  const days = Object.keys(schedule);
  const maxRows = schedule
    ? Math.max(0, ...days.map((d) => (schedule[d] || []).length))
    : 0;

  return (
    
    <div className="fixed inset-0 flex items-center justify-center z-500 p-4">
      <div className="relative w-full max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-lg overflow-hidden px-4 sm:px-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center py-4 sm:py-6 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div  style={{ backgroundColor: color }} className=" rounded p-1">
              <img
                src={image}
                className="w-7 h-7 md:w-12 md:h-12"
                alt="tooth"
              />
            </div>
            <h2 className="text-navyteal text-sm md:text-xl font-semibold">
              {packageName ?? t("packages.healthPackage")}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 cursor-pointer hover:text-gray-800 border border-black/20 p-2 rounded-full"
          >
            <Cross width="16" height="16" />
          </button>
        </div>

        {/* Schedule Display */}
        {!loading && !error && days.length > 0 && (
          <>
            {/* Mobile View - Vertical Cards */}
            <div className="block sm:hidden pb-4">
              <div className="space-y-4">
                {days.map((day) => {
                  const daySchedule = schedule[day] || [];
                  return (
                    <div key={day} className="bg-softblue/30 rounded-2xl p-4">
                      <h3 className="text-navyteal font-semibold text-lg mb-3 text-center bg-softblue rounded-xl py-2">
                        {t(`lessons.${day}`)}
                      </h3>
                      <div className="space-y-3">
                        {daySchedule.length > 0 ? (
                          daySchedule.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-xl p-3 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-darkblue">
                                  <Clock width="16" height="16" />
                                  <span className="font-medium">
                                    {formatTime12Hour(item.time)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-normalblue">
                                  <Teacher width="16" height="16" />
                                  <span className="text-sm">
                                    {item.teacher_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 bg-white rounded-xl">
                            {t("packages.noLesson")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop View - Table */}
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
                  {Array.from({ length: maxRows }).map((_, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="border-t border-dashed border-normalblue/60 first:border-t-0"
                    >
                      {days.map((day, colIdx) => {
                        const daySchedule = schedule[day] || [];
                        const item = daySchedule[rowIdx];
                        return (
                          <td
                            key={colIdx}
                            className="p-4 border-l border-normalblue/60 last:border-l-0"
                          >
                            {item ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-1 text-sm text-darkblue">
                                  <Clock width="16" height="16" />{" "}
                                  {formatTime12Hour(item.time)}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-normalblue">
                                  <Teacher width="16" height="16" />{" "}
                                  {item.teacher_name}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                {t("packages.noLesson")}
                              </span>
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
        {/* Loading state (يظهر قبل no lessons) */}
        {loading && (
          <div className="pb-4">
            <div className="block sm:hidden">
              <Spinner />
            </div>
            <div className="hidden sm:block">
              <Spinner />
            </div>
          </div>
        )}
        {/* No schedule fallback */}
        {!loading && !error && days.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t("packages.noLesson")}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedulePopup;
