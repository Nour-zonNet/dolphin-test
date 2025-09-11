import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Cancel,
  ChevronDown,
  ChevronUp,
  Copon,
  Renew,
} from "../../../utils/icons";
import { Line } from "../../../utils/Illustrations";
import { STATUS_CONFIG } from "../../../constants/STATUS_CONFIG";
import { useSubscriptions } from "../hooks/useSubscriptions";
import useGroups from "../../groups/hooks/useGroups";
import ActionButton from "./ActionButton";
import GroupInfo from "./GroupInfo";
import InfoRow from "./InfoRow";
import { useModal } from "@/components/feedback/modal/useModal";

const Card = React.memo(({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState("0px");
  const contentRef = useRef(null);
  const { openConfirmModal, openStatusModal } = useModal();
  const { cancelSubscription } = useSubscriptions();
  useGroups(item.package_id);
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

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

  const { title, image, status, subject, startDate, endDate, group, daysLeft } =
    mappedItem;

  const normalizeStatus = useCallback((raw) => {
    if (!raw) return "active";
    const s = String(raw).toLowerCase().trim();
    // Map possible Arabic/legacy values to internal keys
    if (s === "فعالة" || s === "active") return "active";
    if (s === "تجريبي" || s === "trial") return "trial";
    if (s === "منتهي" || s === "expired") return "expired";
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

  // Handle expand/collapse animation
  useEffect(() => {
    setContentHeight(
      isOpen && contentRef.current
        ? `${contentRef.current.scrollHeight}px`
        : "0px"
    );
  }, [isOpen]);

  function formatDate(dateString) {
    const d = new Date(dateString);
    const dayName = d.toLocaleDateString("ar-EG", { weekday: "long" });
    const datePart = d.toLocaleDateString("ar-EG");
    return `${dayName} - ${datePart}`;
  }

  // Status Badge
  const StatusBadge = useMemo(
    () => (
      <span
        className={`text-sm px-3 py-1 rounded-full flex items-center gap-2 ${config.color}`}
      >
        {config.icon && <config.icon className="w-4 md:w-6" />}
        {config.label(daysLeft)}
      </span>
    ),
    [config, daysLeft]
  );

  // Toggle Icon
  const ToggleIcon = useMemo(
    () =>
      isOpen ? (
        <ChevronUp className="w-3 h-3 text-gray-600 transition-transform" />
      ) : (
        <ChevronDown className="w-3 h-3 text-gray-600 transition-transform" />
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

  // Renew flow is currently not wired in the UI
  return (
    <div className="w-full flex flex-col bg-white rounded-2xl border border-gray-300 lg:mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="flex flex-col  sm:flex-row gap-3 sm:gap-0 md:items-center justify-between p-3 sm:p-4 cursor-pointer select-none"
        onClick={toggleOpen}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {image && (
            <img
              src={image}
              alt={title}
              className={`${config.bg} rounded h-[50px] w-[50px]`}
            />
          )}
          <h3 className="font-semibold text-base sm:text-lg md:text-xl text-navyteal">
            {title}
          </h3>
          {ToggleIcon}
        </div>

        <div className="flex items-center justify-center gap-4">
          {StatusBadge}
        </div>
      </div>

      {/* Expandable Content */}
      <div
        ref={contentRef}
        style={{ height: contentHeight }}
        className="transition-all duration-500 ease-in-out overflow-hidden"
      >
        <div className="p-3 sm:p-4 border-t border-gray-300 space-y-4 ">
          {/* Subscription Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-3 md:gap-4">
            <div className="flex">
              <Line className="h-12" fill={config.fill} />
              <div className="flex flex-col gap-2">
                <InfoRow label="تاريخ الاشتراك: " value={startDate} />
                <InfoRow label="تاريخ الانتهاء: " value={endDate} />
              </div>
            </div>
            <InfoRow label="المواد:" value={subject} strong />
          </div>

          {/* Group Info & Actions */}
          {/* {config.actions.includes("changeGroup") && ( */}
          {status != "cancelled" && (
            <GroupInfo
              group={group}
              packageId={item.package_id}
              subscriptionId={item.id}
            />
          )}
          {/* )} */}
          {/* Coupon */}
          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            {config.actions.map((action) => {
              switch (action) {
                case "useCoupon":
                  return (
                    <ActionButton key="coupon" outline icon={<Copon />}>
                      استخدام كوبون لإضافة أيام
                    </ActionButton>
                  );

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
                      <ActionButton
                        full
                        primary
                        icon={<Renew />}
                        // onClick={handleRenewClick}
                      >
                        {config.buttonText}
                      </ActionButton>
                      {config.message && (
                        <div className="bg-[#F9F9F9] w-full text-[#B3261E] border border-[#8C8C8C] rounded-[64px] py-4 px-8 text-sm md:text-[16px] font-semibold">
                          {config.message}
                        </div>
                      )}
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Card;
