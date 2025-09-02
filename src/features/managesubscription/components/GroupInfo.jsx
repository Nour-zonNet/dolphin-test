import React from "react";
import { ChangeGroup } from "../../../utils/icons";
import ActionButton from "./ActionButton";
import { useModal } from "@/components/feedback/modal/useModal";
import useGroups from "../../groups/hooks/useGroups";
import { useSubscriptions } from "../hooks/useSubscriptions";

const GroupInfo = ({ group, packageId, subscriptionId }) => {
  const { openChangeGroupModal } = useModal();
  const { groups, fetchGroups } = useGroups(packageId);
  const { changeGroupSubscription } = useSubscriptions();

  const handleChangeGroup = async () => {
    try {
      if (!groups || groups.length === 0) {
        await fetchGroups();
      }
      openChangeGroupModal(
        { packageId, currentGroupId: group?.group_id, groups },
        (selectedGroupId) => changeGroupSubscription(subscriptionId, selectedGroupId)
      );
    } catch (err) {
      console.error("Failed to open change group modal:", err);
    }
  };

  return (
    <div className="flex justify-between items-center gap-4">
      <p className="flex flex-row items-center gap-2">
        <span className="font-semibold md:text-[18px] text-sm">المجموعة:</span>
        <span className="text-status font-semibold md:text-2xl text-[16px]">{group?.group_name}</span>
      </p>
      <ActionButton primary icon={<ChangeGroup />} onClick={handleChangeGroup}>
        تغيير المجموعة
      </ActionButton>
    </div>
  );
};

export default React.memo(GroupInfo);
