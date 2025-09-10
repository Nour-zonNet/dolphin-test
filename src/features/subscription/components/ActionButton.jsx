import React from "react";

const ActionButton = ({ children, icon, onClick, primary, outline, full, danger }) => {
  const base =
    "flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-3xl transition cursor-pointer";
  const styles = [
    primary && "bg-orangedeep hover:bg-btnClicked text-navyteal",
    outline && "border border-orangedeep text-navyteal hover:bg-orange-50",
    danger && "border border-orangedeep text-navyteal hover:bg-red-50",
    full && "w-full",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} className={`${base} ${styles} text-nowrap`}>
      {icon} {children}
    </button>
  );
};

export default React.memo(ActionButton);


