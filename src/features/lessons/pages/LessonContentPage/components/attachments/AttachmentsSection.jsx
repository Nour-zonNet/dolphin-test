
import { useTranslation } from "react-i18next";
import { AttachmentItem } from "./AttachmentItem";
import summary from "@/assets/schedule/summary.svg";
import exams from "@/assets/schedule/exams.svg";
import filePdf from "@/assets/schedule/file.svg";
import { Attachments } from "@/utils/icons";

export const AttachmentsSection = () => {
  const attachments = [
    { title: "ملخص الدرس", size: "2.5 MB", hasImportantBadge: true, hasDownloadIcon: true, iconSrc: summary },
    { title: "تدريبات الدرس", size: "2.5 MB", hasImportantBadge: true, hasDownloadIcon: true, iconSrc: exams },
    { title: "الدرس الرابع: الأفعال المساعدة", size
      : "2.5 MB", hasImportantBadge: false, hasDownloadIcon: true, iconSrc: filePdf },
  ];

  const { t } = useTranslation();
  return (
    <div className="w-full mx-auto lg:mt-0">
      <div className="flex items-center justify-start gap-6 mb-6">
        <div className="bg-[#7473AA] md:w-[60px] md:h-[60px] w-[40px] h-[40px] flex items-center justify-center rounded-full">
          <Attachments className="w-5 md:w-6" />
        </div>
        <h2 className="font-bold text-[16px] md:text-xl text-navyteal">
          {t("lesson_content.attachments")}
        </h2>
      </div>

      <div className="flex gap-4 max-h-[calc(6*62px)] overflow-y-scroll scrollbar-custom">
        <div className="space-y-4 md:pl-6 pl-2 w-full" dir="rtl">
          {attachments.map((attachment, index) => (
            <AttachmentItem key={index} {...attachment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsSection;


