import { Home } from "@/utils/icons"; // 👈 ضفنا Book
import { ProfileInfo } from "./components";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ContentIcon } from "../../../utils/icons";

const MobileNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const activeColor = "#1B648E";
  const inactiveColor = "#7A8085";

  // Detect active tab from current route
  let activeTab = "home";
  if (location.pathname.startsWith("/profile")) activeTab = "profile";
  else if (location.pathname.startsWith("/packages-content"))
    activeTab = "packages";

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white shadow-[0_-1px_1px_0_rgba(0,0,0,0.15)] z-50">
      <div className="flex justify-between px-6 md:px-8 lg:px-12 items-stretch py-2">
        {/* Home */}
        <button
          onClick={() => navigate("/schedule")}
          className="flex flex-col items-center justify-end gap-2 h-full transition cursor-pointer hover:scale-105"
        >
          <Home color={activeTab === "home" ? activeColor : inactiveColor} />
          <span
            className="text-xs sm:text-xs font-semibold"
            style={{
              color: activeTab === "home" ? activeColor : inactiveColor,
            }}
          >
            {t("mobileNavigation.home")}
          </span>
        </button>

        {/* Content */}
        <button
          onClick={() => navigate("/packages-content")}
          className="flex flex-col items-center justify-end gap-2 h-full transition cursor-pointer hover:scale-105"
        >
          <ContentIcon
            fill={activeTab === "packages" ? activeColor : inactiveColor}
          />
          <span
            className="text-xs sm:text-xs font-semibold"
            style={{
              color: activeTab === "packages" ? activeColor : inactiveColor,
            }}
          >
            المحتوى
          </span>
        </button>

        {/* Profile */}
        <ProfileInfo isActive={activeTab === "profile"} />
      </div>
    </nav>
  );
};

export default MobileNav;
