import React from 'react';

const ToolIndicator = ({ tool }) => {
  const getToolName = (tool) => {
    switch (tool) {
      case "pen":
        return "Pen";
      case "eraser":
        return "Eraser";
      case "highlighter":
        return "Highlighter";
      case "text":
        return "Text";
      case "rectangle":
        return "Rectangle";
      case "circle":
        return "Circle";
      case "arrow":
        return "Arrow";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="p-2 bg-gray-700 text-white rounded-md text-sm">
      Current: {getToolName(tool)}
    </div>
  );
};

export default ToolIndicator;
