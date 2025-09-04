import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavTab, SubscribeBtn, SupportBtn } from "./components";
import { TABS } from "../../../constants/TABS";
import LanguageSwitcher from "../../ui/LanguageSwitcher";

function Navbar() {
  const [activeTab, setActiveTab] = useState("schedule");
  const location = useLocation();
  const navigate = useNavigate();

  // Sync active tab with URL
  useEffect(() => {
    if (location.pathname === "/schedule") {
      setActiveTab("schedule");
    } else if (location.pathname === "/subscriptions") {
      setActiveTab("subscriptions");
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(tab === "schedule" ? "/schedule" : "/subscriptions");
  };

  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full flex flex-row items-center justify-between py-8 md:py-10 lg:py-12 px-3 sm:px-6 bg-white shadow-[0px_2px_4px_rgba(192,192,192,0.25)] z-50">
      {/* Tabs Section */}
      <div className="flex items-center gap-3 sm:gap-6 text-base sm:text-lg md:text-xl font-bold w-full md:w-auto">
        {TABS.map((tab) => (
          <NavTab
            key={tab.value}
            labelKey={tab.labelKey}
            value={tab.value}
            active={activeTab === tab.value}
            onClick={handleTabClick}
          />
        ))}
      </div>

      {/* Buttons Section */}
      <div className="flex gap-2 sm:gap-4 w-full justify-end md:w-auto  ">
        {/* <LanguageSwitcher /> */}
        <SubscribeBtn />
        {/* <SupportBtn /> */}
      </div>
    </nav>
  );
}

export default Navbar;
