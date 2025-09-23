import React from "react";
import spinner from "@/assets/images/spinner.svg";
import spinnerLoading from "@/assets/images/spinner-loading.svg";
import dolphinFace from "@/assets/images/dolphin-face.svg";

const Spinner = ({
  size = 100,
  speed = 800,
  label = "Loading…",
}) => {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className="relative inline-block shrink-0"
      style={{ width: px, height: px }}
      role="status"
      aria-label={label}
    >
      {/* Rotating arc */}
      <img
        src={spinner}
        alt=""
        style={{
          width: px,
          height: px,
          animation: `spin linear infinite`,
          animationDuration: `${speed}ms`,
          transformOrigin: "50% 50%",
        }}
        className="absolute inset-0 z-[2] block pointer-events-none"
        draggable={false}
      />

      {/* Rotating overlay */}
      <img
        src={spinnerLoading}
        alt=""
        style={{
          width: px,
          height: px,
          animation: `spin linear infinite`,
          animationDuration: `${speed * 1.2}ms`,
          transformOrigin: "50% 50%",
        }}
        className="absolute inset-0 z-[3] block pointer-events-none"
        draggable={false}
      />

      {/* Center dolphin */}
      <div className="absolute inset-0 flex items-center justify-center z-[6]">
        <img
          src={dolphinFace}
          alt=""
          style={{
            width: `calc(${px} * 0.75)`, 
            height: `calc(${px} * 0.75)`,
          }}
          draggable={false}
        />
      </div>

      <span className="sr-only">{label}</span>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
          .spinner-wrapper {
          width: ${size}px;
          height: ${size}px;
        }
        @media (max-width: 800px) { /* tablet */
          .spinner-wrapper {
            width: ${size * 0.8}px;
            height: ${size * 0.8}px;
          }
        }
        @media (max-width: 480px) { /* mobile */
          .spinner-wrapper {
            width: ${size * 0.6}px;
            height: ${size * 0.6}px;
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
