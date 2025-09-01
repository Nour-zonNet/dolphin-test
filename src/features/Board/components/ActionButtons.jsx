import React from 'react';

const ActionButtons = ({ canUndo, canRedo, onUndo, onRedo, onClear }) => {
  return (
    <div className="flex  rounded-lg p-1 gap-1">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-2 rounded-md ${
          !canUndo
            ? " text-gray-400 cursor-not-allowed"
            : " text-white hover:bg-gray-500"
        }`}
        title="Undo"
      >
        <span className="text-lg">↩️</span>
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-2 rounded-md ${
          !canRedo
            ? " text-gray-400 cursor-not-allowed"
            : " text-white hover:bg-gray-500"
        }`}
        title="Redo"
      >
        <span className="text-lg">↪️</span>
      </button>
      <button
        onClick={onClear}
        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        title="Clear Canvas"
      >
        <span className="text-lg">🗑️</span>
      </button>
    </div>
  );
};

export default ActionButtons;
