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
import GlobalLoader from "@/components/feedback/GlobalLoader";
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "@/store/selectors";

const ProfilePage = () => {
  const { user } = useProfile();
  const globalLoading = useSelector(selectGlobalLoading);
  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading profile</div>;
  return (
    <div className="min-h-svh bg-white flex flex-col">
      <ProfileHeader title="الملف الشخصي" />

      <GlobalLoader loading={globalLoading} />
      <main className="flex-1 px-4 sm:px-8 lg:px-20 py-4 md:py-8 space-y-16 mx-auto w-full">
        <div className="flex md:items-center justify-between flex-col md:flex-row">
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
    </div>
  );
};

export default ProfilePage;
