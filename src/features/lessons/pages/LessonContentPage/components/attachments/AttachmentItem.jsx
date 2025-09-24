import React, { useEffect, useRef, useState } from "react";
import { ImportantBadge } from "./ImportantBadge";
import dots from "@/assets/schedule/dots.svg";
import { DownloadFile, OpenFile } from "@/utils/icons";
import { useTranslation } from "react-i18next";

export const AttachmentItem = ({
  title,
  size,
  name,
  hasImportantBadge,   
  important,          
  hasDownloadIcon,
  iconSrc,
  onOpen,
  onDownload,
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Prefer `important` from API; fallback to legacy `hasImportantBadge`
  const showImportant = Boolean(
    typeof important === "boolean" ? important : hasImportantBadge
  );

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutside = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (triggerRef.current?.contains(e.target)) return;
      setIsMenuOpen(false);
    };
    const handleEsc = (e) => { if (e.key === "Escape") setIsMenuOpen(false); };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

    const displayTitle =
    (typeof children === "string" && children.trim()) ? children :
    (title && String(title).trim()) || (name && String(name).trim()) || "ملف PDF";

  return (
    <div
      className="relative w-full bg-[#f2f2f7] rounded-lg p-6 min-h-[106px] flex items-center"
    >
      {/* Left: circular thumbnail (clickable) */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen?.();
          }}
          className="bg-[#C4D6E1] md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99bcd1] hover:opacity-90 transition cursor-pointer"
          aria-label={title ? `Open ${title}` : t("lesson_content.open_file")}
        >
          {hasDownloadIcon && iconSrc && (
            <img className="w-5 md:w-6" alt="Attachment" src={iconSrc} />
          )}
        </button>

        {showImportant && (
          <div className="absolute left-12 md:left-20 top-11">
            <ImportantBadge />
          </div>
        )}
      </div>

      {/* Middle: title (clickable) + size */}
      <div className="flex-1 mr-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen?.();
          }}
          className="text-left font-semibold text-sm md:text-lg text-navyteal mb-2 hover:opacity-90 cursor-pointer"
          title={displayTitle}
        >
          {displayTitle}
        </button>
        <p className="font-normal text-black text-sm md:text-base">{size}</p>
      </div>

      {/* Right: menu (… ) */}
      <div className="relative">
        <img
          ref={triggerRef}
          className="cursor-pointer"
          alt="More"
          src={dots}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMenuOpen((v) => !v);
          }}
        />
        {isMenuOpen && (
          <div
            ref={menuRef}
            role="menu"
            className="z-50 flex flex-col justify-center items-center gap-4 bg-white md:w-[220px] w-[200px] h-[160px] shadow rounded-3xl absolute left-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              role="menuitem"
              className="flex items-center gap-4 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpen?.();
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDownload?.();
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
