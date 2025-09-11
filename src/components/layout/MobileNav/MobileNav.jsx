import { Home } from "@/utils/icons";
import { ProfileInfo } from "./components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentIcon } from "../../../utils/icons";
import { useNavigate } from "react-router-dom";

const MobileNav = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("home");
  const activeColor = "#1B648E";
  const inactiveColor = "#7A8085";
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white shadow-[0_-1px_1px_0_rgba(0,0,0,0.15)] z-50">
    <div className="flex justify-between px-18  items-stretch py-2 h-16">

        {/* Home */}
        <button
          onClick={() =>{ setActiveTab("home"), navigate("/schedule")}}

          className="flex flex-col items-center justify-end gap-2 h-full transition cursor-pointer hover:scale-105 "
        >
          <Home
            className="w-4 h-4 sm:w-6 sm:h-6"
            color={activeTab === "home" ? "#1B648E" : "#7A8085"}
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

        {/* Content */}
        {/* <button
          onClick={() => setActiveTab("content")}
          className="flex flex-col items-center cursor-pointer justify-between h-full transition hover:scale-105 "
        >
          {activeTab === "content" ? (
            <ContentIcon />
          ) : (
            <ContentIcon fill="#7A8085" />
          )}
          <span
             className="text-xs sm:text-xs font-semibold"
            style={{
              color: activeTab === "content" ? activeColor : inactiveColor,
            }}
          >
            {t("mobileNavigation.content")}
          </span>
        </button> */}

        {/* Profile */}
        <ProfileInfo
          isActive={activeTab === "profile"}
          onActivate={() => setActiveTab("profile")}
        />
      </div>
    </nav>
  );
};

export default MobileNav;
{
  /* Bottom Navigation - Mobile Only */
}
{
  /* <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-1px_0px_#00000021] p-3 md:hidden">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center justify-center gap-1 text-foundation-bluedark">
            <img
              className="w-6 h-6"
              alt="حسابي"
              src="https://c.animaapp.com/mezbipdmunBbmz/img/group-39878.png"
            />
            <div className="text-xs font-semibold text-center">حسابي</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 text-foundationbluedark-hover">
            <img
              className="w-6 h-6"
              alt="المحتوى"
              src="https://c.animaapp.com/mezbipdmunBbmz/img/frame.png"
            />
            <div className="text-xs font-semibold text-center">المحتوى</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 text-foundationbluedark-hover">
            <img
              className="w-6 h-6"
              alt="الرئيسية"
              src="https://c.animaapp.com/mezbipdmunBbmz/img/group.png"
            />
            <div className="text-xs font-semibold text-center">الرئيسية</div>
          </div>
        </div>
        <div className="mx-auto w-24 h-1 bg-black rounded-full mt-2" />
      </nav> */
}
