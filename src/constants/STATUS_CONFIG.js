
// constants/STATUS_CONFIG.js
export const STATUS_CONFIG = {
  active: {
    color: "bg-[#F8E0BF] text-status font-semibold",
    label: (daysLeft) => `فعالة (${daysLeft} يوم متبقي)`,
    actions: ["changeGroup", "useCoupon", "cancel"],
    message: null,
    lineColor: "stroke-[#185A80]",
    fill: "#185A80",
    bg: "bg-health",
    icon: "Checked",
  },
  trial: {
    color: "border border-[#99A1A7] text-status md:h-9 md:w-32 px-4 font-semibold",
    label: () => "تجريبي",
    actions: [ "cancel"],
    message: "انتهت الفترة التجريبية الخاصة بك مدد الاشتراك لمتابعة الاستفادة",
    lineColor: "stroke-[#185A80]",
    fill: "#185A80",
    bg: "bg-health",
    buttonText: "تمديد الاشتراك",
    icon: "Experimental",
  },
  expired: {
    color: "bg-[#595959] h-9 w-32 text-white font-semibold px-4",
    label: () => "منتهي",
    actions: ["renew"],
    message:
      "انتهت صلاحية باقتك، اضغط على زر (تجديد الباقة) لتجديدها ومتابعة استخدام خدماتنا",
    lineColor: "stroke-[#B3261E]",
    fill: "#B3261E",
    bg: "bg-health",
    buttonText: "تجديد الاشتراك",
    icon: "Finished",
  },
  cancelled: {
    color: "bg-[#FFD8E4] text-status md:h-9 md:w-32 px-4 font-semibold",
    label: () => "ملغاة",
    actions: ["canceled", "reactivate",],
    message:
      "لقد قمت بتغيير الاشتراك لإعادة التفعيل أرسل طلب عبر الضغط علي زر  إعادة تفعيل الاشتراك",
    lineColor: "stroke-[#185A80]",
    fill: "#185A80",
    buttonText: "طلب إعادة تفعيل الاشتراك",
    bg: "bg-englishLevelOne",
    icon: "Canceled",
  },
};
