export const getNext7Days = () => {
  const days = [];
  const optionsAR = { weekday: "long" };
  const optionsEN = { weekday: "long" };

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      label: date.toLocaleDateString("ar-EG", optionsAR), // Arabic day
      dayEn: date.toLocaleDateString("en-US", optionsEN).toLowerCase(), // "sunday"
      date: date.toISOString().split("T")[0], // YYYY-MM-DD
    });
  }
  return days;
};

export const formatArabicTime = (time) => {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour >= 12 ? "مساءً" : "صباحًا";
  hour = hour % 12 || 12; // تحويل للـ 12 ساعة

  return `${hour}${minute > 0 ? `:${minute}` : ""} ${period}`;
};
export const getRemainingTime = (time) => {
  if (!time) return "";

  // current time
  const now = new Date();

  // extract hour & minute from start_time (example: "14:30:00")
  const [hourStr, minuteStr] = time.split(":");
  const target = new Date();
  target.setHours(parseInt(hourStr, 10));
  target.setMinutes(parseInt(minuteStr, 10));
  target.setSeconds(0);

  // لو الوقت فات، نضيف يوم جديد
  if (target < now) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target - now;
  const diffMins = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  let result = "متبقي ";
  if (hours > 0) result += `${hours} ساعة${hours > 1 ? "" : ""}`;
  if (hours > 0 && minutes > 0) result += " و ";
  if (minutes > 0) result += `${minutes} دقيقة`;

  return result;
};
