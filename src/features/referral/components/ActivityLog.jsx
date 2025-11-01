import React from "react";
import FormatWithCurrency from "@/utils/FormatWithCurrency";

const ActivityLog = () => {
  // TODO: Get from API
  const activities = [
    {
      id: 1,
      icon: "🎉", // Party popper emoji - can be replaced with image
      text: "تينا انضمت واشتركت من خلال الكود الخاص بك",
      reward: 12,
      timestamp: "الآن",
      status: "subscribed",
    },
    {
      id: 2,
      icon: "👋", // Waving hand emoji - can be replaced with image
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
            className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 md:p-6 space-y-3"
          >
            <div className="flex items-start gap-3 md:gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 text-3xl md:text-4xl">
                {activity.icon}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <p className="text-sm md:text-base text-black leading-relaxed">
                  {activity.text}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm text-gray-600">
                    تمت إضافة{" "}
                  </span>
                  <FormatWithCurrency
                    amount={activity.reward}
                    fractionDigits={0}
                    className="text-[#2E7D32] font-bold text-sm md:text-base"
                    symbolFill="#2E7D32"
                    symbolClass="w-3 h-3 md:w-4 md:h-4"
                  />
                  <span className="text-xs md:text-sm text-gray-600">
                    {" "}
                    إلى رصيدك
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  {activity.timestamp}
                </p>
              </div>
            </div>

            {/* Remind Button - Only show if status is pending */}
            {activity.status === "pending" && (
              <button
                onClick={() => handleRemind(activity.id)}
                className="w-full md:w-auto bg-orange-50 hover:bg-orange-100 text-navyteal font-semibold py-2 px-4 rounded-full transition-colors text-sm md:text-base"
              >
                ذكره بالاشتراك
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;

