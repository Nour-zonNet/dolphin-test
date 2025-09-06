import { useNavigate } from "react-router-dom";
import { Settings } from "../../utils/icons";

const SubscribeBtn = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/manage-subscription")}
      className="flex items-center gap-2 rounded-full bg-orangedeep text-darkblue font-medium 
                 px-3 sm:px-5 py-2 text-xs sm:text-sm 
                 hover:bg-btnClicked focus:bg-btnClicked transition cursor-pointer"
    >
      <Settings size={18} className="shrink-0 text-deepnavy" />
      <span className="text-xs sm:text-sm md:text-base">إدارة الاشتراك</span>
    </button>
  );
};

export default SubscribeBtn;
