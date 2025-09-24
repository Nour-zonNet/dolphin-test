import { useRef, useState, useEffect, startTransition } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import PageCanvas from "./PageCanvas";
import TextInputOverlay from "./TextInputOverlay";
import {
  useBoardHistory,
  useCanvasDrawing,
  useKeyboardShortcuts,
  useErrorHandler,
  useMemoryManager,
} from "./hooks";
import {
  ActionButtons,
  ErrorNotification,
  KeyboardShortcutsHelp,
  PerformanceMonitor,
  MobileCanvasWrapper,
} from "./components";
// import * as pdfjs from "pdfjs-dist";
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
  // Drawing state
  const [selectedTool, setSelectedTool] = useState("pen");
  const [drawingLines, setDrawingLines] = useState([]);
  const [drawingTexts, setDrawingTexts] = useState([]);
  const [drawingShapes, setDrawingShapes] = useState([]);
  const [currentColor, setCurrentColor] = useState("#3B82F6");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [fontSize, setFontSize] = useState(20);

  // Text input state
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);

  // PDF state
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [pageStates, setPageStates] = useState([]); // {lines, texts, shapes} per page

  // UI state
  const [isShortcutsHelpVisible, setIsShortcutsHelpVisible] = useState(false);
  const [isPerformanceMonitorVisible, setIsPerformanceMonitorVisible] =
    useState(false);

  // Refs
  const stageRef = useRef();
  const canvasContainerRef = useRef();
  const pageStageRefs = useRef([]);

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

  const { errors, addError, removeError, clearAllErrors } = useErrorHandler();
  const { cleanupAllCanvases, manageImageCache, getCachedImage } =
    useMemoryManager();

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasDrawing(
    selectedTool,
    currentColor,
    strokeWidth,
    drawingLines,
    drawingShapes,
    setDrawingLines,
    setDrawingShapes,
    (newLines, newTexts, newShapes) => {
      saveToHistory(newLines, newTexts, newShapes);
    }
  );

  // Canvas event handlers
  const handleCanvasMouseDown = (e) => {
    const result = handleMouseDown(e);
    if (result?.type === "text") {
      setTextPosition(result.position);
      setIsTextInputVisible(true);
    }
  };

  const handleCanvasMouseMove = handleMouseMove;
  const handleCanvasMouseUp = handleMouseUp;

  // Text handling functions
  const addText = () => {
    if (textInput.trim() !== "") {
      const newTexts = [
        ...drawingTexts,
        {
          x: textPosition.x,
          y: textPosition.y,
          text: textInput,
          fontSize,
          fill: currentColor,
        },
      ];
      setDrawingTexts(newTexts);
      saveToHistory(drawingLines, newTexts, drawingShapes);
    }
    setTextInput("");
    setIsTextInputVisible(false);
  };

  const handleTextDblClick = (idx) => {
    const newText = prompt("Edit text:", drawingTexts[idx].text);
    if (newText !== null) {
      const updated = drawingTexts.map((t, i) =>
        i === idx ? { ...t, text: newText } : t
      );
      setDrawingTexts(updated);
      saveToHistory(drawingLines, updated, drawingShapes);
    }
  };

  // History actions
  const undo = () => {
    const prevState = undoHistory();

    if (prevState) {
      if (pdfPages.length > 0) {
        // For multi-page mode, restore page states
        if (prevState.pageStates) {
          setPageStates(prevState.pageStates);
        } else {
          const emptyPageStates = pdfPages.map(() => ({
            lines: [],
            texts: [],
            shapes: [],
          }));
          setPageStates(emptyPageStates);
        }
      } else {
        // Single page mode
        startTransition(() => {
          setDrawingLines(prevState.lines || []);
          setDrawingTexts(prevState.texts || []);
          setDrawingShapes(prevState.shapes || []);
        });
      }
    }
  };

  const redo = () => {
    const nextState = redoHistory();

    if (nextState) {
      if (pdfPages.length > 0) {
        // For multi-page mode, restore page states
        if (nextState.pageStates) {
          setPageStates(nextState.pageStates);
        } else {
          const emptyPageStates = pdfPages.map(() => ({
            lines: [],
            texts: [],
            shapes: [],
          }));
          setPageStates(emptyPageStates);
        }
      } else {
        // Single page mode
        startTransition(() => {
          setDrawingLines(nextState.lines || []);
          setDrawingTexts(nextState.texts || []);
          setDrawingShapes(nextState.shapes || []);
        });
      }
    }
  };

  // Canvas actions
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      if (pdfPages.length > 0) {
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
        setDrawingLines([]);
        setDrawingTexts([]);
        setDrawingShapes([]);
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
      // Configure PDF.js worker
      const pdfjs = await import("pdfjs-dist");
      if (typeof window !== "undefined" && pdfjs?.GlobalWorkerOptions) {
        try {
          pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        } catch (error) {
          console.warn("Failed to configure PDF.js worker:", error);
        }
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const pages = [];
      const deviceScale = Math.max(2, (window.devicePixelRatio || 1) * 2);

      // Check cache first
      const cacheKey = `pdf_${file.name}_${file.size}`;
      const cachedPages = getCachedImage(cacheKey);

      if (cachedPages) {
        setPdfPages(cachedPages);
        setBackgroundImage(cachedPages[0].dataUrl);
        const initialPageStates = cachedPages.map(() => ({
          lines: [],
          texts: [],
          shapes: [],
        }));
        setPageStates(initialPageStates);
        pageStageRefs.current = cachedPages.map(() => null);
        resetHistory();
        saveToHistory([], [], [], initialPageStates);
        return;
      }

      // Render pages
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
        // Cache and set pages
        manageImageCache(cacheKey, pages);
        setPdfPages(pages);
        setBackgroundImage(pages[0].dataUrl);

        const initialPageStates = pages.map(() => ({
          lines: [],
          texts: [],
          shapes: [],
        }));
        setPageStates(initialPageStates);
        pageStageRefs.current = pages.map(() => null);
        resetHistory();
        saveToHistory([], [], [], initialPageStates);
      }
    } catch (error) {
      console.error("Error importing PDF:", error);
      addError(error, "PDF Import");
    }
  };

  // PDF Export functionality
  const exportToPDF = async () => {
    try {
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      // Multi-page PDF export
      if (
        pdfPages.length > 0 &&
        pageStageRefs.current.length === pdfPages.length
      ) {
        const firstPage = pdfPages[0];
        const pdf = new jsPDF({
          orientation:
            firstPage.width > firstPage.height ? "landscape" : "portrait",
          unit: "px",
          format: [firstPage.width, firstPage.height],
        });

        for (let i = 0; i < pdfPages.length; i += 1) {
          const page = pdfPages[i];
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
        pdf.save(`drawing-board-${timestamp}.pdf`);
        return;
      }

      // Single-page export
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
      pdf.save(`drawing-board-${timestamp}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      addError(error, "PDF Export");
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    setTool: (newTool) => {
      setIsTextInputVisible(false);
      setSelectedTool(newTool);
    },
    onUndo: undo,
    onRedo: redo,
    onClear: clearCanvas,
    canUndo,
    canRedo,
    onExport: exportImage,
    setShowTextInput: setIsTextInputVisible,
    setFontSize,
    onToggleHelp: () => setIsShortcutsHelpVisible(!isShortcutsHelpVisible),
    setShowPerformanceMonitor: setIsPerformanceMonitorVisible,
  });

  // Initialize history for single-page mode
  useEffect(() => {
    if (history.length === 0 && pdfPages.length === 0) {
      saveToHistory([], [], []);
    }
  }, [history.length, saveToHistory, pdfPages.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAllCanvases();
    };
  }, [cleanupAllCanvases]);

  const { isDesktop, isMobile, isTablet } = useResponsive();

  return (
    <div
      className={`flex w-full h-full ${
        isMobile ? "flex-col" : isTablet ? "flex-col" : "flex-row-reverse"
      } ${isMobile ? "gap-2" : isTablet ? "gap-3" : "gap-5"}`}
      style={{
        padding: isMobile ? "8px" : isTablet ? "12px" : "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Error Notifications */}
      <ErrorNotification
        errors={errors}
        onRemoveError={removeError}
        onClearAll={clearAllErrors}
      />

      <Toolbar
        tool={selectedTool}
        setTool={(tool) => {
          setIsTextInputVisible(false);
          setSelectedTool(tool);
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
          isMobile={isMobile}
        />

        <div
          className="flex-1 min-h-0 overflow-hidden"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minHeight: isMobile ? "200px" : isTablet ? "300px" : "400px",
          }}
        >
          <MobileCanvasWrapper
            className={`canvas-wrapper ${
              isMobile
                ? "flex flex-col gap-2"
                : isTablet
                ? "flex flex-col gap-3"
                : "grid grid-cols-2 gap-4"
            }`}
            style={{
              width: "fit-content",
              height: "fit-content",
              minWidth: isMobile ? "280px" : isTablet ? "400px" : "600px",
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            isMobile={isMobile}
          >
            {pdfPages.length > 0 ? (
              pdfPages.map((page, idx) => (
                <PageCanvas
                  key={idx}
                  pageIndex={idx}
                  backgroundImage={page.dataUrl}
                  initialWidth={page.width}
                  initialHeight={page.height}
                  tool={selectedTool}
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
                  }}
                  saveToHistory={(newLines, newTexts, newShapes) => {
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
                lines={drawingLines}
                texts={drawingTexts}
                shapes={drawingShapes}
                backgroundImage={backgroundImage}
                onMouseDown={undefined} // Handled by MobileCanvasWrapper
                onMouseMove={undefined} // Handled by MobileCanvasWrapper
                onMouseUp={undefined} // Handled by MobileCanvasWrapper
                onTextDblClick={handleTextDblClick}
                containerRef={canvasContainerRef}
              />
            )}
          </MobileCanvasWrapper>
        </div>

        <TextInputOverlay
          showTextInput={isTextInputVisible}
          textInput={textInput}
          setTextInput={setTextInput}
          textPosition={textPosition}
          onAddText={addText}
          onClose={() => setIsTextInputVisible(false)}
          containerRef={canvasContainerRef}
        />
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp
        isOpen={isShortcutsHelpVisible}
        onClose={() => setIsShortcutsHelpVisible(false)}
      />

      {/* Performance Monitor */}
      <PerformanceMonitor
        isVisible={isPerformanceMonitorVisible}
        pageCount={pdfPages.length}
        canvasCount={pageStageRefs.current.filter(Boolean).length}
      />
    </div>
  );
};

export default Board;
