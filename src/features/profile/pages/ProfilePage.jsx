import { Divider, ProfileHeader } from "@/components";
import { Link } from "react-router-dom";
import { Support, Reports, Riyal } from "@/utils/icons";
import UserProfile from "../components/UserProfile";
import AddSiblingButton from "../components/AddSiblingButton";
import AccountInfo from "../components/AccountInfo";
import SubscriptionSection from "../components/SubscriptionSection";
import { ProfileActions } from "../components";
import { useProfile } from "@/features/profile/hooks/useProfile";
import FormatWithCurrency from "@/utils/FormatWithCurrency";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { user } = useProfile();
  const { currentBalance } = useSelector((state) => state.balance);
  
  return (
    <div className="min-h-svh bg-white flex flex-col">
      <ProfileHeader title="الملف الشخصي" />
      <main className="flex-1 px-4 sm:px-8 lg:px-20 py-4 md:py-8 space-y-10 md:space-y-16 mx-auto w-full">
        <div className="flex lg:items-center justify-between flex-col lg:flex-row">
          <UserProfile user={user} />
          <AddSiblingButton />
        </div>

        {/* Small Quick Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Balance Card */}
          <Link
            to="/balance-details"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl p-5 bg-[rgba(58,136,9,0.15)] hover:bg-[rgba(58,136,9,0.25)] transition"
          >
            <Riyal className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8" />
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm md:text-base lg:text-lg text-navyteal">
                الرصيد:
              </span>
              <FormatWithCurrency
                amount={currentBalance}
                fractionDigits={0}
                className="text-navyteal font-bold text-sm md:text-base lg:text-lg"
                symbolFill="#08233F"
                symbolClass="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
              />
            </div>
          </Link>

          {/* Support Card */}
          <Link
            to="/complaints"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl p-5 bg-[#FBEFE2] hover:bg-[#f8e4d3] transition"
          >
            <Support className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8" />
            <span className="text-sm md:text-base lg:text-lg text-navyteal font-semibold">
              الدعم الفني
            </span>
          </Link>

          {/* Reports Card */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl p-5 bg-[#EAF3FB] opacity-50 cursor-not-allowed">
            <Reports className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8" />
            <span className="text-sm md:text-base lg:text-lg text-navyteal font-semibold">
              تقاريري
            </span>
          </div>
        </div>

        <div className="space-y-8 md:space-y-16">
          {/* <WalletBalance /> */}
          <Divider />
          <AccountInfo user={user} />
          <Divider />
          <SubscriptionSection />
        </div>

        <ProfileActions />
      </main>
    </div>
  );
};

export default ProfilePage;
