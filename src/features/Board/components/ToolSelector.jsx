import React, { useState, useEffect, useRef } from "react";
import { TOOLS } from "../constants";
import ColorPicker from "./ColorPicker";
import StrokeWidthSlider from "./StrokeWidthSlider";
import ExportButton from "./ExportButton";

const ToolSelector = ({
  tool,
  setTool,
  currentColor,
  setCurrentColor,
  strokeWidth,
  setStrokeWidth,
  fontSize,
  setFontSize,
  onExport,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown]);

  const handleToolClick = (toolName) => {
    if (toolName === "text") {
      if (openDropdown === toolName) {
        setOpenDropdown(null);
      } else {
        setOpenDropdown(toolName);
        setTool(toolName);
      }
    } else {
      if (openDropdown === toolName) {
        setOpenDropdown(null);
      } else {
        // Check if dropdown would go off-screen
        const button = event?.target?.closest("button");
        if (button) {
          const rect = button.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          setDropdownPosition(
            spaceBelow < 300 && spaceAbove > 300 ? "top" : "bottom"
          );
        }

        setOpenDropdown(toolName);
        setTool(toolName);
      }
    }
  };

  const isDrawingTool = (toolName) =>
    ["pen", "highlighter", "eraser"].includes(toolName);

  const isTextTool = (toolName) => toolName === "text";

  return (
    <div className="flex md:flex-col justify-between items-center w-full  gap-1 bg-white rounded-full border border-dashed py-4 px-4 space-x-4 md:space-x-0 md:space-y-4 ">
      {TOOLS.map((item) => (
        <div key={item.tool} className="relative">
          <button
            data-tool={item.tool}
            onClick={() => handleToolClick(item.tool)}
            className={`p-2 transition-all  ${
              tool === item.tool
                ? "bg-orangedeep/20 rounded-full text-white"
                : "text-gray-200 hover:cursor-pointer"
            }`}
            title={item.title}
          >
            <span className="text-lg">{item.icon}</span>
          </button>

          {/* Dropdown for drawing tools */}
          {isDrawingTool(item.tool) && openDropdown === item.tool && (
            <div
              ref={(el) => (dropdownRefs.current[item.tool] = el)}
              className={`absolute ${
                dropdownPosition === "top"
                  ? "bottom-full mb-2"
                  : "top-full mt-2"
              } left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl z-50 border border-gray-200 min-w-72`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {item.title} Settings
                  </span>
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Only show ColorPicker for pen and highlighter, not for eraser */}
                  {(item.tool === "pen" || item.tool === "highlighter") && (
                    <ColorPicker
                      currentColor={currentColor}
                      setCurrentColor={setCurrentColor}
                      compact={true}
                    />
                  )}

                  <StrokeWidthSlider
                    strokeWidth={strokeWidth}
                    setStrokeWidth={setStrokeWidth}
                    compact={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dropdown for text tool */}
          {isTextTool(item.tool) && openDropdown === item.tool && (
            <div
              ref={(el) => (dropdownRefs.current[item.tool] = el)}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-4 rounded-lg shadow-xl z-50 border border-gray-200 min-w-64"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Text Settings
                  </span>
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <ColorPicker
                    currentColor={currentColor}
                    setCurrentColor={setCurrentColor}
                    compact={true}
                  />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Font Size</span>
                      <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded">
                        {fontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>10px</span>
                      <span>40px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <ExportButton onExport={onExport} />
    </div>
  );
};

export default ToolSelector;
