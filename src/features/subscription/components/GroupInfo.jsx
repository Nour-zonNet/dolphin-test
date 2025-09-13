import React, { useEffect } from "react";
import { ChangeGroup } from "../../../utils/icons";
import ActionButton from "./ActionButton";
import { useModal } from "@/components/feedback/modal/useModal";
import useGroups from "../../groups/hooks/useGroups";
import { useSubscriptions } from "../hooks/useSubscriptions";

const GroupInfo = ({ group, packageId, subscriptionId }) => {
  const { openChangeGroupModal, openStatusModal } = useModal();
  const { groups, fetchGroups } = useGroups(packageId);
  const { changeGroupSubscription } = useSubscriptions();

  const handleChangeGroup = async () => {
    openChangeGroupModal(
      { packageId, currentGroupId: group?.group_id, groups: groups },
      async (selectedGroupId) => {
        try {
          await changeGroupSubscription(subscriptionId, selectedGroupId);
          // إظهار مودال النجاح بعد تحديث المجموعة بنجاح
          openStatusModal("SUCCESS", {
            title: "تم التحديث بنجاح",
            message:
              "تم تحديث بيانات الجدول وستظهر التغييرات عند فتح صفحة الجدول",
          });
        } catch {
          // إظهار مودال الخطأ في حالة فشل التحديث
          openStatusModal("ERROR", {
            title: "خطأ في التحديث",
            message: "حدث خطأ أثناء تحديث المجموعة. يرجى المحاولة مرة أخرى.",
          });
        }
      }
    );
  };
  useEffect(() => {
    if (!groups || groups.length === 0) {
      fetchGroups();
    }
  }, [fetchGroups, groups, packageId]);
  return (
    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
      <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
        <span className="font-bold text-sm text-gray-700 whitespace-nowrap">المجموعة:</span>
        <span className="text-status font-bold text-sm md:text-base break-words overflow-hidden">
          {group?.group_name || "لا توجد مجموعة"}
        </span>
      </div>
      <div className="flex-shrink-0">
        <ActionButton primary icon={<ChangeGroup />} onClick={handleChangeGroup}>
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap">تغيير المجموعة</span>
        </ActionButton>
      </div>
    </div>
  );
};

export default React.memo(GroupInfo);
