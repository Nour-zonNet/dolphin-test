import React, { useState } from "react";
import { ImportantBadge } from "./ImportantBadge";
import dots from "@/assets/schedule/dots.svg";
import { DownloadFile, OpenFile } from "../../../../utils/icons";

export const AttachmentItem = ({ title, size, hasImportantBadge, hasDownloadIcon, iconSrc }) => {
  const [isMenumOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="relative w-full bg-[#f2f2f7] rounded-lg p-6 min-h-[106px] flex items-center">
      {/* Download Icon */}
      <div className="bg-[#C4D6E1] w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer">
        {hasDownloadIcon && iconSrc && (
        <img
          className=""
          alt="Download"
          src={iconSrc}
        />
      )}
      </div>

      {/* Important Badge */}
      {hasImportantBadge && (
        <div className="absolute left-[111px] top-7">
          <ImportantBadge />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 text-right mr-4 cursor-pointer">
        <h3 className="font-semibold text-lg text-navyteal mb-2">
          {title}
        </h3>
        <p className="font-normal text-black text-base">
          {size}
        </p>
      </div>
      
      {/* Dots */}
      <div className="relative">
        <img
          className="cursor-pointer"
          alt="File"
          src={dots}
          onClick={() => setIsMenuOpen(!isMenumOpen)}
        />
        {/* Open & Dowload file popup */}
        {isMenumOpen && (
          <div className="z-10 flex flex-col justify-center items-center gap-4 bg-white w-[220px] h-[160px] rounded-3xl border-[#8C8C8C] absolute left-0">
            <div className="flex items-center gap-4 cursor-pointer">
              <OpenFile />
              <p className="font-semibold text-navyteal">فتح الملف</p>
            </div>
            {/* Border line */}
            <div className="bg-gray-400 h-[1px] w-[60%]"></div>
            <div className="flex items-center gap-4cursor-pointer">
              <DownloadFile />
              <p className="font-semibold text-navyteal">تنزيل الملف</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentItem