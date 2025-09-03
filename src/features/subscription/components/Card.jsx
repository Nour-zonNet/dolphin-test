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

const Card = React.memo(({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState("0px");
  const contentRef = useRef(null);

  const { cancelSubscription, renewSubscription } = useSubscriptions();
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

  const config = useMemo(
    () => STATUS_CONFIG[status] || STATUS_CONFIG["فعالة"],
    [status]
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
    return new Date(dateString).toLocaleDateString("ar-EG");
  }

  // Status Badge
  const StatusBadge = useMemo(
    () => (
      <span
        className={`text-sm px-3 py-1 rounded-full flex items-center gap-2 ${config.color}`}
      >
        {config.icon && <config.icon />}
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

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl border border-gray-300 lg:mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="flex md:items-center justify-between p-4 cursor-pointer select-none"
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-4">
          {image && (
            <img
              src={image}
              alt={title}
              className={`${config.bg} rounded h-[50px] w-[50px]`}
            />
          )}
          <h3 className="font-semibold md:text-xl text-sm text-navyteal">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {StatusBadge}
          {ToggleIcon}
        </div>
      </div>

      {/* Expandable Content */}
      <div
        ref={contentRef}
        style={{ height: contentHeight }}
        className="transition-all duration-500 ease-in-out overflow-hidden"
      >
        <div className="p-4 border-t border-gray-300 space-y-4 text-right">
          {/* Subscription Info */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <Line className={config.lineColor} fill={config.fill} />
              <div className="flex flex-col gap-2">
                <InfoRow label="تاريخ الاشتراك:" value={startDate} />
                <InfoRow label="تاريخ الانتهاء:" value={endDate} />
              </div>
            </div>
            <InfoRow label="المواد:" value={subject} strong />
          </div>

          {/* Group Info & Actions */}
          <GroupInfo
            group={group}
            packageId={item.package_id}
            subscriptionId={item.id}
          />

          {/* Coupon */}
          {config.actions.includes("useCoupon") && (
            <ActionButton outline icon={<Copon />}>
              استخدام كوبون لإضافة أيام
            </ActionButton>
          )}

          {/* Cancel */}
          {config.actions.includes("cancel") && (
            <ActionButton
              outline
              full
              danger
              icon={<Cancel />}
              onClick={() => cancelSubscription(item.id)}
            >
              إلغاء الاشتراك
            </ActionButton>
          )}

          {/* Renew / Reactivate */}
          {(config.actions.includes("renew") ||
            config.actions.includes("canceled") ||
            config.actions.includes("reactivate")) && (
            <div className="flex flex-col items-center mt-6">
              <ActionButton
                full
                primary
                icon={<Renew />}
                onClick={() => renewSubscription(item.id)}
              >
                {config.buttonText}
              </ActionButton>
              {config.message && (
                <div className="bg-[#F9F9F9] w-full mt-6 mb-4 text-[#B3261E] border border-[#8C8C8C] rounded-[64px] py-4 px-8 text-sm md:text-[16px] font-semibold">
                  {config.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Card;
