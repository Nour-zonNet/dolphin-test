import React from "react";

const Overlay = ({ children, ariaLabel, onClick }) => (
  <div
    className="fixed inset-0 z-500 flex items-center justify-center bg-white/70"
    role="alert"
    aria-live="assertive"
    aria-label={ariaLabel}
    onClick={onClick}
  >
    {children}
  </div>
);

export default Overlay;


