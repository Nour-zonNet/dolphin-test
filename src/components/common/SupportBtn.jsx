import { Headphones } from "../../utils/icons";

const SupportBtn = () => {
  return (
    <button className="flex items-center text-xs gap-2 bg-orangedeep text-darkblue font-medium px-4 sm:px-6 py-2 rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer sm:text-sm">
      <Headphones size={18} />
      <span>الدعم</span>
    </button>
  );
};

export default SupportBtn;
