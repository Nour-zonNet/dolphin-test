import { FaTelegramPlane, FaWhatsapp } from "../../../utils/icons";

const SocialButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 space-x-4 px-4 flex gap-3 bg-white border-2 border-dashed border-[#0C78B9] rounded-full p-3 shadow">
      <button>
        <FaWhatsapp />
      </button>
      <button>
        <FaTelegramPlane />
      </button>
    </div>
  );
};

export default SocialButtons;
