import React from "react";
import { Cross, FaWhatsapp, FaTelegramPlane } from "@/utils/icons";

const ShareModal = ({ onClose, referralCode = "", shareMessage = "" }) => {
  // Construct the referral link - adjust this URL based on your app's registration page
  const referralLink = referralCode
    ? `${window.location.origin}/register?referral=${referralCode}`
    : window.location.origin;

  // Default share message in Arabic
  const defaultMessage = shareMessage || `انضم إلى تعلم مع دولفين باستخدام كود الإحالة الخاص بي: ${referralCode}`;
  const shareText = `${defaultMessage}\n${referralLink}`;

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  // Telegram share
  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(defaultMessage)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  // Native Web Share API (if available)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "كود الإحالة",
          text: defaultMessage,
          url: referralLink,
        });
        onClose();
      } catch (error) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      // You might want to show a success toast here
      onClose();
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions = [
    {
      id: "whatsapp",
      label: "واتساب",
      icon: <FaWhatsapp width="32" height="32" />,
      bgColor: "bg-[#25D366]",
      onClick: handleWhatsAppShare,
    },
    {
      id: "telegram",
      label: "تيليجرام",
      icon: <FaTelegramPlane width="32" height="32" />,
      bgColor: "bg-[#0088cc]",
      onClick: handleTelegramShare,
    },
    ...(navigator.share
      ? [
          {
            id: "native",
            label: "مشاركة أخرى",
            icon: (
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            ),
            bgColor: "bg-gray-600",
            onClick: handleNativeShare,
          },
        ]
      : []),
    {
      id: "copy",
      label: "نسخ الرابط",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      bgColor: "bg-[#5C6064]",
      onClick: handleCopyLink,
    },
  ];

  return (
    <div className="relative w-screen max-w-md bg-white rounded-2xl p-6 shadow-lg z-50">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition"
      >
        <Cross width="16" height="16" />
      </button>

      {/* Title */}
      <div className="flex flex-col items-center mt-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center font-cairo">
          شارك كود الإحالة
        </h2>
        {referralCode && (
          <p className="mt-2 text-sm text-gray-600 text-center font-cairo">
            كود الإحالة: <span className="font-bold text-orangedeep">{referralCode}</span>
          </p>
        )}
      </div>

      {/* Share Options Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {shareOptions.map((option) => (
          <button
            key={option.id}
            onClick={option.onClick}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl ${option.bgColor} text-white hover:opacity-90 transition-all transform hover:scale-105 active:scale-95`}
          >
            <div className="text-white">{option.icon}</div>
            <span className="text-sm md:text-base font-semibold font-cairo">
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* Referral Link Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-2 font-cairo">الرابط:</p>
        <p className="text-xs text-gray-700 break-all font-cairo">{referralLink}</p>
      </div>
    </div>
  );
};

export default ShareModal;

