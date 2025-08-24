import { Cross } from "@/utils/icons";
import Tooth from "@/assets/images/Tooth.svg";
import { Clock, Teacher } from "../../../utils/icons";

const WeeklySchedulePopup = ({ open, setOpen }) => {
  const schedule = {
    الأحد: [{ time: "9:00م", doctor: "أ. حنان" }],
    الثلاثاء: [
      { time: "9:00م", doctor: "أ. حنان" },
      { time: "9:00م", doctor: "أ. حنان" },
    ],
    الخميس: [{ time: "9:00م", doctor: "أ. حنان" }],
  };

  const days = ["الأحد", "الثلاثاء", "الخميس"];
  const maxRows = Math.max(...days.map((d) => schedule[d].length));

  return (
    open && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden px-4 sm:px-6">
          {/* Header */}
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center gap-4">
              <div className="bg-health rounded p-1">
                <img src={Tooth} className="w-10 h-10 sm:w-12 sm:h-12" alt="tooth" />
              </div>
              <h2 className="text-darkblue text-lg sm:text-xl font-semibold">
                بـاقة الصحة العامة
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-gray-800 border p-2 rounded-full"
            >
              <Cross width="16" height="16" />
            </button>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse min-w-[500px]">
              <thead className="">
                <tr className="bg-softblue text-navyteal">
                  {days.map((day) => (
                    <th key={day} className="py-2 sm:py-3 font-medium text-sm sm:text-base">
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
                      const item = schedule[day][rowIdx];
                      return (
                        <td
                          key={colIdx}
                          className="p-3 sm:p-6 border-l border-gray-300 last:border-l-0"
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
                            <span className="text-gray-400 text-xs sm:text-sm">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default WeeklySchedulePopup;
