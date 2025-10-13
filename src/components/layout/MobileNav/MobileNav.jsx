import { Home } from "@/utils/icons"; // 👈 ضفنا Book
import { ProfileInfo } from "./components";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ContentIcon } from "../../../utils/icons";
import { FaTelegramPlane } from "@/utils/icons";

const MobileNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const activeColor = "#1B648E";
  const inactiveColor = "#7A8085";

  // Detect active tab from current route
  let activeTab = "home";
  if (location.pathname.startsWith("/profile")) activeTab = "profile";
  else if (location.pathname.startsWith("/community")) activeTab = "community";
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

        {/* Community */}
        <button
          onClick={() => navigate("/community")}
          className="flex flex-col items-center justify-end gap-2 h-full transition cursor-pointer hover:scale-105"
        >
          <svg
            width="25"
            height="18"
            viewBox="0 0 25 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.83301 6C6.48986 6 7.83301 4.65685 7.83301 3C7.83301 1.34315 6.48986 0 4.83301 0C3.17615 0 1.83301 1.34315 1.83301 3C1.83301 4.65685 3.17615 6 4.83301 6Z"
              fill={activeTab === "community" ? activeColor : inactiveColor}
            />
            <path
              d="M8.12301 8.07C7.11651 8.69807 6.2864 9.57195 5.71083 10.6094C5.13526 11.6468 4.83318 12.8136 4.83301 14H2.83301C2.30306 13.9984 1.79527 13.7872 1.42054 13.4125C1.04581 13.0377 0.834591 12.5299 0.833008 12L0.833008 10C0.835382 9.20508 1.15221 8.4434 1.71431 7.8813C2.27641 7.31921 3.03809 7.00237 3.83301 7H5.83301C6.26958 7.00098 6.70067 7.09724 7.0962 7.28205C7.49172 7.46686 7.84215 7.73577 8.12301 8.07Z"
              fill={activeTab === "community" ? activeColor : inactiveColor}
            />
            <path
              d="M20.833 6C22.4899 6 23.833 4.65685 23.833 3C23.833 1.34315 22.4899 0 20.833 0C19.1762 0 17.833 1.34315 17.833 3C17.833 4.65685 19.1762 6 20.833 6Z"
              fill={activeTab === "community" ? activeColor : inactiveColor}
            />
            <path
              d="M24.833 10V12C24.8314 12.5299 24.6202 13.0377 24.2454 13.4125C23.8707 13.7872 23.3629 13.9984 22.833 14H20.833C20.8328 12.8136 20.5307 11.6468 19.9551 10.6094C19.3796 9.57195 18.5495 8.69807 17.543 8.07C17.8238 7.73577 18.1743 7.46686 18.5698 7.28205C18.9653 7.09724 19.3964 7.00098 19.833 7H21.833C22.6279 7.00237 23.3896 7.31921 23.9517 7.8813C24.5138 8.4434 24.8306 9.20508 24.833 10Z"
              fill={activeTab === "community" ? activeColor : inactiveColor}
            />
            <path
              d="M12.833 8C15.0421 8 16.833 6.20914 16.833 4C16.833 1.79086 15.0421 0 12.833 0C10.6239 0 8.83301 1.79086 8.83301 4C8.83301 6.20914 10.6239 8 12.833 8Z"
              fill={activeTab === "community" ? activeColor : inactiveColor}
            />
            <path
              d="M18.833 14V15C18.8306 15.7949 18.5138 16.5566 17.9517 17.1187C17.3896 17.6808 16.6279 17.9976 15.833 18H9.83301C9.03809 17.9976 8.27641 17.6808 7.71431 17.1187C7.15221 16.5566 6.83538 15.7949 6.83301 15V14C6.83301 12.6739 7.35979 11.4021 8.29747 10.4645C9.23516 9.52678 10.5069 9 11.833 9H13.833C15.1591 9 16.4309 9.52678 17.3685 10.4645C18.3062 11.4021 18.833 12.6739 18.833 14Z"
              fill={activeTab === "community" ? activeColor : inactiveColor}
            />
          </svg>

          <span
            className="text-xs sm:text-xs font-semibold"
            style={{
              color: activeTab === "community" ? activeColor : inactiveColor,
            }}
          >
            {t("mobileNavigation.community")}
          </span>
        </button>

        {/* Profile */}
        <ProfileInfo isActive={activeTab === "profile"} />
      </div>
    </nav>
  );
};

export default MobileNav;
