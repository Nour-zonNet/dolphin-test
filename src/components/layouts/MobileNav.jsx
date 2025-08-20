import { Home } from "../../utils/icons";
import ProfileInfo from "../common/ProfileInfo";
const MobileNav = () => (
  <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white shadow-[0_-1px_3px_0_rgba(0,0,0,0.1)] z-50  max-w-[744px]">
    <div className="flex justify-between px-4 sm:px-6 items-center py-2">
      {/* Home */}
      <button className="flex flex-col items-center text-darkblue hover:scale-105 transition">
        <Home className="w-6 h-6" />
        <span className="text-sm font-medium">الرئيسية</span>
      </button>

      {/* Profile */}
      <ProfileInfo />
    </div>
  </nav>
);

export default MobileNav;
