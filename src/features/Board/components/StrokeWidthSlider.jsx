import React, { useState } from 'react';

const StrokeWidthSlider = ({ strokeWidth, setStrokeWidth, compact = false }) => {
  const [showWidthSlider, setShowWidthSlider] = useState(false);

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Stroke Width</span>
          <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">{strokeWidth}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1px</span>
          <span>20px</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWidthSlider(!showWidthSlider)}
        className="flex items-center p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        <div
          className="h-1 mr-2 rounded-full bg-white"
          style={{ width: `${strokeWidth * 3}px` }}
        ></div>
        Size
      </button>

      {showWidthSlider && (
        <div className="absolute top-full left-0 bg-white p-3 rounded-md shadow-lg z-50 mt-1 w-48">
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-600 mt-1 text-center">
            {strokeWidth}px
          </div>
        </div>
      )}
    </div>
  );
};

export default StrokeWidthSlider;
