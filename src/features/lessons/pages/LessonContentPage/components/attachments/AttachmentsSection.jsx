// components/AttachmentsSection.jsx
import React, { useMemo, useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AttachmentItem } from "./AttachmentItem";
import summary from "@/assets/schedule/summary.svg";
import filePdf from "@/assets/schedule/file.svg";
import { Attachments } from "@/utils/icons";
import { useContent } from "@/features/lessons/hooks/useContent";
import { useNavigate } from "react-router-dom";

/* ----------------------------- helpers ----------------------------- */

const DEFAULT_TITLES = [
  "ملخص الدرس",
  "تدريبات الدرس",
  "الدرس الرابع: الأفعال المساعدة",
  "تدريبات الدرس",
];

const prettyFromFilename = (url) => {
  try {
    const u = new URL(url, window.location.origin);
    const last = u.pathname.split("/").filter(Boolean).pop() || "file.pdf";
    return last.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
  } catch {
    return "ملف PDF";
  }
};

// const openViaAnchor = (url) => {
//   if (!url) return;
//   const a = document.createElement("a");
//   a.href = url;
//   a.target = "_blank";
//   a.rel = "noopener noreferrer";
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
// };

const formatBytes = (bytes) => {
  if (typeof bytes !== "number" || !isFinite(bytes) || bytes < 0) return "—";
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  if (bytes >= GB) return `${(bytes / GB).toFixed(2)} GB`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)} MB`;
  if (bytes >= KB) return `${Math.ceil(bytes / KB)} KB`;
  return `${bytes} B`;
};

// Try HEAD first; if blocked, try Range GET to read Content-Range/Length
const fetchFileSize = async (url) => {
  try {
    const h = await fetch(url, { method: "HEAD" });
    if (h.ok) {
      const cl = h.headers.get("Content-Length");
      if (cl && !isNaN(Number(cl))) return Number(cl);
    }
  } catch {
    // Ignore HEAD request errors
  }
  try {
    // const r = await fetch(url, {
    //   method: "GET",
    //   headers: { Range: "bytes=0-0" },
    //   credentials: "include",
    // });
    const r = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
    });
    if (r.ok) {
      const cr = r.headers.get("Content-Range");
      if (cr) {
        const total = cr.split("/")[1];
        if (total && !isNaN(Number(total))) return Number(total);
      }
      const cl = r.headers.get("Content-Length");
      if (cl && !isNaN(Number(cl)) && Number(cl) > 1) return Number(cl);
    }
  } catch {
    // Ignore Range request errors
  }
  return null; // unknown
};

/* --------------------------- component ----------------------------- */

const AttachmentsSection = ({ lessonId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const openViaAnchor = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const safeLessonId = useMemo(() => {
    const n = Number(lessonId);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [lessonId]);

  const { content, loading, error, getContent } = useContent(safeLessonId);

  useEffect(() => {
    if (safeLessonId) getContent(safeLessonId);
  }, [safeLessonId, getContent]);

  const pdfs = useMemo(() => {
    const atts = content?.attachments || [];
    return atts.filter((a) => {
      const link = (a?.link || "").toString();
      const type = (a?.type || "").toString();
      const looksPdfByType = /pdf/i.test(type);
      const looksPdfByExt = /\.pdf(\?|#|$)/i.test(link);
      return !!link && (looksPdfByType || looksPdfByExt);
    });
  }, [content?.attachments]);

  // sizes state
  const [sizes, setSizes] = useState({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const updates = {};
      for (const a of pdfs) {
        const key = String(a.id ?? a.link);
        if (sizes[key] !== undefined) continue;
        const bytes = await fetchFileSize(a.link);
        if (cancelled) return;
        updates[key] = bytes ?? null;
      }
      if (Object.keys(updates).length) {
        setSizes((prev) => ({ ...prev, ...updates }));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfs]);

  // const handleOpen = useCallback((url) => openViaAnchor(url), []);

  const handleOpen = useCallback(
    (url, title) => {
      if (!url) return;

      navigate("/pdfviewer", {
        state: {
          pdfUrl: url,
          title,
          lessonId,
        },
      });
    },
    [lessonId, navigate]
  );

  const handleDownload = useCallback(async (url) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
      // const nameFromHeader = match ? decodeURIComponent(match[1]) : null;
      let nameFromHeader = null;
      try {
        nameFromHeader = match ? decodeURIComponent(match[1]) : null;
      } catch {
        // Ignore decode errors
      }
      const fallbackName = (() => {
        try {
          const u = new URL(url, window.location.origin);
          return u.pathname.split("/").filter(Boolean).pop() || "file.pdf";
        } catch {
          return "file.pdf";
        }
      })();
      const filename = nameFromHeader || fallbackName;

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

  const scrollable = pdfs.length > 3; // only scroll if more than 3 items

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

      {loading && (
        <div className="space-y-3">
          <div className="h-24 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      )}

      {!loading && error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700">
          تعذر تحميل المرفقات: {String(error)}
        </div>
      )}

      {!loading && !error && pdfs.length === 0 && (
        <div className="p-4 rounded-lg bg-gray-50 text-gray-600">
          لا توجد ملفات لهذا الدرس.
        </div>
      )}

      {!loading && !error && pdfs.length > 0 && (
        <div
          className={`flex gap-4 ${
            scrollable
              ? "max-h-[calc(6*60px)] overflow-y-auto scrollbar-custom"
              : ""
          }`}
        >
          <div className="space-y-4 md:pl-6 pl-2 w-full" dir="rtl">
            {pdfs.map((a, i) => {
              const displayTitle = (() => {
                const raw = (a.name || a.title || "").trim();
                if (raw)
                  return raw.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
                return (
                  DEFAULT_TITLES[i] || prettyFromFilename(a.link) || "ملف PDF"
                );
              })();

              const key = String(a.id ?? a.link);
              const bytes = sizes[key];
              const sizeStr =
                typeof bytes === "number" && isFinite(bytes) && bytes >= 0
                  ? formatBytes(bytes)
                  : "2.5 MB";

              return (
                <AttachmentItem
                  key={`pdf-${key}`}
                  title={displayTitle} // ← used by component
                  name={displayTitle} // ← safety for any old prop usage
                  size={sizeStr}
                  important={Boolean(a.important)}
                  hasDownloadIcon
                  iconSrc={filePdf || summary}
                  href={a.link}
                  isCardClickable={!!a.link}
                  onOpen={() => handleOpen(a.link, displayTitle)}
                  onDownload={() => handleDownload(a.link)}
                >
                  {displayTitle} {/* ← if component renders children */}
                </AttachmentItem>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsSection;
