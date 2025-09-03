import React from "react";
import { ChevronDown } from "@/utils/icons";

const UserProfile = ({ user }) => {
  return (
    <div className="flex items-center gap-4 md:gap-[37px] py-8">
      <div className="relative">
         <img
          className="w-[80px] md:w-[150px] h-[80px] md:h-[150px] rounded-full object-cover"
          alt="Profile"
          src={
            user?.profilePicture ||
            "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
          }
        />
        <img
          className="absolute w-6 md:w-8 h-6 md:h-8 bottom-1 md:bottom-2.5 left-2.5"
          alt="Edit"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/frame-1.svg"
        />
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center justify-between text-subtext text-xl md:text-[32px] text-center font-semibold">
              {user?.name || "—"}
          </h2>
          <p className="text-[#BA7C28] text-sm md:text-xl text-center font-semibold">
              {user?.gradeName || "—"}
          </p>
        </div>
        <ChevronDown className="w-4 md:w-6 cursor-pointer -mt-8"/>
      </div>
    </div>
  );
};

export default UserProfile;