export const getNext7Days = () => {
  const days = [];
  const tz = "Asia/Riyadh";
  const optionsAR = { weekday: "long", timeZone: tz };
  const optionsEN = { weekday: "long", timeZone: tz };

  for (let i = 0; i < 7; i++) {
    const now = new Date();
    now.setDate(now.getDate() + i);

    // نجيب التاريخ مضبوط من الـ formatter
    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now); // YYYY-MM-DD

    days.push({
      label: now.toLocaleDateString("ar-SA", optionsAR), // اسم اليوم بالعربي
      dayEn: now.toLocaleDateString("en-US", optionsEN).toLowerCase(), // sunday, monday...
      date: iso, // تاريخ مضبوط بالرياض YYYY-MM-DD
    });
  }

  return days;
};
// ترجع الأيام بس من غير تواريخ
export const getWeekFromSaturday = (tz = "Asia/Riyadh") => {
  const days = [];
  const optionsAR = { weekday: "long", timeZone: tz };
  const optionsEN = { weekday: "long", timeZone: tz };

  // نجيب التاريخ الحالي
  const today = new Date();

  // نحسب السبت الأقرب (نخليه بداية الأسبوع)
  const dayOfWeek = today.getDay(); // 0: Sunday, 6: Saturday
  const diff = (dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7) * -1;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const current = new Date(saturday);
    current.setDate(saturday.getDate() + i);

    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(current);

    days.push({
      label: current.toLocaleDateString("ar-SA", optionsAR), // اليوم بالعربي
      dayEn: current.toLocaleDateString("en-US", optionsEN).toLowerCase(), // بالإنجليزي
      date: iso, // YYYY-MM-DD مضبوط بالتوقيت
    });
  }

  return days;
};

export const getWeekFromLastSaturday = (tz = "Asia/Riyadh") => {
  const days = [];
  const optionsAR = { weekday: "long", timeZone: tz };
  const optionsEN = { weekday: "long", timeZone: tz };

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0: Sunday ... 6: Saturday

  // نحسب السبت اللي فات (أو النهاردة لو هو سبت)
  const diff = (dayOfWeek - 6 + 7) % 7; 
  const lastSaturday = new Date(today);
  lastSaturday.setDate(today.getDate() - diff);

  for (let i = 0; i < 7; i++) {
    const current = new Date(lastSaturday);
    current.setDate(lastSaturday.getDate() + i);

    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(current);

    days.push({
      label: current.toLocaleDateString("ar-SA", optionsAR),   // اليوم بالعربي
      dayEn: current.toLocaleDateString("en-US", optionsEN).toLowerCase(), // بالإنجليزي
      date: iso, // YYYY-MM-DD مضبوط
    });
  }

  return days;
};
export const getNextDateForDay = (dayOfWeek) => {
  const daysMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const today = new Date();
  const targetDay = daysMap[dayOfWeek.toLowerCase()];

  if (targetDay === undefined) return null;

  let result = new Date(today);
  const currentDay = today.getDay();

  // how many days ahead until targetDay
  let diff = targetDay - currentDay;
  if (diff <= 0) diff += 7;

  result.setDate(today.getDate() + diff);

  return result.toISOString().split("T")[0]; // format: YYYY-MM-DD
};
export const getThreeDaysBeforeAndAfter = (tz = "Asia/Riyadh") => {
  const days = [];
  const optionsAR = { weekday: "long", timeZone: tz };
  const optionsEN = { weekday: "long", timeZone: tz };

  const today = new Date();

  // نلف من -3 لحد +3 حوالين اليوم الحالي
  for (let i = -3; i <= 3; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);

    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(current);

    days.push({
      label: current.toLocaleDateString("ar-SA", optionsAR), // اليوم بالعربي
      dayEn: current.toLocaleDateString("en-US", optionsEN).toLowerCase(), // اليوم بالإنجليزي
      date: iso, // YYYY-MM-DD مضبوط بالتوقيت
      isToday: i === 0, // علشان تعرف مين اليوم الحالي
    });
  }

  return days;
};

export const getSevenDaysBeforeAndAfter = (tz = "Asia/Riyadh") => {
  const days = [];
  const optionsAR = { weekday: "long", timeZone: tz };
  const optionsEN = { weekday: "long", timeZone: tz };

  const today = new Date();

  // من -7 لحد +7
  for (let i = -7; i <= 7; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);

    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(current);

    days.push({
      label: current.toLocaleDateString("ar-SA", optionsAR), // اليوم بالعربي
      dayEn: current.toLocaleDateString("en-US", optionsEN).toLowerCase(), // اليوم بالإنجليزي
      date: iso, // YYYY-MM-DD مضبوط بالتوقيت
      isToday: i === 0, // لتحديد اليوم الحالي
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
export const getArabicDay = (enDay) => {
  const daysMap = {
    sunday: "الأحد",
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
  };

  return daysMap[enDay.toLowerCase()] || enDay;
};
// تحويل الوقت من 24 ساعة إلى 12 ساعة
export const formatTime12Hour = (time24) => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "م" : "ص";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${hour12}:${minutes} ${period}`;
};

export function formatPackageStartDate(dateStr) {
  if (!dateStr) return "";

  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const date = new Date(dateStr);

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1; // الأشهر تبدأ من 0
  const year = date.getFullYear();

  return `${dayName} - ${day} - ${month} - ${year}`;
}
export function isPackageStarted(packageStartDate) {
  if (!packageStartDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // نخلي اليوم يبدأ من 00:00

  const startDate = new Date(packageStartDate);
  startDate.setHours(0, 0, 0, 0);

  return startDate <= today;
}

export function getRemainingDate(packageStartDate) {
  if (!packageStartDate) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(packageStartDate);
  startDate.setHours(0, 0, 0, 0);

  const diffMs = startDate - today;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `متبقي ${diffDays} يوم${diffDays > 1 ? "" : ""}`;
  } else if (diffDays === 0) {
    return "اليوم";
  } else {
    return "انتهى";
  }

  // return `${hour12}:${minutes} ${period}`;
}

export function formatArabicDate(dateString) {
  const d = new Date(dateString);
  const tz = "Asia/Riyadh";

  const day = d.toLocaleDateString("en-US", { day: "numeric", timeZone: tz });
  const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: tz });
  let month = new Intl.DateTimeFormat("ar-EG", {
    month: "long",
    timeZone: tz,
  }).format(d);

  return `${day} ${month} ${year}`;
}
export const parseDateWithTime = (
  dateString,
  timeString,
  timeZone = "Asia/Riyadh"
) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // اعمل Date من الـ lessonDate لكن كـ local
  const parts = dateString.split("-"); // YYYY-MM-DD
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1; // JS months start at 0
  const day = Number(parts[2]);

  // هنا بنعمل التاريخ الخام
  const localDate = new Date(year, month, day, hours, minutes, seconds || 0);

  // نجيب فرق التوقيت الفعلي لـ Riyadh
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // رجع الـ date مضبوط حسب التوقيت
  const partsObj = Object.fromEntries(
    formatter.formatToParts(localDate).map((p) => [p.type, p.value])
  );

  return new Date(
    `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}`
  );
};
export const formatDateWithEnglishDay = (d, lang = "ar") => {
  const tz = "Asia/Riyadh";
  const dayNum = d.toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: tz,
  });
  const monthName = d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "long",
    timeZone: tz,
  });
  const weekdayName = d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "long",
    timeZone: tz,
  });
  return { dayNum, monthName, weekdayName };
};