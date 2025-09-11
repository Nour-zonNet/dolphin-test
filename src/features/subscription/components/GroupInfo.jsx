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
    <div className="flex flex-row items-center justify-between  sm:items-center gap-3 sm:gap-4">
      <p className="flex flex-row items-center gap-2">
        <span className="font-semibold text-sm md:text-[18px]">المجموعة:</span>
        <span className="text-status font-semibold text-sm max-w-25 md:max-w-auto md:text-2xl truncate text-ellipsis pl-10 ">
          {group?.group_name}
        </span>
      </p>
      <ActionButton primary icon={<ChangeGroup />} onClick={handleChangeGroup}>
        تغيير المجموعة
      </ActionButton>
    </div>
  );
};

export default React.memo(GroupInfo);
