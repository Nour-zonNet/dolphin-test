import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SubscribeBtn from "../common/SubscribeBtn";
import SupportBtn from "../common/SupportBtn";
import NavTab from "../common/NavTab";

const TABS = [
  { value: "schedule", path: "/schedule", label: "الجدول الدراسي" },
  {
    value: "subscriptions",
    path: "/subscriptions",
    label: "الباقات المشترك بها",
  },
];

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
    <nav className="w-full flex flex-row md:flex-row items-center justify-between py-4 px-4 sm:px-6 bg-white text-nowrap shadow z-50">
      {/* Tabs Section */}
      <div className="flex items-center gap-4 text-xl sm:text-2xl font-bold">
        {TABS.map((tab) => (
          <NavTab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            active={activeTab === tab.value}
            onClick={handleTabClick}
          />
        ))}
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
