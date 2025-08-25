import React from "react";
import { AttachmentItem } from "./AttachmentItem";

export const AttachmentsSection = () => {
  const attachments = [
    {
      title: "ملخص الدرس",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: "https://c.animaapp.com/mer0eh3xn7npjs/img/fab.svg"
    },
    {
      title: "تدريبات الدرس",
      size: "2.5 MB",
      hasImportantBadge: true,
      hasDownloadIcon: true,
      iconSrc: "https://c.animaapp.com/mer0eh3xn7npjs/img/fab.svg"
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: "https://c.animaapp.com/mer0eh3xn7npjs/img/fab-1.svg"
    }
  ];

  return (
    <div className="w-full max-w-[] mx-auto mt-10">
      {/* Divider Line */}
      <div className="w-full mb-6 border-dash-wide text-normalblue/60 first:border-t-0"></div>
      {/* Section Header */}
      <div className="flex items-center justify-start gap-6 mb-6">
        <img
          className="w-[60px] h-[60px]"
          alt="Attachments"
          src="https://c.animaapp.com/mer0eh3xn7npjs/img/fab-3.svg"
        />
        <h2 className="font-bold text-xl text-navyteal">
          الملفات والمرفقات
        </h2>
      </div>

      {/* Attachments List */}
      <div className="relative">
        <div className="space-y-4 pl-6" dir="rtl">
          {attachments.map((attachment, index) => (
            <AttachmentItem key={index} {...attachment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsSection