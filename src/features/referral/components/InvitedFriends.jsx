import React from "react";

const InvitedFriends = () => {
  // TODO: Get from API
  const friends = [
    { id: 1, initial: "ي", name: "يوستينا صلاح", status: "قيد الانتظار" },
    { id: 2, initial: "ن", name: "نور طالب", status: "تم قبولها" },
    { id: 3, initial: "س", name: "سارة أحمد", status: "قيد الانتظار" },
    { id: 4, initial: "م", name: "محمد علي", status: "تم قبولها" },
    { id: 5, initial: "ف", name: "فاطمة حسن", status: "قيد الانتظار" },
    { id: 6, initial: "ع", name: "علي محمود", status: "تم قبولها" },
  ];

  const getStatusColor = (status) => {
    return status === "تم قبولها" ? "text-[#2E7D32]" : "text-orangedeep";
  };

  return (
    <div className="space-y-4 bg-white border border-[#D9D9D9] rounded-[16px] p-3 md:p-4">
      <h4 className="font-semibold text-black text-sm md:text-base lg:text-lg mb-4 text-center">
        اصدقاؤك المدعوون
      </h4>
      <div className="space-y-3">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center gap-3 md:gap-4 p-2"
          >
            {/* Initial Circle */}
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FAEBD6] text-orangedeep flex items-center justify-center">
              <span className="text-btnClicked font-bold text-base md:text-lg">
                {friend.initial}
              </span>
            </div>

            {/* Name and Status */}
            <div className="flex-1">
              <p className="text-sm md:text-base font-semibold text-black">
                {friend.name}
              </p>
              <p className={`text-sm md:text-base font-semibold ${getStatusColor(friend.status)}`}>
                {friend.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvitedFriends;

