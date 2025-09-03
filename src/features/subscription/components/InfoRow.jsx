import React from "react";

const InfoRow = ({ label, value, strong }) => (
  <p className="flex items-center gap-2">
    <span className="font-semibold text-[#404040]">{label}</span>
    <span className={strong ? "text-xl font-semibold" : ""}>{value}</span>
  </p>
);

export default React.memo(InfoRow);


