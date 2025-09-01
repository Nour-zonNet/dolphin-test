import React, { useState } from "react";
import { EXPORT_OPTIONS } from "../constants";

const ExportButton = ({ onExport }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    if (format === "pdf") {
      setIsExporting(true);
      try {
        await onExport(format);
      } finally {
        setIsExporting(false);
      }
    } else {
      onExport(format);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="p-2  text-white rounded-md  transition-colors"
        title="Export"
        disabled={isExporting}
      >
        <span className="text-lg">
          {isExporting ? (
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
            </svg>
          ) : (
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.93625 17.1211C2.27573 17.1211 2.6013 17.2559 2.84135 17.496C3.08139 17.736 3.21625 18.0616 3.21625 18.4011V20.9611C3.21625 21.3006 3.35111 21.6261 3.59115 21.8662C3.8312 22.1062 4.15677 22.2411 4.49625 22.2411H19.8562C20.1957 22.2411 20.5213 22.1062 20.7613 21.8662C21.0014 21.6261 21.1362 21.3006 21.1362 20.9611V18.4011C21.1362 18.0616 21.2711 17.736 21.5112 17.496C21.7512 17.2559 22.0768 17.1211 22.4163 17.1211C22.7557 17.1211 23.0813 17.2559 23.3213 17.496C23.5614 17.736 23.6962 18.0616 23.6962 18.4011V20.9611C23.6962 21.9795 23.2917 22.9562 22.5715 23.6764C21.8514 24.3965 20.8747 24.8011 19.8562 24.8011H4.49625C3.47782 24.8011 2.5011 24.3965 1.78096 23.6764C1.06082 22.9562 0.65625 21.9795 0.65625 20.9611V18.4011C0.65625 18.0616 0.791107 17.736 1.03115 17.496C1.2712 17.2559 1.59677 17.1211 1.93625 17.1211Z"
                fill="#E89B32"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.87086 9.8146C5.1109 9.57463 5.43641 9.43983 5.77582 9.43983C6.11523 9.43983 6.44074 9.57463 6.68078 9.8146L12.1758 15.3096L17.6709 9.8146C17.7889 9.69234 17.9302 9.59483 18.0863 9.52775C18.2425 9.46066 18.4105 9.42535 18.5804 9.42388C18.7504 9.4224 18.9189 9.45479 19.0762 9.51915C19.2335 9.58351 19.3765 9.67855 19.4966 9.79873C19.6168 9.91892 19.7119 10.0618 19.7762 10.2191C19.8406 10.3764 19.873 10.545 19.8715 10.715C19.87 10.8849 19.8347 11.0529 19.7676 11.209C19.7005 11.3652 19.603 11.5064 19.4808 11.6245L13.0808 18.0245C12.8407 18.2645 12.5152 18.3993 12.1758 18.3993C11.8364 18.3993 11.5109 18.2645 11.2709 18.0245L4.87086 11.6245C4.6309 11.3845 4.49609 11.059 4.49609 10.7196C4.49609 10.3801 4.6309 10.0546 4.87086 9.8146Z"
                fill="#E89B32"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.1765 0.480469C12.516 0.480469 12.8415 0.615325 13.0816 0.855372C13.3216 1.09542 13.4565 1.42099 13.4565 1.76047V17.1205C13.4565 17.4599 13.3216 17.7855 13.0816 18.0256C12.8415 18.2656 12.516 18.4005 12.1765 18.4005C11.837 18.4005 11.5114 18.2656 11.2714 18.0256C11.0313 17.7855 10.8965 17.4599 10.8965 17.1205V1.76047C10.8965 1.42099 11.0313 1.09542 11.2714 0.855372C11.5114 0.615325 11.837 0.480469 12.1765 0.480469Z"
                fill="#E89B32"
              />
            </svg>
          )}
        </span>
      </button>

      {showExportMenu && (
        <div className="absolute top-full left-0 bg-white p-2 rounded-md shadow-lg z-50 mt-1 w-48">
          <div className="text-sm font-medium text-gray-800 mb-2">
            Export Options
          </div>
          {EXPORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleExport(option.value)}
              className="block w-full p-2 text-left hover:bg-gray-100 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isExporting && option.value === "pdf"}
            >
              {option.icon} {option.label}
              {isExporting && option.value === "pdf" && (
                <span className="ml-2 text-xs text-gray-500">Generating...</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
