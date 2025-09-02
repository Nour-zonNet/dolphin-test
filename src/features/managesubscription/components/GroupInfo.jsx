import React from "react";
import { ChangeGroup } from "../../../utils/icons";
import ActionButton from "./ActionButton";

const GroupInfo = ({ group }) => (
  <div className="flex justify-between items-center gap-4">
    <p className="flex flex-row items-center gap-2">
      <span className="font-semibold md:text-[18px] text-sm">المجموعة:</span>
      <span className="text-status font-semibold md:text-2xl text-[16px]">{group}</span>
    </p>
    <ActionButton primary icon={<ChangeGroup />} onClick={onChange}>
      تغيير المجموعة
    </ActionButton>
  </div>
);

export default React.memo(GroupInfo);


