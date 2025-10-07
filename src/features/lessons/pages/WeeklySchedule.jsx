import { useLessons } from "../hooks/useLessons";
import backgroundImage from "@/assets/schedule/background.png";
import dolphinChild from "@/assets/images/homeChild.png";

const WeeklySchedule = () => {
  const { items } = useLessons();

  // ✅ تحويل الوقت إلى صيغة عربية
  const formatTimeToArabic = (timeString) => {
    const [hoursStr, minutesStr] = timeString.split(":");
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours < 12 ? "صباحاً" : "مساءً";
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${hour12}:${formattedMinutes} ${ampm}`;
  };

  // ✅ خريطة الأيام بالعربية
  const dayMapping = {
    saturday: "السبت",
    sunday: "الأحد",
    monday: "الإثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
  };

  const allDays = Object.values(dayMapping);

  // ✅ تحويل بيانات الأيام إلى العربية
  const sessionsWithArabicDays = items.map((s) => ({
    ...s,
    arabicDay: dayMapping[s.day_of_week?.toLowerCase()],
  }));

  // ✅ استخراج الأوقات الفعلية من الدروس
  const uniqueTimes = Array.from(
    new Set(
      sessionsWithArabicDays.map((s) => {
        const hour = parseInt(s.start_time.split(":")[0]);
        return `${hour}:00 - ${hour + 1}:00`;
      })
    )
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // ✅ ضمان أن عدد الأعمدة لا يقل عن 4
  const timeSlots =
    uniqueTimes.length < 4
      ? [...uniqueTimes, ...Array(4 - uniqueTimes.length).fill("—")]
      : uniqueTimes;

  // ✅ دالة البحث عن الجلسة حسب اليوم والوقت
  const findSessionByDayAndTime = (day, timeSlot) => {
    return sessionsWithArabicDays.find((session) => {
      if (session.arabicDay !== day) return false;
      const sessionHour = parseInt(session.start_time.split(":")[0]);
      const slotHour = parseInt(timeSlot.split(":")[0]);
      return sessionHour === slotHour;
    });
  };

  // ✅ دالة الطباعة
  const handlePrint = () => {
    const printContents = document.getElementById("schedule-content").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // لإعادة تحميل الصفحة بعد الطباعة
  };

  return (
    <div
      className="w-full relative px-4 pt-16 bg-cover bg-center bg-no-repeat min-h-screen flex justify-center items-start"
      dir="rtl"
      id="schedule-content"
    >
      {/* الخلفية */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="background"
          className="w-full h-full "
        />
      </div>
      <div className="absolute left-0 top-0">
        <svg
          width="87"
          height="99"
          viewBox="0 0 87 99"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M68.6053 8.44226C61.6053 3.94226 53.4053 0.742238 45.5053 -1.95776C37.3053 -4.85776 28.5052 -7.35776 19.8052 -6.95776C3.00525 -6.15776 -8.09474 5.44225 -14.2947 20.2423C-19.7947 33.4422 -22.9947 55.2423 -9.19474 64.8423C-2.69474 69.3423 6.70527 69.2422 14.2053 68.5422C22.5053 67.8422 31.0053 65.9422 38.6053 62.2422C44.5053 59.3422 49.9053 54.4423 50.9053 47.7423C52.1053 40.1423 47.5053 33.1422 42.7053 27.6422C37.5053 21.7422 30.1053 17.0422 22.1053 17.1422C14.8053 17.1422 7.20526 20.8422 3.40526 27.1422C-0.394743 33.4422 0.305275 43.4423 7.70527 46.9423C14.0053 49.8423 20.8053 44.4423 19.7053 37.8423C19.3053 35.0423 14.7053 34.5422 13.6053 37.0422C12.9053 38.4422 13.0053 35.2423 13.4053 34.4423C14.0053 33.0423 15.2053 32.0423 16.5053 31.3423C20.1053 29.3423 24.1053 29.9422 27.7053 31.6422C31.7053 33.5422 35.0053 36.8423 37.5053 40.4423C40.8053 45.1423 40.1052 48.1422 35.3052 51.0422C26.4053 56.3422 13.6053 57.6423 3.50526 56.3423C-8.09474 54.7423 -6.49473 39.9423 -3.89473 31.4423C-1.39473 23.2423 3.50526 13.5422 11.5053 9.54224C21.0053 4.74224 32.8053 10.4422 41.6053 14.6422C49.3053 18.3422 61.2053 23.2423 65.1053 31.3423C68.9053 39.2423 68.1053 51.3423 65.8053 59.4423C63.1053 69.1423 54.4053 74.4423 45.2053 76.9423C39.5053 78.4423 33.6053 78.8422 27.7053 78.7422C24.5053 78.7422 21.3053 78.5423 18.1053 78.4423C13.6053 78.3423 10.8053 78.9423 6.70527 80.9423C1.20527 83.5423 2.70527 90.7422 6.70527 93.7422C14.0053 99.2422 25.6053 98.8423 34.5053 98.4423C43.4053 98.1423 52.0053 96.4422 60.2053 92.7422C76.4053 85.3422 85.2053 70.8423 86.6053 53.4423C87.7053 35.9423 84.1053 18.5423 68.6053 8.44226Z"
            fill="#DC0D17"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="absolute right-0 -top-15">
          <img
            src={dolphinChild}
            alt="Path"
            className="h-8 sm:h-15 md:h-20 lg:h-30 object-contain lg:mb-6"
          />
        </div>

        <div className="text-navyteal py-4 text-center">
          <h2 className="text-xl font-bold flex justify-center items-center gap-2">
            <i className="bi bi-calendar-week"></i>
            الجدول الأسبوعي
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse text-center">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 border border-gray-200 w-[140px]">
                  اليوم
                </th>
                {timeSlots.map((slot, index) => (
                  <th
                    key={index}
                    className="py-3 px-4 border border-gray-200 w-[180px]"
                  >
                    {slot !== "—" ? slot : ""}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allDays.map((day) => (
                <tr
                  key={day}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="py-3 px-4 font-bold text-navyteal bg-gray-50 border border-gray-200 w-[140px]">
                    {day}
                  </td>

                  {timeSlots.map((slot, index) => {
                    const session = findSessionByDayAndTime(day, slot);
                    return (
                      <td
                        key={`${day}-${slot}-${index}`}
                        className="border border-gray-200 w-[180px] h-[100px] text-center align-middle"
                      >
                        {session ? (
                          <>
                            <div className="text-xs text-[#144B6B]">
                              {formatTimeToArabic(session.start_time)}
                            </div>
                            <div className="text-orangedeep font-semibold">
                              {session.subject || "جلسة"}
                            </div>
                            <div className="text-xs text-[#144B6B]">
                              {session.teacher_name}
                            </div>
                          </>
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

        <div className="bg-gray-50 text-center py-3 text-gray-500 text-sm border-t border-gray-200">
          <i className="bi bi-info-circle me-1"></i>
          جميع الحصص المتاحة خلال الاسبوع.
        </div>
      </div>
      {/* ✅ زر عائم للطباعة */}
      <button
        onClick={handlePrint}
        className="fixed bottom-6 right-6  text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:cursor-pointer print:hidden"
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
  );
};

export default WeeklySchedule;
