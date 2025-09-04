import React, { useState } from "react";
import { ImportantBadge } from "./ImportantBadge";
import dots from "@/assets/schedule/dots.svg";
import { DownloadFile, OpenFile } from "@/utils/icons";
import { useTranslation } from "react-i18next";

export const AttachmentItem = ({ title, size, hasImportantBadge, hasDownloadIcon, iconSrc }) => {
  const [isMenumOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="relative w-full bg-[#f2f2f7] rounded-lg p-6 min-h-[106px] flex items-center">
      <div className="flex items-center justify-between">
        <div className="bg-[#C4D6E1] md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer">
          {hasDownloadIcon && iconSrc && (
            <img className="w-5 md:w-6" alt="Download" src={iconSrc} />
          )}
        </div>

        {hasImportantBadge && (
          <div className="absolute left-12 md:left-10 top-10">
            <ImportantBadge />
          </div>
        )}
      </div>

      <div className="flex-1 text-right mr-4 cursor-pointer">
        <h3 className="font-semibold text-sm md:text-lg text-navyteal mb-2">{title}</h3>
        <p className="font-normal text-black text-sm md:text-base">{size}</p>
      </div>

      <div className="relative">
        <img className="cursor-pointer" alt="File" src={dots} onClick={() => setIsMenuOpen(!isMenumOpen)} />
        {isMenumOpen && (
          <div className="z-10 flex flex-col justify-center items-center gap-4 bg-white md:w-[220px] w-[200px] h-[160px] rounded-3xl border-[#8C8C8C] absolute left-0">
            <div className="flex items-center gap-4 cursor-pointer">
              <OpenFile className="w-5 md:w-6" />
              <p className="font-semibold text-navyteal text-sm md:text-[16px]">{t("lesson_content.open_file")}</p>
            </div>
            <div className="bg-gray-400 h-[1px] w-[60%]"></div>
            <div className="flex items-center gap-4 cursor-pointer">
              <DownloadFile className="w-5 md:w-6" />
              <p className="font-semibold text-navyteal text-sm md:text-[16px]">{t("lesson_content.download_file")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentItem;


