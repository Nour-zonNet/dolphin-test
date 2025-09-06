import React, { useEffect, useRef } from "react";

const ModalContainer = ({ children, onClose, labelledBy, describedBy }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={handleBackdropClick}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default ModalContainer;
