import { SupportIcon } from "../../utils/icons";

const HomeSupportBtn = () => {
  return (
    <button
      className="
        fixed bottom-[12%] right-0 z-50 
        flex items-center justify-center
        w-15 h-15 md:w-20 md:h-20
        mx-4 sm:mx-6
        bg-orangedeep text-darkblue
        rounded-full shadow-lg
        hover:bg-btnClicked focus:bg-btnClicked
        cursor-pointer transition-transform duration-300
        hover:scale-110
      "
    >
      <SupportIcon width="28" height="28" className="w-6  md:w-8  " />
    </button>
  );
};

export default HomeSupportBtn;