import React from "react";
import { Link } from "react-router-dom";
import { RightArrow } from "@/utils/icons";
import { useTranslation } from "react-i18next";

export const LessonHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-8 flex items-center relative">
      <div className="w-[90%] mx-auto flex items-center md:items-center justify-between">
        <Link
          to="/schedule"
          className="outline-0 border border-bordercolor md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center"
        >
          <RightArrow className="w-[20px] md:w-[40px]" />
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-bold text-navyteal text-sm md:text-2xl">{t("lesson_content.title")}</h1>
          <p className="font-semibold text-[#BA7C28] text-[12px] md:text-xl mt-2">
            تأسيس اللغة الإنجليزية (المستوي الأول)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;


