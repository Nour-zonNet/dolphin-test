import { SupportIcon } from "../../utils/icons";


const HomeSupportBtn = () => {
  return (
    <button className="flex items-center justify-center w-24 h-24 mr-10 fixed bottom-12 bg-orangedeep text-darkblue rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer">
      <SupportIcon />
    </button>
  );
};

export default HomeSupportBtn;
