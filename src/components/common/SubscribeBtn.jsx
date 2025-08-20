import React from "react";
import { Settings } from "../../utils/icons";

const SubscribeBtn = () => {
  return (
    <button className="flex items-center text-xs gap-2 bg-orangedeep text-darkblue font-medium px-4 sm:px-6 py-2 rounded-full hover:bg-btnClicked focus:bg-btnClicked cursor-pointer sm:text-sm">
      <Settings size={18} />
      <span>إدارة الاشتراك</span>
    </button>
  );
};

export default SubscribeBtn;
