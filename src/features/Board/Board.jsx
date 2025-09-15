import { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import PageCanvas from "./PageCanvas";
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
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
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
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPages, setBackgroundPages] = useState([]);
  const [pageStates, setPageStates] = useState([]); // {lines, texts, shapes} per page
  const pageStageRefs = useRef([]);

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

  // PDF Import functionality
  const handleImportPDF = async (file) => {
    try {
      const pdfjs = await import("pdfjs-dist");
      // Configure worker source for pdf.js (vite-friendly local path)
      if (pdfjs?.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
      }
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const pages = [];
      const deviceScale = Math.max(2, (window.devicePixelRatio || 1) * 2);
      for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
        const page = await pdf.getPage(pageIndex);
        const viewport = page.getViewport({ scale: deviceScale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        pages.push({
          dataUrl: canvas.toDataURL("image/png"),
          width: viewport.width,
          height: viewport.height,
        });
      }

      if (pages.length > 0) {
        setBackgroundPages(pages);
        setBackgroundImage(pages[0].dataUrl);
        // Initialize per-page drawing state and refs
        setPageStates(pages.map(() => ({ lines: [], texts: [], shapes: [] })));
        pageStageRefs.current = pages.map(() => null);
      }
    } catch (error) {
      console.error("Error importing PDF:", error);
      alert("Failed to import PDF. Please try again.");
    }
  };

  // PDF Export functionality
  const exportToPDF = async () => {
    try {
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      // If there are imported PDF pages, export multi-page matching original
      if (backgroundPages.length > 0 && pageStageRefs.current.length === backgroundPages.length) {
        const first = backgroundPages[0];
        const pdf = new jsPDF({
          orientation: first.width > first.height ? "landscape" : "portrait",
          unit: "px",
          format: [first.width, first.height],
        });

        for (let i = 0; i < backgroundPages.length; i += 1) {
          const page = backgroundPages[i];
          const stage = pageStageRefs.current[i];
          if (!stage) continue;
          if (i > 0) {
            pdf.addPage([page.width, page.height], page.width > page.height ? "landscape" : "portrait");
          }
          const stageWidth = stage.width();
          const ratio = page.width / Math.max(1, stageWidth);
          const pixelRatio = Math.max(1, Math.min(4, ratio));
          const dataURL = stage.toDataURL({ pixelRatio, mimeType: "image/png" });
          pdf.addImage(dataURL, "PNG", 0, 0, page.width, page.height);
        }

        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-");
        pdf.save(`drawing-board-exact-${timestamp}.pdf`);
        return;
      }

      // Fallback single-page export (no imported PDF)
      if (!stageRef.current) {
        alert("Canvas is empty. Please add some content before exporting to PDF.");
        return;
      }
      const stage = stageRef.current;
      const stageWidth = stage.width();
      const stageHeight = stage.height();
      const dataURL = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
      const pdf = new jsPDF({
        orientation: stageWidth > stageHeight ? "landscape" : "portrait",
        unit: "px",
        format: [stageWidth, stageHeight],
      });
      pdf.addImage(dataURL, "PNG", 0, 0, stageWidth, stageHeight);
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      pdf.save(`drawing-board-exact-${timestamp}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF. Please try again.");
    }
  };

  // Set up initial history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory([], [], []);
    }
  }, [history.length, saveToHistory]);

  const { isDesktop } = useResponsive();

  return (
    <div
      className={`board-container flex gap-5 w-full h-full ${
        isDesktop ? "flex-row-reverse" : "flex-col"
      }`}
    >
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
        onImportPDF={handleImportPDF}
      />

      <div className={`canvas-wrapper flex-1 min-h-0 ${isDesktop ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
        {backgroundPages.length > 0
          ? backgroundPages.map((p, idx) => (
              <PageCanvas
                key={idx}
                pageIndex={idx}
                backgroundImage={p.dataUrl}
                initialWidth={p.width}
                initialHeight={p.height}
                tool={tool}
                currentColor={currentColor}
                strokeWidth={strokeWidth}
                fontSize={fontSize}
                pageState={pageStates[idx] || { lines: [], texts: [], shapes: [] }}
                onUpdatePageState={(i, next) =>
                  setPageStates((prev) => prev.map((s, k) => (k === i ? next : s)))
                }
                stageRef={(node) => {
                  if (!node) return;
                  pageStageRefs.current[idx] = node;
                }}
              />)
            )
          : (
              <Canvas
                stageRef={stageRef}
                lines={lines}
                texts={texts}
                shapes={shapes}
                backgroundImage={backgroundImage}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onTextDblClick={handleTextDblClick}
              />
            )}
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
