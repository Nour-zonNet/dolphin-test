import React, { useCallback } from "react";
import { ChangeGroup } from "../../../utils/icons";
import ActionButton from "./ActionButton";
import { useModal } from "@/components/feedback/modal/useModal";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useLessons } from "../../lessons/hooks/useLessons";
import { usePackages } from "../../packages/hooks/usePackages";

const GroupInfo = ({ group, packageId, subscriptionId }) => {
  const { openChangeGroupModal, openStatusModal } = useModal();
  const { changeGroupSubscription, fetchGroupsByPackageId, groups } =
    useSubscriptions();
  const { fetchLessons } = useLessons();
  const { updatePackageGroup } = usePackages();

  const handleChangeGroup = useCallback(async () => {
    const packageGroups = groups?.[packageId] || [];

    if (packageGroups.length === 0) {
      await fetchGroupsByPackageId(packageId).unwrap();
    }

    openChangeGroupModal(
      { packageId, currentGroupId: group?.group_id, groups: packageGroups },
      async (selectedGroupId) => {
        const res = await changeGroupSubscription(
          subscriptionId,
          selectedGroupId
        );
        updatePackageGroup(
          packageId,
          selectedGroupId,
          res?.payload?.group_name || ""
        );
        await fetchLessons().unwrap();

        openStatusModal("SUCCESS", {
          title: "تم التحديث بنجاح",
          message:
            "تم تحديث بيانات الجدول وستظهر التغييرات عند فتح صفحة الجدول",
        });
      }
    );
  }, [
    groups,
    packageId,
    openChangeGroupModal,
    group?.group_id,
    fetchGroupsByPackageId,
    changeGroupSubscription,
    subscriptionId,
    updatePackageGroup,
    openStatusModal,
    fetchLessons,
  ]);

  return (
    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
      <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
        <span className="font-bold text-sm text-gray-700 whitespace-nowrap">
          المجموعة:
        </span>
        <span className="text-status font-bold text-sm md:text-base break-words overflow-hidden">
          {group?.group_name || "لا توجد مجموعة"}
        </span>
      </div>
      <div className="flex-shrink-0">
        <ActionButton
          primary
          icon={<ChangeGroup />}
          onClick={handleChangeGroup}
        >
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
            تغيير المجموعة
          </span>
        </ActionButton>
      </div>
    </div>
  );
};

export default React.memo(GroupInfo);
