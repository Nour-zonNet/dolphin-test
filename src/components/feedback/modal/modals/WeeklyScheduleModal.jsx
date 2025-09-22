import { useMemo } from "react";
import { Cross, Clock, Teacher } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { usePackages } from "@/features/packages/hooks/usePackages";
import { formatTime12Hour } from "@/utils/dateHelpers";
import { Spinner } from "@/components/feedback";

const WeeklyScheduleModal = ({ onClose, data }) => {
  const { packageName, schedule = [], image, color } = data;
  const { t } = useTranslation();
  const { loading, error } = usePackages();

  // Group by day_of_week
  const groupedSchedule = useMemo(() => {
    if (!Array.isArray(schedule)) return {};
    return schedule.reduce((acc, item) => {
      const day = item.day_of_week;
      if (!acc[day]) acc[day] = [];
      acc[day].push({
        time: item.start_time,
        teacher_name: item.teacher_name,
        ...item,
      });
      return acc;
    }, {});
  }, [schedule]);

  const days = Object.keys(groupedSchedule);

  // ⬇️ NEW: compute if there’s at least one lesson anywhere
  const hasAnyLessons = days.some((d) => (groupedSchedule[d] || []).length > 0);

  const maxRows = days.length
    ? Math.max(...days.map((d) => (groupedSchedule[d] || []).length))
    : 0;

  return (
    <div className="relative max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden px-4 sm:px-6 max-h-[90vh] overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center py-4 sm:py-6 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <div style={{ backgroundColor: color }} className="rounded p-1">
            <img
              src={image}
              className="w-7 h-7 md:w-12 md:h-12"
              alt="package"
            />
          </div>
          <h2 className="text-navyteal text-sm md:text-xl font-semibold">
            {packageName || t("packages.healthPackage")}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 cursor-pointer hover:text-gray-800 border border-black/20 p-2 rounded-full"
        >
          <Cross width="16" height="16" />
        </button>
      </div>

      {/* Content */}
      {!loading && days.length > 0 && hasAnyLessons && (
        <>
          {/* Mobile View (unchanged) */}
          <div className="block md:hidden pb-4">
            <div className="space-y-4">
              {days.map((day) => {
                const daySchedule = groupedSchedule[day] || [];
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
                        // you can keep per-day empty card or remove entirely; table logic below already handles dashes
                        <div className="text-center py-4 text-gray-400 bg-white rounded-xl">
                          -
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto pb-4">
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
                  <tr
                    key={rowIdx}
                    className="border-t border-dashed border-normalblue/60 first:border-t-0"
                  >
                    {days.map((day, colIdx) => {
                      const daySchedule = groupedSchedule[day] || [];
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
                            // ⬇️ dash in empty cell when there ARE lessons in the table
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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Spinner />
        </div>
      )}

      {/* No schedule at all */}
      {!loading && (!days.length || !hasAnyLessons) && (
        <div className="text-center py-8 text-gray-500">
          {t("packages.noLesson")}
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleModal;
