import { SupportIcon } from "../../utils/icons";

const HomeSupportBtn = () => {
  return (
    <button
      className="
        fixed bottom-24 right-0 z-50 
        flex items-center justify-center
        w-16 h-16 md:w-20 md:h-20
        mx-4 sm:mx-6
        bg-orangedeep text-darkblue
        rounded-full shadow-lg
        hover:bg-btnClicked focus:bg-btnClicked
        cursor-pointer transition-transform duration-300
        hover:scale-110
      "
    >
      <SupportIcon width="28" height="28" className="w-6 h-6 md:w-8 md:h-8" />
    </button>
  );
};

export default HomeSupportBtn;
