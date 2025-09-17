import { Home } from "@/utils/icons";
import { ProfileInfo } from "./components";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const MobileNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const activeColor = "#1B648E";
  const inactiveColor = "#7A8085";

  // Detect active tab from current route
  const activeTab = location.pathname.startsWith("/profile") ? "profile" : "home";

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white shadow-[0_-1px_1px_0_rgba(0,0,0,0.15)] z-50">
      <div className="flex justify-between px-18 items-stretch py-2">

        {/* Home */}
        <button
          onClick={() => navigate("/schedule")}
          className="flex flex-col items-center justify-end gap-2 h-full transition cursor-pointer hover:scale-105"
        >
          <Home
            className="w-4 h-4 sm:w-6 sm:h-6"
            color={activeTab === "home" ? activeColor : inactiveColor}
          />
          <span
            className="text-xs sm:text-xs font-semibold"
            style={{
              color: activeTab === "home" ? activeColor : inactiveColor,
            }}
          >
            {t("mobileNavigation.home")}
          </span>
        </button>

        {/* Profile */}
        <ProfileInfo isActive={activeTab === "profile"} />
      </div>
    </nav>
  );
};

export default MobileNav;