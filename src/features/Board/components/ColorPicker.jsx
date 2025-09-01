import React, { useState } from 'react';
import { COLORS } from '../constants';

const ColorPicker = ({ currentColor, setCurrentColor, compact = false }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: currentColor }}
          ></div>
          <span className="text-sm font-medium text-gray-700">Color</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 transition-all ${
                currentColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="flex items-center p-2 text-deepnavy rounded-md transition-colors"
      >
        <div
          className="w-5 h-5 rounded-full mr-2 border border-gray-400"
          style={{ backgroundColor: currentColor }}
        ></div>
        Color
      </button>

      {showColorPicker && (
        <div className="absolute top-full left-0 bg-white p-2 rounded-md shadow-lg z-50 grid grid-cols-6 gap-2 mt-1 w-64">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                setCurrentColor(color);
                setShowColorPicker(false);
              }}
              className="w-7 h-7 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
