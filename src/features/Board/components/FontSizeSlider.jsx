import React from 'react';

const FontSizeSlider = ({ fontSize, setFontSize }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <span className="text-sm font-medium text-gray-700 min-w-[4rem]">Font Size</span>
      <input
        type="range"
        min="10"
        max="40"
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded min-w-[3.5rem] text-center">
        {fontSize}px
      </span>
    </div>
  );
};

export default FontSizeSlider;
