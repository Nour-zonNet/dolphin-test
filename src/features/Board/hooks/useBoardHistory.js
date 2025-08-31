import { useState, useCallback } from 'react';

export const useBoardHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newLines, newTexts, newShapes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ lines: newLines, texts: newTexts, shapes: newShapes });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      return history[historyIndex - 1];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      return history[historyIndex + 1];
    }
    return null;
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    history,
    historyIndex,
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistoryIndex,
  };
};
