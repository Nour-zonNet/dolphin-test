import { SupportIcon } from "../../utils/icons";


const HomeSupportBtn = () => {
  return (
    <button className="flex items-center justify-center w-20 h-20 mr-[5%] fixed bottom-[4%] bg-orangedeep text-darkblue rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer">
      <SupportIcon />
    </button>
  );
};

export default HomeSupportBtn;
