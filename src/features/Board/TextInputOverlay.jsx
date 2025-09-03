import React from 'react';

const TextInputOverlay = ({
  showTextInput,
  textInput,
  setTextInput,
  textPosition,
  onAddText,
  onClose,
}) => {
  if (!showTextInput) return null;

  return (
    <div
      className="absolute bg-white p-3 rounded-md shadow-lg z-50 border border-gray-300"
      style={{ top: textPosition.y, left: textPosition.x }}
    >
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter text here"
        className="p-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onAddText();
          if (e.key === "Escape") onClose();
        }}
      />
      <button
        onClick={onAddText}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Add
      </button>
    </div>
  );
};

export default TextInputOverlay;
