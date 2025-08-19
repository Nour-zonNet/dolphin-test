import SubscribeBtn from "../common/SubscribeBtn";
import SupportBtn from "../common/SupportBtn";

function Navbar() {
  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[744px] flex items-center justify-between py-4 px-4 sm:px-6 bg-white text-nowrap z-100">
      {/* Title Section */}
      <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
        <span className="text-base text-gray-500">الجدول الدراسي</span>
        <span className="text-base text-orangedeep relative">
          الباقات المشترك بها
          {/* underline */}
          <span className="absolute bottom-[-6px] right-0 w-full h-1 bg-orangedeep rounded"></span>
        </span>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-2 sm:gap-4 w-full justify-end md:w-auto">
        <SubscribeBtn />
        <SupportBtn />
      </div>
    </nav>
  );
}

export default Navbar;
