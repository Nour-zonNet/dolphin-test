import React, { useEffect, useRef, useState } from "react";
import { ImportantBadge } from "./ImportantBadge";
import dots from "@/assets/schedule/dots.svg";
import { DownloadFile, OpenFile } from "@/utils/icons";
import { useTranslation } from "react-i18next";

export const AttachmentItem = ({ title, size, hasImportantBadge, hasDownloadIcon, iconSrc }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const { t } = useTranslation();

  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Close menu on outside click or Esc
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutside = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (triggerRef.current?.contains(e.target)) return;
      setIsMenuOpen(false);
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative w-full bg-[#f2f2f7] rounded-lg p-6 min-h-[106px] flex items-center">
      <div className="flex items-center justify-between">
        <div className="bg-[#C4D6E1] md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer">
          {hasDownloadIcon && iconSrc && (
            <img className="w-5 md:w-6" alt="Download" src={iconSrc} />
          )}
        </div>

        {hasImportantBadge && (
          <div className="absolute left-12 md:left-20 top-11">
            <ImportantBadge />
          </div>
        )}
      </div>

      <div className="flex-1 mr-4 cursor-pointer">
        <h3 className="font-semibold text-sm md:text-lg text-navyteal mb-2">{title}</h3>
        <p className="font-normal text-black text-sm md:text-base">{size}</p>
      </div>

      <div className="relative">
        <img
          ref={triggerRef}
          className="cursor-pointer"
          alt="File"
          src={dots}
          onClick={() => setIsMenuOpen((v) => !v)}
        />
        {isMenuOpen && (
          <div
            ref={menuRef}
            role="menu"
            className="z-10 flex flex-col justify-center items-center gap-4 bg-white md:w-[220px] w-[200px] h-[160px] shadow rounded-3xl absolute left-0"
          >
            <button
              role="menuitem"
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => {
                // do open-file action here
                setIsMenuOpen(false);
              }}
            >
              <OpenFile className="w-5 md:w-6" />
              <p className="font-semibold text-navyteal text-sm md:text-[16px]">
                {t("lesson_content.open_file")}
              </p>
            </button>

            <div className="bg-gray-400 h-[1px] w-[60%]" />

            <button
              role="menuitem"
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => {
                // do download-file action here
                setIsMenuOpen(false);
              }}
            >
              <DownloadFile className="w-5 md:w-6" />
              <p className="font-semibold text-navyteal text-sm md:text-[16px]">
                {t("lesson_content.download_file")}
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentItem;
