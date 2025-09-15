export const getNext7Days = () => {
  const days = [];
  const optionsAR = { weekday: "long" };
  const optionsEN = { weekday: "long" };

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      label: date.toLocaleDateString("ar-SA", optionsAR), // Arabic day
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

export function getFormattedDate(date = new Date()) {
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${dayName} ${day} - ${month} - ${year}`;
}

// الاستخدام
// console.log(getFormattedDate()); 

  // تحويل الوقت من 24 ساعة إلى 12 ساعة
 export const formatTime12Hour = (time24) => {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'م' : 'ص';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${hour12}:${minutes} ${period}`;
  };

export function formatArabicDate(dateString) {
  const d = new Date(dateString);
  const tz = "Asia/Riyadh";

  const day  = d.toLocaleDateString("en-US", { day: "numeric", timeZone: tz });
  const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: tz });
  let month  = new Intl.DateTimeFormat("ar-EG", { month: "long", timeZone: tz }).format(d);

  // لو عايز تشيل الهَمزة:
  // month = month.replace("أغسطس", "اغسطس").replace("أكتوبر", "اكتوبر").replace("أبريل", "ابريل");

  return `${day} ${month} ${year}`;
}
