import { FaTelegramPlane, FaWhatsapp } from "@/utils/icons";

const SocialButtons = () => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-row gap-3 bg-white border-2 border-dashed border-[#0C78B9] rounded-full p-2 sm:p-3 shadow-lg z-50">
      <button
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white hover:scale-110 transition"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={20} />
      </button>
      <button
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sky-500 text-white hover:scale-110 transition"
        aria-label="Telegram"
      >
        <FaTelegramPlane size={20} />
      </button>
    </div>
  );
};

export default SocialButtons;
