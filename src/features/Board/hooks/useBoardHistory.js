import { useState, useCallback } from 'react';

export const useBoardHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newLines, newTexts, newShapes, newPageStates = null) => {
    
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      const newState = { 
        lines: newLines, 
        texts: newTexts, 
        shapes: newShapes,
        pageStates: newPageStates 
      };
      newHistory.push(newState);
      return newHistory;
    });
    setHistoryIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      return newIndex;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const resetHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

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
    resetHistory,
  };
};

