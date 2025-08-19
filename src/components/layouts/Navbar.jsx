import SubscribeBtn from "../common/SubscribeBtn";
import SupportBtn from "../common/SupportBtn";

function Navbar() {
  return (
    <nav className="w-full flex flex-row md:flex-row items-center justify-between py-4 px-4 sm:px-6 bg-white text-nowrap  shadow">
      {/* Title Section */}
      <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold ">
        <span className="text-base text-gray-500 text-nowrap">
          الجدول الدراسي
        </span>
        <span className="text-base text-orangedeep relative text-nowrap">
          الباقات المشترك بها
          {/* underline */}
          <span className=" absolute bottom-[-6px] right-0 w-full h-1 bg-orangedeep rounded"></span>
        </span>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-2 sm:gap-4 w-full justify-end md:w-auto  ">
        {/* Subscription Button */}

        <SubscribeBtn />
        {/* Support Button */}
        <SupportBtn />
      </div>
    </nav>
  );
}

export default Navbar;
