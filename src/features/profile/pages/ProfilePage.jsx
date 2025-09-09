import React from "react";
import { Divider, ProfileHeader } from "@/components";
import UserProfile from "../components/UserProfile";
import AddSiblingButton from "../components/AddSiblingButton";
import WalletBalance from "../components/WalletBalance";
import AccountInfo from "../components/AccountInfo";
import SubscriptionSection from "../components/SubscriptionSection";
import { ProfileActions } from "../components";
import { MobileNav } from "@/components";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { HomeSupportBtn } from '@/components'

const ProfilePage = () => {
  const { user } = useProfile();
  return (
    <div className="min-h-svh bg-white flex flex-col">
      <ProfileHeader title="الملف الشخصي" />
      <main className="flex-1 px-4 sm:px-8 lg:px-20 py-4 md:py-8 space-y-10 md:space-y-16 mx-auto w-full">
        <div className="flex lg:items-center justify-between flex-col lg:flex-row">
          <UserProfile user={user} />
          <AddSiblingButton />
        </div>

        <div className="space-y-8 md:space-y-16">
          <WalletBalance />
          <Divider />
          <AccountInfo user={user} />
          <Divider />
          <SubscriptionSection />
        </div>

        <ProfileActions />
      </main>
      <MobileNav />
      <HomeSupportBtn />
    </div>
  );
};

export default ProfilePage;
