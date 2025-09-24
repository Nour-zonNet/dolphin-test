// components/LessonHeader.jsx
import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { RightArrow } from "@/utils/icons";
import { useTranslation } from "react-i18next";
import { useContent } from "@/features/lessons/hooks/useContent";

export const LessonHeader = ({ lessonId: lessonIdProp }) => {
  const { t } = useTranslation();
  const params = useParams();

  // Resolve lessonId from prop -> URL param -> fallback 1
  const lessonId =
    Number(lessonIdProp ?? params.lessonId) > 0
      ? Number(lessonIdProp ?? params.lessonId)
      : 1;

  const { content, loading, error, getContent } = useContent(lessonId);

  useEffect(() => {
    if (lessonId) getContent(lessonId);
  }, [lessonId, getContent]);

  const packageName = useMemo(() => {
    const pkg = content?.package;
    if (Array.isArray(pkg) && pkg.length) return pkg[0]?.name || "";
    if (pkg && typeof pkg === "object") return pkg.name || "";
    return "";
  }, [content?.package]);

  return (
    <div className="w-full bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-4 lg:py-8 flex items-center relative">
      <div className="w-[95%] mx-auto flex items-center md:items-center justify-between">
        <Link
          to="/schedule"
          className="outline-0 border border-bordercolor md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center absolute"
        >
          <RightArrow className="w-[20px] md:w-[40px]" />
        </Link>

        <div className="w-full text-center">
          <h1 className="font-bold text-navyteal text-sm md:text-2xl">
            {t("lesson_content.title")}
          </h1>

          <p className="font-semibold text-[#BA7C28] text-[12px] md:text-xl mt-2">
            {loading
              ? "..."
              : packageName ||
                "—"}
          </p>

          {error ? (
            <span className="sr-only">خطأ في تحميل الباقة</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;
