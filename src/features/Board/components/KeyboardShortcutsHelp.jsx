import React, { useState, useEffect } from 'react';

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const shortcuts = [
    { key: 'P', description: 'Pen tool' },
    { key: 'H', description: 'Highlighter tool' },
    { key: 'E', description: 'Eraser tool' },
    { key: 'T', description: 'Text tool' },
    { key: 'R', description: 'Rectangle tool' },
    { key: 'C', description: 'Circle tool' },
    { key: 'A', description: 'Arrow tool' },
    { key: 'Z', description: 'Undo' },
    { key: 'Y', description: 'Redo' },
    { key: 'Ctrl + Z', description: 'Undo' },
    { key: 'Ctrl + Y', description: 'Redo' },
    { key: 'Ctrl + S', description: 'Export as PNG' },
    { key: 'Ctrl + Shift + S', description: 'Export as PDF' },
    { key: 'Ctrl + O', description: 'Open PDF file' },
    { key: 'Ctrl + N', description: 'Clear canvas' },
    { key: 'Escape', description: 'Close text input' },
    { key: '+', description: 'Increase font size' },
    { key: '-', description: 'Decrease font size' },
    { key: 'Delete', description: 'Clear canvas' },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="shortcuts-title" className="text-xl font-semibold text-gray-900">
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close shortcuts help"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-600">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Press <kbd className="px-1 py-0.5 bg-gray-100 text-gray-800 text-xs rounded font-mono">?</kbd> to toggle this help
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
