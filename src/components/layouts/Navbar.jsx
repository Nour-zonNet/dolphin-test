import { Headphones, Settings } from "../../utils/icons";

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
        <button className="flex items-center text-xs gap-2 bg-orangedeep text-[#0C2D40] font-medium px-4 sm:px-6 py-2 rounded-full shadow hover:scale-105 transition  sm:text-sm">
          <Settings size={18} />
          <span>إدارة الاشتراك</span>
        </button>

        {/* Support Button */}
        <button className="flex items-center text-xs gap-2 bg-orangedeep text-[#0C2D40] font-medium px-4 sm:px-6 py-2 rounded-full shadow hover:scale-103 transition  sm:text-sm">
          <Headphones size={18} />
          <span>الدعم</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
