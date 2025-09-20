import { useRef, useState, useEffect, startTransition } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import PageCanvas from "./PageCanvas";
import TextInputOverlay from "./TextInputOverlay";
import { useBoardHistory, useCanvasDrawing } from "./hooks";
import { ActionButtons } from "./components";

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
  const canvasContainerRef = useRef();

  // Custom hooks
  const {
    history,
    saveToHistory,
    undo: undoHistory,
    redo: redoHistory,
    canUndo,
    canRedo,
    resetHistory,
  } = useBoardHistory();

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasDrawing(
    tool,
    currentColor,
    strokeWidth,
    lines,
    shapes,
    setLines,
    setShapes,
    (newLines, newTexts, newShapes) => {
      saveToHistory(newLines, newTexts, newShapes);
    }
  );

  // Event handlers
  const handleCanvasMouseDown = (e) => {
    const result = handleMouseDown(e);
    if (result?.type === "text") {
      // Store the original canvas coordinates for text placement
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
      if (backgroundPages.length > 0) {
        // For multi-page mode, restore page states
        if (prevState.pageStates) {
          setPageStates(prevState.pageStates);
        } else {
          const emptyPageStates = backgroundPages.map(() => ({
            lines: [],
            texts: [],
            shapes: [],
          }));
          setPageStates(emptyPageStates);
        }
      } else {
        // Use startTransition to ensure state updates are processed
        startTransition(() => {
          setLines(prevState.lines || []);
          setTexts(prevState.texts || []);
          setShapes(prevState.shapes || []);
        });
      }
    }
  };

  const redo = () => {
    const nextState = redoHistory();

    if (nextState) {
      if (backgroundPages.length > 0) {
        // For multi-page mode, restore page states
        if (nextState.pageStates) {
          setPageStates(nextState.pageStates);
        } else {
          const emptyPageStates = backgroundPages.map(() => ({
            lines: [],
            texts: [],
            shapes: [],
          }));
          setPageStates(emptyPageStates);
        }
      } else {
        // Use startTransition to ensure state updates are processed
        startTransition(() => {
          setLines(nextState.lines || []);
          setTexts(nextState.texts || []);
          setShapes(nextState.shapes || []);
        });
      }
    }
  };

  // Canvas actions
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      if (backgroundPages.length > 0) {
        // Clear all pages
        const emptyPageStates = pageStates.map(() => ({
          lines: [],
          texts: [],
          shapes: [],
        }));
        setPageStates(emptyPageStates);
        saveToHistory([], [], [], emptyPageStates);
      } else {
        // Clear single page
        setLines([]);
        setTexts([]);
        setShapes([]);
        saveToHistory([], [], []);
      }
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
      
      // Configure worker for the dynamically imported pdfjs instance
      if (typeof window !== 'undefined' && pdfjs?.GlobalWorkerOptions) {
        try {
          pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            "pdfjs-dist/build/pdf.worker.min.mjs",
            import.meta.url
          ).toString();
        } catch (error) {
          console.warn('Failed to configure PDF.js worker with Vite path, falling back to CDN:', error);
          // Use a stable version number instead of accessing pdfjs.version
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.js`;
        }
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
        const initialPageStates = pages.map(() => ({
          lines: [],
          texts: [],
          shapes: [],
        }));
        setPageStates(initialPageStates);
        pageStageRefs.current = pages.map(() => null);

        // Reset history and initialize with the new page states
        // Clear existing history completely
        resetHistory();
        // Initialize history with the new page states
        saveToHistory([], [], [], initialPageStates);
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
      if (
        backgroundPages.length > 0 &&
        pageStageRefs.current.length === backgroundPages.length
      ) {
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
            pdf.addPage(
              [page.width, page.height],
              page.width > page.height ? "landscape" : "portrait"
            );
          }
          const stageWidth = stage.width();
          const ratio = page.width / Math.max(1, stageWidth);
          const pixelRatio = Math.max(1, Math.min(4, ratio));
          const dataURL = stage.toDataURL({
            pixelRatio,
            mimeType: "image/png",
          });
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
        alert(
          "Canvas is empty. Please add some content before exporting to PDF."
        );
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

  // Set up initial history (only for non-PDF mode or when PDF is not yet loaded)
  useEffect(() => {
    if (history.length === 0 && backgroundPages.length === 0) {
      // Only initialize history for single-page mode
      saveToHistory([], [], []);
    }
  }, [history.length, saveToHistory, backgroundPages.length]);

  const { isDesktop } = useResponsive();

  return (
    <div
      className={`flex gap-5 w-full h-full ${
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
      <div>
        <ActionButtons
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onClear={clearCanvas}
        />

        <div
          className={`canvas-wrapper flex-1 min-h-0 ${
            isDesktop ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"
          }`}
        >
          {backgroundPages.length > 0 ? (
            backgroundPages.map((p, idx) => (
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
                pageState={
                  pageStates[idx] || { lines: [], texts: [], shapes: [] }
                }
                isDesktop={isDesktop}
                onUpdatePageState={(i, next) => {
                  const newPageStates = pageStates.map((s, k) =>
                    k === i ? next : s
                  );
                  setPageStates(newPageStates);
                  // Don't save to history here - let saveToHistory callback handle it
                }}
                saveToHistory={(newLines, newTexts, newShapes) => {
                  // This is called by PageCanvas drawing actions
                  const newPageStates = pageStates.map((s, k) =>
                    k === idx
                      ? {
                          ...s,
                          lines: newLines,
                          texts: newTexts,
                          shapes: newShapes,
                        }
                      : s
                  );
                  setPageStates(newPageStates);
                  // Save to history with the updated pageStates
                  saveToHistory([], [], [], newPageStates);
                }}
                stageRef={(node) => {
                  if (!node) return;
                  pageStageRefs.current[idx] = node;
                }}
              />
            ))
          ) : (
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
              containerRef={canvasContainerRef}
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
          containerRef={canvasContainerRef}
          displayScale={1}
        />
      </div>
    </div>
  );
};

export default Board;
