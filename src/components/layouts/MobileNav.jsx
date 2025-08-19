import { Home } from "../../utils/icons";
import ProfileInfo from "../common/ProfileInfo";
const MobileNav = () => (
  <nav className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-1px_3px_0_rgba(0,0,0,0.1)]  ">
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
