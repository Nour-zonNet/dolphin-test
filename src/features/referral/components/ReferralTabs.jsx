import React from "react";

const ReferralTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-4 mt-6">
      <h3 className="font-bold text-black text-base md:text-xl lg:text-2xl hidden lg:block lg:w-1/2">دعوة الأصدقاء والمكافآت</h3>
      <div className="flex items-center justify-between gap-2 md:gap-4 border border-gray-200 rounded-full lg:w-1/2 w-full bg-[#FBFBFB]">
        <button
          onClick={() => setActiveTab("invite")}
          className={`flex-1 py-4 px-4 text-center font-semibold text-sm md:text-base lg:text-lg transition-colors rounded-full ${
            activeTab === "invite"
              ? "bg-orangedeep text-navyteal"
              : "text-[#554E4E]"
          }`}
        >
          دعوة الأصدقاء
        </button>
        <button
          onClick={() => setActiveTab("myReferrals")}
          className={`flex-1 py-4 px-4 text-center font-semibold text-sm md:text-base lg:text-lg transition-colors rounded-full ${
            activeTab === "myReferrals"
              ? "bg-orangedeep text-navyteal"
              : "text-[#554E4E]"
          }`}
        >
          إحالاتي
        </button>
      </div>
    </div>
  );
};

export default ReferralTabs;

