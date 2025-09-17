import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AttachmentItem } from "./AttachmentItem";
import summary from "@/assets/schedule/summary.svg";
import exams from "@/assets/schedule/exams.svg";
import filePdf from "@/assets/schedule/file.svg";
import { Attachments } from "@/utils/icons";

const TEST_PDF_URL =
  "https://admintest.learnadolphin.com/lesson/pdf/63t645c8KYru8eNXcdtvZw6SSHIdrXUYxEIWDGgc.pdf";

const guessFileName = (url) => {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last || "file.pdf";
  } catch {
    return "file.pdf";
  }
};

const openViaAnchor = (url) => {
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const AttachmentsSection = () => {
  const { t } = useTranslation();

  const cards = useMemo(
    () => [
      { title: "ملخص الدرس", size: "2.5 MB", hasImportantBadge: true,  hasDownloadIcon: true, iconSrc: summary, href: TEST_PDF_URL },
      { title: "تدريبات الدرس", size: "2.5 MB", hasImportantBadge: true,  hasDownloadIcon: true, iconSrc: exams,   href: TEST_PDF_URL },
      { title: "الدرس الرابع: الأفعال المساعدة", size: "2.5 MB", hasImportantBadge: false, hasDownloadIcon: true, iconSrc: filePdf, href: TEST_PDF_URL },
      { title: "تدريبات الدرس", size: "2.5 MB", hasImportantBadge: true,  hasDownloadIcon: true, iconSrc: exams,   href: TEST_PDF_URL },
    ],
    []
  );

  const handleOpen = useCallback((url) => openViaAnchor(url), []);
  const handleDownload = useCallback(async (url) => {
    if (!url) return;
    try {
      const res = await fetch(url, { credentials: "include" });
      const blob = await res.blob();

      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename\*?=(?:UTF-8'')?"?([^\";]+)"?/i);
      const nameFromHeader = match ? decodeURIComponent(match[1]) : null;
      const filename = nameFromHeader || guessFileName(url);

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    } catch {
      openViaAnchor(url);
    }
  }, []);

  return (
    <div className="w-full mx-auto lg:mt-0">
      <div className="flex items-center justify-start gap-6 mb-6">
        <div className="bg-[#7473AA] md:w-[60px] md:h-[60px] w-[40px] h-[40px] flex items-center justify-center rounded-full">
          <Attachments className="w-5 md:w-6" />
        </div>
        <h2 className="font-bold text-sm md:text-xl text-navyteal">
          {t("lesson_content.attachments")}
        </h2>
      </div>

      <div className="flex gap-4 max-h-[calc(6*60px)] overflow-y-scroll scrollbar-custom">
        <div className="space-y-4 md:pl-6 pl-2 w-full" dir="rtl">
          {cards.map((card, i) => (
            <AttachmentItem
              key={i}
              title={card.title}
              size={card.size}
              hasImportantBadge={card.hasImportantBadge}
              hasDownloadIcon={card.hasDownloadIcon}
              iconSrc={card.iconSrc}
              href={card.href}               
              isCardClickable={!!card.href}     
              onOpen={() => handleOpen(card.href)}
              onDownload={() => handleDownload(card.href)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsSection;
