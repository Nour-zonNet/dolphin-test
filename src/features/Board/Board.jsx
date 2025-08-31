import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import TextInputOverlay from "./TextInputOverlay";
import { useBoardHistory, useCanvasDrawing } from "./hooks";

const Board = () => {
  // State management
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [currentColor, setCurrentColor] = useState("#3B82F6");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [fontSize, setFontSize] = useState(20);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);

  // Refs
  const stageRef = useRef();

  // Custom hooks
  const {
    history,
    historyIndex,
    saveToHistory,
    undo: undoHistory,
    redo: redoHistory,
    canUndo,
    canRedo,
    setHistoryIndex,
  } = useBoardHistory();

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasDrawing(
    tool,
    currentColor,
    strokeWidth,
    lines,
    shapes,
    setLines,
    setShapes,
    saveToHistory
  );

  // Event handlers
  const handleCanvasMouseDown = (e) => {
    const result = handleMouseDown(e);
    if (result?.type === "text") {
      setTextPosition(result.position);
      setShowTextInput(true);
    }
  };

  const handleCanvasMouseMove = handleMouseMove;
  const handleCanvasMouseUp = handleMouseUp;

  // Text handling
  const addText = () => {
    if (textInput.trim() !== "") {
      const newTexts = [
        ...texts,
        {
          x: textPosition.x,
          y: textPosition.y,
          text: textInput,
          fontSize,
          fill: currentColor,
        },
      ];
      setTexts(newTexts);
      saveToHistory(lines, newTexts, shapes);
    }
    setTextInput("");
    setShowTextInput(false);
  };

  const handleTextDblClick = (idx) => {
    const newText = prompt("Edit text:", texts[idx].text);
    if (newText !== null) {
      const updated = texts.map((t, i) =>
        i === idx ? { ...t, text: newText } : t
      );
      setTexts(updated);
      saveToHistory(lines, updated, shapes);
    }
  };

  // History actions
  const undo = () => {
    const prevState = undoHistory();
    if (prevState) {
      setLines(prevState.lines);
      setTexts(prevState.texts);
      setShapes(prevState.shapes);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    const nextState = redoHistory();
    if (nextState) {
      setLines(nextState.lines);
      setTexts(nextState.texts);
      setShapes(nextState.shapes);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Canvas actions
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setLines([]);
      setTexts([]);
      setShapes([]);
      saveToHistory([], [], []);
    }
  };

  // Export functionality
  const exportImage = (format) => {
    const uri = stageRef.current.toDataURL({
      pixelRatio: format === "high" ? 3 : format === "medium" ? 2 : 1,
    });
    const link = document.createElement("a");
    link.download = `drawing-board.${format === "svg" ? "svg" : "png"}`;
    link.href = uri;
    link.click();
  };

  // Set up initial history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory([], [], []);
    }
  }, [history.length, saveToHistory]);

  return (
    <div className="flex flex-col h-screen ">
      <Toolbar
        tool={tool}
        setTool={(tool) => {
          setShowTextInput(false);
          setTool(tool);
        }}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        fontSize={fontSize}
        setFontSize={setFontSize}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onClear={clearCanvas}
        onExport={exportImage}
      />
        <Canvas
          stageRef={stageRef}
          lines={lines}
          texts={texts}
          shapes={shapes}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onTextDblClick={handleTextDblClick}
        />

        <TextInputOverlay
          showTextInput={showTextInput}
          textInput={textInput}
          setTextInput={setTextInput}
          textPosition={textPosition}
          onAddText={addText}
          onClose={() => setShowTextInput(false)}
        />
      </div>
  );
};

export default Board;
