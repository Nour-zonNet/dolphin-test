import React from "react";

const InfoRow = ({ label, value, strong }) => (
  <p className="text-sm sm:text-base">
    <span className="font-semibold text-nowrap text-[#404040] mr-2">{label}</span>
    <span className={strong ? "text-base sm:text-lg md:text-xl font-semibold" : ""}>{value}</span>
  </p>
);

export default React.memo(InfoRow);


