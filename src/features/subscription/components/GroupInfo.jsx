import React, { useCallback } from "react";
import { ChangeGroup } from "../../../utils/icons";
import ActionButton from "./ActionButton";
import { useModal } from "@/components/feedback/modal/useModal";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { fetchLessons } from "../../lessons/store/lessonsSlice";
import { useDispatch } from "react-redux";
import { updatePackageGroup } from "../../packages/store/packagesSlice";

const GroupInfo = ({ group, packageId, subscriptionId }) => {
  const { openChangeGroupModal, openStatusModal } = useModal();
  const { changeGroupSubscription, fetchGroupsByPackageId, groups } =
    useSubscriptions();
  const dispatch = useDispatch();

  // 🟢 memoize modal props

  // 🟢 memoize handler
  const handleChangeGroup = useCallback(async () => {
    const packageGroups = groups?.[packageId] || [];

    if (packageGroups.length === 0) {
      await fetchGroupsByPackageId(packageId);
    }

    openChangeGroupModal(
      { packageId, currentGroupId: group?.group_id, groups: packageGroups },
      async (selectedGroupId) => {
        try {
          const res = await changeGroupSubscription(
            subscriptionId,
            selectedGroupId
          );
          dispatch(
            updatePackageGroup({
              id: packageId,
              group_id: selectedGroupId,
              group_name: res?.payload?.group_name || "",
            })
          );
          dispatch(fetchLessons());

          openStatusModal("SUCCESS", {
            title: "تم التحديث بنجاح",
            message:
              "تم تحديث بيانات الجدول وستظهر التغييرات عند فتح صفحة الجدول",
          });
        } catch {
          openStatusModal("ERROR", {
            title: "خطأ في التحديث",
            message: "حدث خطأ أثناء تحديث المجموعة. يرجى المحاولة مرة أخرى.",
          });
        }
      }
    );
  }, [
    groups,
    packageId,
    group?.group_id,
    subscriptionId,
    changeGroupSubscription,
    fetchGroupsByPackageId,
    openChangeGroupModal,
    openStatusModal,
    dispatch,
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
