import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import TextInputOverlay from "./TextInputOverlay";
import { useBoardHistory, useCanvasDrawing } from "./hooks";

// Note: jsPDF will be imported dynamically to avoid SSR issues

// Custom hook for responsive behavior
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

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
  const exportImage = async (format) => {
    if (format === "pdf") {
      await exportToPDF();
      return;
    }
    
    const uri = stageRef.current.toDataURL({
      pixelRatio: format === "high" ? 3 : format === "medium" ? 2 : 1,
    });
    const link = document.createElement("a");
    link.download = `drawing-board.${format === "svg" ? "svg" : "png"}`;
    link.href = uri;
    link.click();
  };

  // PDF Export functionality
  const exportToPDF = async () => {
    try {
      // Check if canvas has content
      if (!stageRef.current || (!lines.length && !texts.length && !shapes.length)) {
        alert('Canvas is empty. Please add some content before exporting to PDF.');
        return;
      }

      // Get the current stage dimensions exactly as shown
      const stage = stageRef.current;
      const stageWidth = stage.width();
      const stageHeight = stage.height();

      // Convert the canvas to an image with exact dimensions (no scaling)
      const dataURL = stage.toDataURL({
        pixelRatio: 1, // Use exact pixel ratio to avoid scaling
        mimeType: 'image/png',
        quality: 1.0, // Maximum quality
        width: stageWidth,
        height: stageHeight
      });

      // Create a temporary canvas to get dimensions
      const img = new Image();
      img.src = dataURL;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        // Add timeout to prevent hanging
        setTimeout(() => reject(new Error('Image loading timeout')), 10000);
      });

      // Try to import jsPDF with error handling
      let jsPDF;
      try {
        // Try different import patterns for better compatibility
        let module;
        try {
          module = await import('jspdf');
        } catch {
          // Fallback: try importing with explicit path
          module = await import('jspdf/dist/jspdf.es.min.js');
        }
        
        jsPDF = module.default || module.jsPDF;
        
        // Verify jsPDF is properly loaded
        if (typeof jsPDF !== 'function') {
          throw new Error('jsPDF not properly loaded');
        }
      } catch (importError) {
        console.error('Failed to import jsPDF:', importError);
        alert('PDF library failed to load. Please refresh the page and try again.');
        return;
      }
      
      // Create PDF with exact dimensions - no orientation change
      const pdf = new jsPDF({
        orientation: 'portrait', // Always portrait to maintain exact dimensions
        unit: 'px', // Use pixels to maintain exact dimensions
        format: [stageWidth, stageHeight] // Custom format matching canvas dimensions
      });

      // Add the image at exact position (0,0) with exact dimensions
      // No scaling, no centering - exactly as shown on screen
      pdf.addImage(dataURL, 'PNG', 0, 0, stageWidth, stageHeight);
      
      // Add metadata to the PDF
      pdf.setProperties({
        title: 'Drawing Board Export - Exact View',
        subject: 'Canvas Drawing - No Scaling',
        author: 'LearnAtDolphin',
        creator: 'Drawing Board App'
      });
      
      // Save the PDF with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      pdf.save(`drawing-board-exact-${timestamp}.pdf`);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      if (error.message.includes('timeout')) {
        alert('PDF generation timed out. Please try again.');
      } else if (error.message.includes('import')) {
        alert('PDF library failed to load. Please refresh the page and try again.');
      } else {
        alert('Failed to export to PDF. Please try again.');
      }
    }
  };

  // Set up initial history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory([], [], []);
    }
  }, [history.length, saveToHistory]);

  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div className={`board-container flex gap-5 w-full h-full ${
      isDesktop ? 'flex-row-reverse' : 'flex-col'
    }`}>
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
      
      <div className={`canvas-wrapper flex-1 min-h-0 ${
        isMobile ? 'w-full' : isTablet ? 'w-full' : 'w-auto'
      }`}>
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
      </div>

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
