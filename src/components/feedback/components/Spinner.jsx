import React from "react";

const Spinner = ({ size = 48, colorClass = "border-orangedeep" }) => {
  const dimensionClass = size >= 48 ? "w-12 h-12" : size >= 32 ? "w-8 h-8" : "w-6 h-6";
  return (
    <div
      className={`${dimensionClass} border-4 ${colorClass} border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;


