import { Home } from "../../utils/icons";
import profileImg from "../../assets/profileImage.png";
const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-1px_3px_0_rgba(0,0,0,0.1)]  ">
      <div className="flex justify-between px-4 sm:px-6 items-center py-2">
        {/* Home */}
        <button className="flex flex-col items-center text-[#0C2D40] hover:scale-105 transition">
          <Home className="w-6 h-6" />
          <span className="text-sm font-medium">الرئيسية</span>
        </button>

        {/* Profile */}
        <button className="flex flex-col items-center text-[#0C2D40] hover:scale-105 transition">
          <div className="relative w-10 h-10 rounded-full border-2 border-[#E89B32] flex items-center justify-center overflow-hidden bg-white">
            <img
              src={profileImg}
              alt="profile"
              className="w-6 h-6 object-cover group-hover:scale-110 transition"
            />
          </div>
          <span className="text-sm font-medium">حسابي</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
