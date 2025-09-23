import React from "react";

const FormField = ({ label, children, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block font-semibold text-navyteal text-sm sm:text-base md:text-lg [font-family:'Cairo',Helvetica]">
        {label}
      </label>
      {children}
    </div>
  );
};

export default FormField;
