import { Headphones } from "../../utils/icons";

const SupportBtn = () => {
  return (
    <button className="flex items-center text-xs gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked  text-darkblue font-medium px-4 sm:px-6 py-2 rounded-full shadow sm:text-sm cursor-pointer">
      <Headphones size={18} />
      <span>الدعم</span>
    </button>
  );
};

export default SupportBtn;