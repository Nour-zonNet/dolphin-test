import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = ({
  setTool, onUndo, onRedo, onClear, canUndo, canRedo,
  onExport, setShowTextInput, setFontSize,
  onToggleHelp, setShowPerformanceMonitor
}) => {
  const handleKeyDown = useCallback((e) => {
    const shortcuts = {
      'p': () => setTool('pen'),
      'h': () => setTool('highlighter'),
      'e': () => setTool('eraser'),
      't': () => setTool('text'),
      'r': () => setTool('rectangle'),
      'c': () => setTool('circle'),
      'a': () => setTool('arrow'),
      'z': () => canUndo && onUndo(),
      'y': () => canRedo && onRedo(),
      'ctrl+z': () => canUndo && onUndo(),
      'ctrl+y': () => canRedo && onRedo(),
      'ctrl+s': (e) => { e.preventDefault(); onExport('png'); },
      'ctrl+shift+s': (e) => { e.preventDefault(); onExport('pdf'); },
      'ctrl+o': (e) => { e.preventDefault(); document.getElementById('pdf-input')?.click(); },
      'ctrl+n': (e) => { e.preventDefault(); onClear(); },
      'escape': () => setShowTextInput(false),
      '=': () => setFontSize(prev => Math.min(prev + 2, 48)),
      '-': () => setFontSize(prev => Math.max(prev - 2, 8)),
      'delete': () => onClear(),
      '?': () => onToggleHelp && onToggleHelp(),
      'f12': () => setShowPerformanceMonitor(prev => !prev),
    };

    const key = e.key.toLowerCase();
    const modifier = e.ctrlKey ? 'ctrl+' : e.shiftKey ? 'shift+' : '';
    const combo = `${modifier}${key}`;
    
    if (shortcuts[combo]) {
      shortcuts[combo](e);
    } else if (shortcuts[key] && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      shortcuts[key](e);
    }
  }, [setTool, onUndo, onRedo, onClear, canUndo, canRedo, onExport, setShowTextInput, setFontSize, onToggleHelp, setShowPerformanceMonitor]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
