import React, { useState } from "react";
import { Copy } from "@/utils/icons";
import { ProfileButtons } from "@/components";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useModal } from "@/components/feedback/modal/useModal";

const ReferralCodeCard = () => {
  const { user } = useProfile();
  const { openStatusModal } = useModal();
  const [copied, setCopied] = useState(false);
  
  // TODO: Get referral code from user data or API
  const referralCode = user?.referralCode || "RewH56432J";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      openStatusModal("SUCCESS", {
        title: "تم النسخ",
        message: "تم نسخ كود الإحالة بنجاح",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      openStatusModal("ERROR", {
        title: "خطأ",
        message: "فشل نسخ كود الإحالة",
      });
    }
  };

  const handleInviteFriends = async () => {
    // Construct the referral link
    const referralLink = `${window.location.origin}/register?referral=${referralCode}`;
    const shareMessage = `انضم إلى تعلم مع دولفين باستخدام كود الإحالة الخاص بي: ${referralCode}`;

    // Check if native share is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "كود الإحالة",
          text: shareMessage,
          url: referralLink,
        });
      } catch (error) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          openStatusModal("ERROR", {
            title: "خطأ",
            message: "فشل مشاركة كود الإحالة",
          });
        }
      }
    } else {
      // Fallback: copy link to clipboard if native share is not available
      try {
        await navigator.clipboard.writeText(`${shareMessage}\n${referralLink}`);
        openStatusModal("SUCCESS", {
          title: "تم النسخ",
          message: "تم نسخ رابط الإحالة بنجاح",
        });
      } catch (err) {
        openStatusModal("ERROR", {
          title: "خطأ",
          message: "متصفحك لا يدعم المشاركة. يرجى نسخ الرابط يدوياً.",
        });
      }
    }
  };

  return (
    <div className="bg-white border border-[#D9D9D9] rounded-[24px] p-4 md:p-8 space-y-6 w-full h-full flex flex-col">
      {/* Referral Code Section */}
      <div className="space-y-10">
        <p className="text-base md:text-xl lg:text-2xl text-black font-semibold text-center">
          كود الإحالة الخاص بك
        </p>
        <div className="flex items-center justify-between border border-dashed border-[#99A1A7] rounded-lg md:px-10 px-5 py-3">
            <span className="font-bold text-sm md:text-base lg:text-lg text-[#5C6064]">{referralCode}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-4 py-1.5 bg-orangedeep text-navyteal rounded-lg hover:bg-btnClicked transition font-semibold text-sm md:text-base"
            >
              <Copy className="w-4 h-4 md:w-5 md:h-5" />
              <span className="underline">نسخ</span>
            </button>
        </div>
      </div>

      {/* Invite Friends Button */}
      <div className="flex justify-center mt-4 mx-auto w-full">
        <ProfileButtons
          onClick={handleInviteFriends}
          variant="primary"
          size=""
          className="w-[70%] cursor-pointer bg-orangedeep hover:bg-btnClicked transition py-3 px-6"
        >
        <svg
          className="w-5 h-5 md:w-6 md:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <span className="text-navyteal font-semibold text-sm md:text-base lg:text-lg">دعوة الأصدقاء</span>
        </ProfileButtons>
      </div>
    </div>
  );
};

export default ReferralCodeCard;

