import React, { useState } from "react";
import { useModal } from "@/components/feedback/modal/useModal";
import ReferralTabs from "../components/ReferralTabs";
import ReferralCodeCard from "../components/ReferralCodeCard";
import LevelProgressCard from "../components/LevelProgressCard";
import MonthlyChallengeCard from "../components/MonthlyChallengeCard";
import BalanceCards from "../components/BalanceCards";
import ActivityLog from "../components/ActivityLog";
import InvitedFriends from "../components/InvitedFriends";
import Header from "@/components/layout/Header";

const ReferralPage = () => {
  const { openHowItWorksModal } = useModal();
  const [activeTab, setActiveTab] = useState("invite"); 

  return (
    <div className="min-h-svh bg-white flex flex-col">
      {/* Header */}
      <Header 
        title="الإحالة" 
        showBalanceSection={false} 
        onBack="/profile" 
        showInfo={true}
        onInfoClick={openHowItWorksModal}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-20 py-4 md:py-8 space-y-6 md:space-y-8">
        {/* Tabs */}
        <ReferralTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "invite" ? (
          <>
            {/* Referral Code Card and Level Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
              <ReferralCodeCard />
              <LevelProgressCard />
            </div>

            {/* Balance Cards and Monthly Challenge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
              <BalanceCards />
              <MonthlyChallengeCard />
            </div>
          </>
        ) : activeTab === "myReferrals" ? (
          // Referral List Tab
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Right Column - Invited Friends */}
            <div className="lg:col-span-1">
              <InvitedFriends />
            </div>
            {/* Left Column - Activity Log */}
            <div className="lg:col-span-1">
              <ActivityLog />
            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ReferralPage;

