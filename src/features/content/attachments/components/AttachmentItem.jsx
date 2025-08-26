import React from "react";
import { ImportantBadge } from "./ImportantBadge";

export const AttachmentItem = ({ title, size, hasImportantBadge, hasDownloadIcon, iconSrc }) => {
  return (
    <div className="relative w-full bg-[#f2f2f7] rounded-lg p-6 min-h-[106px] flex items-center">
      {/* Download Icon */}
      {hasDownloadIcon && iconSrc && (
        <img
          className="w-[60px] h-[60px] ml-4"
          alt="Download"
          src={iconSrc}
        />
      )}

      {/* Important Badge */}
      {hasImportantBadge && (
        <div className="absolute left-[111px] top-7">
          <ImportantBadge />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 text-right mr-2">
        <h3 className="font-semibold text-lg text-navyteal mb-2">
          {title}
        </h3>
        <p className="font-normal text-black text-base">
          {size}
        </p>
      </div>
      
      {/* File Icon */}
      <img
        className="w-8 h-8 mr-4"
        alt="File"
        src="https://c.animaapp.com/mer0eh3xn7npjs/img/frame.svg"
      />
    </div>
  );
};

export default AttachmentItem