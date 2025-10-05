import { useLessons } from "../hooks/useLessons";
import backgroundImage from "@/assets/schedule/background.png";
import dolphinChild from "@/assets/images/homeChild.png";

const WeeklySchedule = () => {
  const { items } = useLessons();

  // تحويل الوقت إلى صيغة عربية
  const formatTimeToArabic = (timeString) => {
    const [hoursStr, minutesStr] = timeString.split(":");
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours < 12 ? "صباحاً" : "مساءً";
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${hour12}:${formattedMinutes} ${ampm}`;
  };

  // خريطة الأيام بالعربية
  const dayMapping = {
    saturday: "السبت",
    sunday: "الأحد",
    monday: "الإثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
  };

  // تحويل بيانات الأيام إلى أسماء بالعربية
  const sessionsWithArabicDays = items.map((s) => ({
    ...s,
    arabicDay: dayMapping[s.day_of_week?.toLowerCase()],
  }));

  // استخراج الأيام التي تحتوي على حصص فقط
  const activeDays = Array.from(
    new Set(sessionsWithArabicDays.map((s) => s.arabicDay))
  );

  // استخراج الأوقات التي تحتوي على حصص فعلية فقط
  const activeTimes = Array.from(
    new Set(
      sessionsWithArabicDays.map((s) => {
        const hour = parseInt(s.start_time.split(":")[0]);
        return `${hour}:00 - ${hour + 1}:00`;
      })
    )
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // دالة إيجاد الجلسة حسب اليوم والوقت
  const findSessionByDayAndTime = (day, timeSlot) => {
    return sessionsWithArabicDays.find((session) => {
      if (session.arabicDay !== day) return false;
      const sessionHour = parseInt(session.start_time.split(":")[0]);
      const slotHour = parseInt(timeSlot.split(":")[0]);
      return sessionHour === slotHour;
    });
  };

  // في حال لا توجد حصص
  if (!items || items.length === 0) {
    return (
      <div
        className="text-center py-10 text-gray-500 bg-white rounded-2xl shadow-md mt-5"
        dir="rtl"
      >
        <i className="bi bi-calendar-x text-3xl text-gray-400 mb-2"></i>
        <p>لا توجد حصص مجدولة حالياً</p>
      </div>
    );
  }

  return (
    <div
      className="w-full relative px-4 py-8 bg-cover bg-center bg-no-repeat min-h-screen flex justify-center items-start"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      dir="rtl"
    >
      <div className="relative max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="absolute right-0 ">
          <img
            src={dolphinChild}
            alt="Path"
            className="h-8 sm:h-15 md:h-20 lg:h-25 object-contain  lg:mb-6"
          />
        </div>
        <div className=" text-navyteal py-4 text-center">
          <h2 className="text-xl font-bold flex justify-center items-center gap-2">
            <i className="bi bi-calendar-week"></i>
            الجدول الأسبوعي
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            {/* <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 border border-gray-200">اليوم</th>
                {activeTimes.map((slot) => (
                  <th key={slot} className="py-3 px-4 border border-gray-200">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead> */}
            <tbody>
              {activeDays.map((day) => (
                <tr
                  key={day}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="py-3 px-4 font-bold text-navyteal bg-gray-50 border border-gray-200">
                    {day}
                  </td>

                  {activeTimes.map((slot) => {
                    const session = findSessionByDayAndTime(day, slot);
                    return (
                      <td
                        key={`${day}-${slot}`}
                        className="py-3 px-2 border border-gray-200 min-w-[120px]"
                      >
                        {session ? (
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <span className="text-xs text-[#144B6B]">
                              {formatTimeToArabic(session.start_time)}
                            </span>
                            <span className="text-orangedeep font-semibold">
                              {session.subject || "جلسة"}
                            </span>
                            <span className="text-xs text-[#144B6B] px-2 py-0.5 rounded-full">
                              {session.teacher_name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm"></span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="bg-gray-50 text-center py-3 text-gray-500 text-sm border-t border-gray-200">
          <i className="bi bi-info-circle me-1"></i>
          جدول الجلسات الأسبوعي (يظهر فقط الأيام والمواعيد التي بها حصص)
        </div> */}
      </div>
    </div>
  );
};

export default WeeklySchedule;
