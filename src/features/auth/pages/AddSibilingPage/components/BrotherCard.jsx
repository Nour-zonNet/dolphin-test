import React from "react";
import profileImg from "@/assets/images/profileImage.png";

const BrotherCard = ({ brother }) => {
  return (
    <div className="w-full h-18 md:h-20 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
          <img
            className="w-full h-full object-cover"
            alt={`${brother?.name} avatar`}
            src={brother?.profilePicture || profileImg}
          />
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-base  [font-family:'Cairo',Helvetica]">
            {brother?.student_name}
          </div>
          <div className="font-normal text-sm text-gray-600  [font-family:'Cairo',Helvetica]">
            {brother?.class_name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrotherCard;
