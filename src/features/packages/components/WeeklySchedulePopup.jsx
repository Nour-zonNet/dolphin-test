import { useState, useEffect } from 'react';
import { Cross } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import Tooth from "@/assets/packages/tooth.svg";
import { Clock, Teacher } from "../../../utils/icons";

const WeeklySchedulePopup = ({ open, setOpen, packageId }) => {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedule data from API
  useEffect(() => {
    if (open) {
      fetchScheduleData();
    }
  }, [open, packageId]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/schedules/${packageId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedule data');
      }
      
      const data = await response.json();
      setSchedule(data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err.message);
      
      // Fallback to default schedule if API fails
      setSchedule({
        [t('lessons.sunday')]: [{ time: "9:00م", doctor: t('lessons.defaultTeacher') }],
        [t('lessons.tuesday')]: [
          { time: "9:00م", doctor: t('lessons.defaultTeacher') },
          { time: "9:00م", doctor: t('lessons.defaultTeacher') },
        ],
        [t('lessons.thursday')]: [{ time: "9:00م", doctor: t('lessons.defaultTeacher') }],
      });
    } finally {
      setLoading(false);
    }
  };

  const days = [t('lessons.sunday'), t('lessons.tuesday'), t('lessons.thursday')];
  const maxRows = Math.max(...days.map((d) => (schedule[d] || []).length));

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-lg overflow-hidden px-4 sm:px-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center py-4 sm:py-6 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="bg-health rounded p-1">
              <img src={Tooth} className="w-10 h-10 sm:w-12 sm:h-12" alt="tooth" />
            </div>
            <h2 className="text-navyteal text-lg sm:text-xl font-semibold">
              {t('packages.healthPackage')}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 cursor-pointer hover:text-gray-800 border p-2 rounded-full"
          >
            <Cross width="16" height="16" />
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navyteal"></div>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        )}

        {/* Schedule Table */}
        {!loading && (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-center border-collapse min-w-[500px]">
              <thead className="">
                <tr className="bg-softblue text-navyteal">
                  {days.map((day, idx) => (
                    <th key={day} className={`
                      py-2 sm:py-3 font-medium text-xl sm:text-base
                      ${idx === 0 ? "rounded-br-4xl" : ""}
                      ${idx === days.length - 1 ? "rounded-tl-4xl " : ""}
                      `}>
                      {day}
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
                          className="p-3 sm:p-6 border-l border-normalblue/60 last:border-l-0"
                        >
                          {item ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-darkblue">
                                <Clock width="16" height="16" /> {item.time}
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-normalblue whitespace-nowrap">
                                <Teacher /> {item.doctor}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs sm:text-sm">{t('packages.noLesson')}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedulePopup;