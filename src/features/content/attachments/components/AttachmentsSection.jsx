import React from "react";
import { AttachmentItem } from "./AttachmentItem";
import summary from "@/assets/schedule/summary.svg"
import exams from "@/assets/schedule/exams.svg"
import filePdf from "@/assets/schedule/file.svg"

export const AttachmentsSection = () => {
  const attachments = [
    {
      title: "ملخص الدرس",
      size: "2.5 MB",
      hasImportantBadge: true,
      hasDownloadIcon: true,
      iconSrc: summary
    },
    {
      title: "تدريبات الدرس",
      size: "2.5 MB",
      hasImportantBadge: true,
      hasDownloadIcon: true,
      iconSrc: exams
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "ملخص الدرس",
      size: "2.5 MB",
      hasImportantBadge: true,
      hasDownloadIcon: true,
      iconSrc: summary
    },
    {
      title: "تدريبات الدرس",
      size: "2.5 MB",
      hasImportantBadge: true,
      hasDownloadIcon: true,
      iconSrc: exams
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
    {
      title: "الدرس الرابع: الأفعال المساعدة",
      size: "2.5 MB",
      hasImportantBadge: false,
      hasDownloadIcon: true,
      iconSrc: filePdf
    },
  ];

  return (
    <div className="w-full mx-auto mt-10 lg:mt-0">
      {/* Divider Line */}
      <div className="w-full mb-6 border-dash-wide text-normalblue/60 lg:hidden"></div>
      {/* Section Header */}
      <div className="flex items-center justify-start gap-6 mb-6">
        <div className="bg-[#7473AA] w-[60px] h-[60px] flex items-center justify-center rounded-full">
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.81 7.30223C23.6805 7.06841 23.4907 6.87361 23.2602 6.73818C23.0298 6.60274 22.7673 6.53161 22.5 6.53223H8.286C7.80678 6.53233 7.34052 6.68784 6.95719 6.97543C6.57386 7.26302 6.29414 7.66717 6.16 8.12723L3.3465 17.7722C3.19841 18.2799 2.88965 18.7259 2.46656 19.0433C2.04347 19.3606 1.52887 19.5322 1 19.5322H18.874C19.4029 19.5322 19.9176 19.3607 20.3408 19.0433C20.764 18.726 21.0728 18.28 21.221 17.7722L23.922 8.51223C23.9847 8.31325 24.0072 8.10376 23.9881 7.89601C23.9689 7.68825 23.9081 7.48639 23.81 7.30223Z" fill="#F7F9FA"/>
            <path d="M2.385 17.4922L5.2 7.84723C5.39611 7.18045 5.80238 6.59487 6.35828 6.17772C6.91419 5.76056 7.58999 5.53416 8.285 5.53223H21V5.03223C21 4.50179 20.7893 3.99309 20.4142 3.61801C20.0391 3.24294 19.5304 3.03223 19 3.03223H11.378C11.229 3.03226 11.0818 2.99906 10.9472 2.93506C10.8126 2.87105 10.694 2.77785 10.6 2.66223L9.617 1.45373C9.38288 1.16586 9.08756 0.933788 8.75249 0.774386C8.41743 0.614984 8.05105 0.532259 7.68 0.532227H2C1.46957 0.532227 0.960859 0.74294 0.585786 1.11801C0.210714 1.49309 0 2.00179 0 2.53223L0 17.5322C0 17.7974 0.105357 18.0518 0.292893 18.2393C0.48043 18.4269 0.734784 18.5322 1 18.5322C1.31213 18.5314 1.61562 18.4296 1.86521 18.2422C2.1148 18.0548 2.29713 17.7917 2.385 17.4922Z" fill="#F7F9FA"/>
          </svg>
        </div>
        <h2 className="font-bold text-xl text-navyteal">
          الملفات والمرفقات
        </h2>
      </div>

      {/* Attachments List */}
      <div className="flex gap-4 max-h-[calc(6*62px)] lg:max-h-[calc(5*124px)] overflow-y-scroll scrollbar-custom">
        <div className="space-y-4 pl-6 w-full" dir="rtl">
          {attachments.map((attachment, index) => (
            <AttachmentItem key={index} {...attachment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsSection