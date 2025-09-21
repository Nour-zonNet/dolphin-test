import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Cancel, ChevronDown, ChevronUp, Copon, Renew } from "@/utils/icons";
import * as Icons from "@/utils/icons";
import { STATUS_CONFIG } from "@/constants/STATUS_CONFIG";
import { useSubscriptions } from "../hooks/useSubscriptions";
import useGroups from "../../groups/hooks/useGroups";
import ActionButton from "./ActionButton";
import GroupInfo from "./GroupInfo";
import { useModal } from "@/components/feedback/modal/useModal";
import { packageFactory } from "../../packages/factory/packageFactory";
import {
  formatPackageStartDate,
  getRemainingDate,
  isPackageStarted,
} from "../../../utils/dateHelpers";
import { Calender, SandGlass } from "../../../utils/icons";

const Card = React.memo(({ item, isOpen, onToggle }) => {
  const [contentHeight, setContentHeight] = useState("0px");
  const contentRef = useRef(null);
  const { openConfirmModal, openStatusModal } = useModal();
  const { cancelSubscription, reactivateSubscription } = useSubscriptions();
  useGroups(item.package_id);

  const mappedItem = useMemo(
    () => ({
      title: item.package_name,
      image: null, // Placeholder for image support
      status: item.status,
      subject: item.package_name,
      startDate: formatDate(item.start_date),
      endDate: formatDate(item.end_date),
      group: { group_name: item.group_name, group_id: item.group_id },
      daysLeft: item.days_remaining,
    }),
    [item]
  );

  const { title, status, subject, startDate, endDate, group, daysLeft } =
    mappedItem;

  const normalizeStatus = useCallback((raw) => {
    if (!raw) return "active";
    const s = String(raw).toLowerCase().trim();
    // Map possible Arabic/legacy values to internal keys
    if (s === "فعالة" || s === "active") return "active";
    if (s === "تجريبي" || s === "trial") return "trial";
    if (s === "منتهي" || s === "expired") return "expired";
    if (s === "انتظار" || s === "waiting") return "waiting";
    if (s === "ملغاة" || s === "canceled" || s === "cancelled")
      return "cancelled";
    // Default
    return "active";
  }, []);

  const statusKey = useMemo(
    () => normalizeStatus(status),
    [normalizeStatus, status]
  );

  const config = useMemo(
    () => STATUS_CONFIG[statusKey] || STATUS_CONFIG.active,
    [statusKey]
  );
  const Icon = Icons[config.icon];

  // Handle expand/collapse animation
  useEffect(() => {
    setContentHeight(
      isOpen && contentRef.current
        ? `${contentRef.current.scrollHeight}px`
        : "0px"
    );
  }, [isOpen]);

  // function formatDate(dateString) {
  //   const d = new Date(dateString);
  //   const dayName = d.toLocaleDateString("ar-EG", { weekday: "long" });
  //   const datePart = d.toLocaleDateString("ar-EG");
  //   return `${dayName} - ${datePart}`;
  // }

  // Status Badge
  // ضعها داخل نفس الملف مكان formatDate الحالية
function formatDate(dateString) {
  const d = new Date(dateString);
  const tz = "Asia/Riyadh";

  // أرقام إنجليزية لليوم والسنة
  const day   = d.toLocaleDateString("en-US", { day: "numeric",  timeZone: tz });
  const year  = d.toLocaleDateString("en-US", { year: "numeric", timeZone: tz });

  // اسم الشهر بالعربي
  let month = new Intl.DateTimeFormat("ar-EG", { month: "long", timeZone: tz }).format(d);

  // (اختياري) توحيد الهَمزة لتوافق المثال المطلوب
  // لو تحب تكتب الشهور بدون همزات (اغسطس/اكتوبر/ابريل)، فعّل السطر التالي:
  // month = month.replace("أغسطس", "اغسطس").replace("أكتوبر", "اكتوبر").replace("أبريل", "ابريل");

  return `${day} ${month} ${year}`;
}

  const StatusBadge = useMemo(
    () => (
      <div
        className={`flex items-center justify-center gap-1 rounded-3xl mt-4 md:mt-0 ${config.color}`}
      >
        <Icon className="w-4 md:w-5" />
        <span className="text-xs sm:text-sm md:text-base">
          {typeof config.label === "function"
            ? config.label(daysLeft)
            : config.label}
        </span>
      </div>
    ),
    [Icon, config, daysLeft]
  );

  // Toggle Icon
  const ToggleIcon = useMemo(
    () =>
      isOpen ? (
        <ChevronUp className="w-3 h-3 md:w-4 md:h-4 text-navyteal transition-transform" />
      ) : (
        <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-navyteal transition-transform" />
      ),
    [isOpen]
  );
  const handleCancelClick = () => {
    openConfirmModal(
      {
        title: "إلغاء الاشتراك",
        message: "هل أنت متأكد من رغبتك في إلغاء الاشتراك؟",
        confirmText: "تأكيد الإلغاء",
        type: "danger",
      },
      async () => {
        try {
          await cancelSubscription(item.id).unwrap();
          openStatusModal("SUCCESS", {
            title: "تم الإلغاء بنجاح",
            message: "تم إلغاء الاشتراك وسيتم تطبيق التغييرات فوراً.",
          });
        } catch (error) {
          const getErrorMessage = (err) => {
            if (!err) return "حدث خطأ أثناء إلغاء الاشتراك. حاول مرة أخرى.";
            if (typeof err === "string") return err;
            if (Array.isArray(err))
              return err[0] || "حدث خطأ أثناء إلغاء الاشتراك. حاول مرة أخرى.";
            if (err && typeof err === "object") {
              if (err.data && err.data.error) return err.data.error;
              if (err.message) return err.message;
            }
            return "حدث خطأ أثناء إلغاء الاشتراك. حاول مرة أخرى.";
          };
          openStatusModal("ERROR", {
            title: "فشل في الإلغاء",
            message: getErrorMessage(error),
          });
        }
      }
    );
  };
  const handleReactivateClick = () => {
    openConfirmModal(
      {
        title: "تجديد الاشتراك",
        message: "هل أنت متأكد من رغبتك في تجديد الاشتراك؟",
        confirmText: "تأكيد التجديد",
        type: "danger",
      },
      async () => {
        try {
          await reactivateSubscription(item.id).unwrap();
          openStatusModal("SUCCESS", {
            title: "تم التجديد بنجاح",
            message: "تم تجديد الاشتراك وسيتم تطبيق التغييرات فوراً.",
          });
        } catch (error) {
          const getErrorMessage = (err) => {
            if (!err) return "حدث خطأ أثناء تجديد الاشتراك. حاول مرة أخرى.";
            if (typeof err === "string") return err;
            if (Array.isArray(err))
              return err[0] || "حدث خطأ أثناء تجديد الاشتراك. حاول مرة أخرى.";
            if (err && typeof err === "object") {
              if (err.data && err.data.error) return err.data.error;
              if (err.message) return err.message;
            }
            return "حدث خطأ أثناء تجديد الاشتراك. حاول مرة أخرى.";
          };
          openStatusModal("ERROR", {
            title: "فشل في التجديد",
            message: getErrorMessage(error),
          });
        }
      }
    );
  };
  const { image, bgColor } = packageFactory(item.package_id);

  // Renew flow is currently not wired in the UI
  return (
    <div className="relative w-full mx-auto max-w-3xl h-full">
      <div className="relative w-full transition-transform duration-300 pr-0 h-full">
        <div
          style={{ borderColor: bgColor }}
          className="relative rounded-xl border bg-foundblue w-full overflow-hidden transform p-1 pb-0 pr-0 z-10 transition-all h-full"
        >
          {/* Header Desktop Layout */}
          <div
            className="flex flex-row min-h-[110px] md:min-h-0 xs:items-center gap-2 relative z-10 text-white px-3 py-4 cursor-pointer"
            onClick={onToggle}
          >
            <div className="overflow-hidden p-1">
              {image && (
                <div
                  style={{ backgroundColor: bgColor }}
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded flex items-center justify-center"
                >
                  <img src={image} alt={item.name} className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-start justify-center flex-1">
              <h2
                className={`
                  text-sm sm:text-base md:text-lg font-semibold leading-tight
                  ${
                    statusKey === "expired"
                      ? "text-[#B3261E] line-through"
                      : "text-navyteal"
                  }
                `}
              >
                {title}
              </h2>
              <div className="flex md:hidden items-center gap-2">
                {StatusBadge}
              </div>
            </div>
            <div className="flex md:hidden mt-1">{ToggleIcon}</div>

            <div className="hidden md:flex items-center gap-4">
              {StatusBadge}
              {ToggleIcon}
            </div>
          </div>

          {/* Status & Group */}
          {/* <div className="flex flex-col gap-2 px-4 relative z-10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">المجموعة:</span>
              <p className="text-navyteal font-bold text-xs xs:text-sm md:text-base flex-1 break-words">
                {group.group_name || "المجموعة الأولى"}
              </p>
            </div>
          </div> */}

          {/* Expandable Content */}
          <div
            ref={contentRef}
            style={{ height: contentHeight }}
            className="transition-all duration-300 ease-in-out overflow-hidden"
          >
            {isPackageStarted(item.package_start_date) ? (
              <div className="px-2 sm:px-4 py-4 border-t border-gray-200 space-y-4 bg-white">
                {/* Subscription Info */}
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        تاريخ الاشتراك:
                      </span>
                      <span className="font-semibold text-navyteal">
                        {startDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        تاريخ الانتهاء:
                      </span>
                      <span className="font-semibold text-navyteal">
                        {endDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-gray-700">
                    المواد:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.subjects && item.subjects.length > 0 ? (
                      item.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#E8F0F4] text-navyteal"
                        >
                          {subject.name}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#E8F0F4] text-gray-600">
                        {subject}
                      </span>
                    )}
                  </div>
                </div>

                {/* Group Info & Actions */}
                {status !== "cancelled" &&
                  status !== "expired" &&
                  status !== "waiting" && (
                    <GroupInfo
                      group={group}
                      packageId={item.package_id}
                      subscriptionId={item.id}
                    />
                  )}

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-4">
                  {config.actions.map((action) => {
                    switch (action) {
                      case "cancel":
                        return (
                          <ActionButton
                            key="cancel"
                            outline
                            full
                            danger
                            icon={<Cancel />}
                            onClick={handleCancelClick}
                          >
                            إلغاء الاشتراك
                          </ActionButton>
                        );

                      case "renew":
                      case "reactivate":
                        return (
                          <div
                            key={action}
                            className="flex flex-col items-center mt-4 gap-2"
                          >
                            {config.message && (
                              <div className="bg-[#F9F9F9] w-full text-[#B3261E] border border-[#8C8C8C] rounded-[64px] py-4 px-8 text-sm md:text-[16px] font-semibold">
                                {config.message}
                              </div>
                            )}
                            <ActionButton
                              full
                              primary
                              onClick={handleReactivateClick}
                              icon={<Renew />}
                            >
                              {config.buttonText}
                            </ActionButton>
                          </div>
                        );

                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ) : (
              <div className="px-4  py-5 ">
                <span className="text-[#ba7c28]  font-semibold">
                  الباقة لم تبداء بعد
                </span>
                <div className="flex flex-row items-center   relative z-10">
                  <Calender className="w-4 h-4" />

                  <span className="py-4 text-navyteal px-2">
                    {" "}
                    تاريخ بداية الباقة :{" "}
                    {formatPackageStartDate(item.package_start_date)}
                  </span>
                </div>
                <div className="flex flex-row items-center text-navyteal    relative z-10">
                  {" "}
                  <SandGlass className="w-3.5" fill="#08233F" />
                  <span className=" px-2">
                    {getRemainingDate(item.package_start_date)}{" "}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Card;
