import React from "react";
import FormatWithCurrency from "@/utils/FormatWithCurrency";

const ActivityLog = () => {
  // TODO: Get from API
  const activities = [
    {
      id: 1,
      icon: "🎉", 
      text: "تينا انضمت واشتركت من خلال الكود الخاص بك",
      reward: 12,
      timestamp: "الآن",
      status: "subscribed",
    },
    {
      id: 2,
      icon: "👋", 
      text: "سارة انضمت من خلال الكود الخاص بك (في انتظار الاشتراك)",
      reward: 10,
      timestamp: "الآن",
      status: "pending",
    },
  ];

  const handleRemind = (activityId) => {
    // TODO: Handle remind to subscribe
    console.log("Remind clicked for activity:", activityId);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-black text-base md:text-xl lg:text-2xl mb-4">
        سجل النشاط
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 md:p-6 space-y-3 md:min-h-[150px]"
          >
            <div className="flex items-start gap-3 md:gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 text-3xl md:text-4xl">
                {activity.icon}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm md:text-base text-black leading-relaxed text-wrap md:max-w-[300px]">
                    {activity.text}
                  </p>
                  <p className="text-sm md:text-base text-[#5C6064] font-semibold">
                    {activity.timestamp}
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm text-[#2E7D32]">
                      تمت إضافة{" "}
                    </span>
                    <FormatWithCurrency
                      amount={activity.reward}
                      fractionDigits={0}
                      className="text-[#2E7D32] font-bold text-sm md:text-base"
                      symbolFill="#2E7D32"
                      symbolClass="w-3 h-3 md:w-4 md:h-4"
                    />
                    <span className="text-xs md:text-sm text-[#2E7D32]">
                      {" "}
                      إلى رصيدك
                    </span>
                  </div>
                  {/* Remind Button - Only show if status is pending */}
                  {activity.status === "pending" && (
                    <button
                      onClick={() => handleRemind(activity.id)}
                      className="cursor-pointer md:w-auto border border-orangedeep text-navyteal hover:bg-orange-50 hover:bg-orange-100 text-navyteal font-semibold py-2 px-4 rounded-full transition-colors text-xs md:text-base text-nowrap"
                    >
                      ذكّره بالاشتراك
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;

