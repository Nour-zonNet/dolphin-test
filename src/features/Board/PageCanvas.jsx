import React, { useEffect, useMemo, useRef, useState } from "react";
import "@/utils/react-konva-patch"; // CRITICAL: Must be imported before react-konva
import { Stage, Layer, Line, Text, Rect, Circle, Arrow, Image as KonvaImage } from "react-konva";
import { useCanvasDrawing } from "./hooks";
import TextInputOverlay from "./TextInputOverlay";

const PageCanvas = ({
  pageIndex,
  backgroundImage,
  initialWidth,
  initialHeight,
  tool,
  currentColor,
  strokeWidth,
  fontSize,
  pageState,
  onUpdatePageState,
  saveToHistory,
  stageRef,
  isDesktop,
}) => {
  const containerRef = useRef(null);
  const localStageRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [displayScale, setDisplayScale] = useState(1);
  const [bgImageEl, setBgImageEl] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const { lines, texts, shapes } = pageState;
  const setLines = (next) => onUpdatePageState(pageIndex, { ...pageState, lines: next });
  const setShapes = (next) => onUpdatePageState(pageIndex, { ...pageState, shapes: next });
  const setTexts = (next) => onUpdatePageState(pageIndex, { ...pageState, texts: next });

  const localSaveToHistory = useMemo(() => {
    // Use the passed saveToHistory function from parent
    return (newLines, newTexts, newShapes) => {
      if (saveToHistory) {
        // For multi-page mode, just call saveToHistory - it will handle pageStates
        saveToHistory(newLines, newTexts, newShapes);
      } else {
        // Fallback to local state update
        onUpdatePageState(pageIndex, {
          lines: newLines.length ? newLines : lines,
          texts: newTexts.length ? newTexts : texts,
          shapes: newShapes.length ? newShapes : shapes,
        });
      }
    };
  }, [saveToHistory, onUpdatePageState, pageIndex, lines, texts, shapes]);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasDrawing(
    tool,
    currentColor,
    strokeWidth,
    lines,
    shapes,
    setLines,
    setShapes,
    localSaveToHistory,
    displayScale
  );

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setBgImageEl(img);
      // Fit to container while preserving aspect ratio
      if (!containerRef.current) {
        setDisplayScale(1);
        setDimensions({ width: img.width, height: img.height });
        return;
      }
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight || img.height;
      const maxWidth = Math.max(320, containerWidth);
      const maxHeight = Math.max(240, containerHeight);
      // Remove the scale cap of 1 to allow PDF pages to grow larger when container grows
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      setDisplayScale(scale);
      setDimensions({ width: Math.floor(img.width * scale), height: Math.floor(img.height * scale) });
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  // Resize on container change
  useEffect(() => {
    if (!containerRef.current || !bgImageEl) return;

    const update = () => {
      if (!containerRef.current || !bgImageEl) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight || bgImageEl.height;
      const maxWidth = Math.max(320, containerWidth);
      const maxHeight = Math.max(240, containerHeight);
      // Remove the scale cap of 1 to allow PDF pages to grow larger when container grows
      const scale = Math.min(maxWidth / bgImageEl.width, maxHeight / bgImageEl.height);
      setDisplayScale(scale);
      setDimensions({ width: Math.floor(bgImageEl.width * scale), height: Math.floor(bgImageEl.height * scale) });
    };

    // Debounced update function to handle rapid resize events
    let timeoutId;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(update, 100);
    };

    update();
    const ro = new ResizeObserver(debouncedUpdate);
    ro.observe(containerRef.current);
    window.addEventListener("resize", debouncedUpdate);
    
    return () => {
      clearTimeout(timeoutId);
      ro.disconnect();
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, [bgImageEl]);

  // Force resize when layout changes (isDesktop changes)
  useEffect(() => {
    if (!containerRef.current || !bgImageEl) return;
    
    // Small delay to ensure layout has updated
    const timeoutId = setTimeout(() => {
      if (!containerRef.current || !bgImageEl) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight || bgImageEl.height;
      const maxWidth = Math.max(320, containerWidth);
      const maxHeight = Math.max(240, containerHeight);
      const scale = Math.min(maxWidth / bgImageEl.width, maxHeight / bgImageEl.height);
      setDisplayScale(scale);
      setDimensions({ width: Math.floor(bgImageEl.width * scale), height: Math.floor(bgImageEl.height * scale) });
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [isDesktop, bgImageEl]);

  const onCanvasMouseDown = (e) => {
    if (e.evt && e.evt.touches && e.evt.touches.length > 1) {
      return; // allow native scroll/zoom on multi-touch
    }
    const result = handleMouseDown(e);
    if (result?.type === "text") {
      // Store the original canvas coordinates for text placement
      setTextPosition(result.position);
      setShowTextInput(true);
    }
  };

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
      // For multi-page mode, we need to call the parent's saveToHistory with pageStates
      if (saveToHistory) {
        saveToHistory(lines, newTexts, shapes);
      }
    }
    setTextInput("");
    setShowTextInput(false);
  };

  const handleTextDblClick = (idx) => {
    const newText = prompt("Edit text:", texts[idx].text);
    if (newText !== null) {
      const updated = texts.map((t, i) => (i === idx ? { ...t, text: newText } : t));
      setTexts(updated);
      // For multi-page mode, we need to call the parent's saveToHistory with pageStates
      if (saveToHistory) {
        saveToHistory(lines, updated, shapes);
      }
    }
  };

  return (
    <div className="p-2 pl-0 border border-graycustom/30 rounded-2xl w-full">
      <div
        ref={containerRef}
        className="relative rounded-2xl custom-scrollbar w-full"
        style={{ overflowX: "auto", overflowY: "auto", touchAction: "pan-x pan-y" }}
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={onCanvasMouseDown}
          onTouchMove={(e) => {
            if (e.evt && e.evt.touches && e.evt.touches.length > 1) return; // let scroll
            handleMouseMove(e);
          }}
          onTouchEnd={handleMouseUp}
          ref={(node) => {
            localStageRef.current = node;
            if (node && node.getStage && node.getStage().container()) {
              node.getStage().container().style.touchAction = "pan-x pan-y";
            }
            if (typeof stageRef === "function") {
              stageRef(node);
            } else if (stageRef && typeof stageRef === "object") {
              stageRef.current = node;
            }
          }}
          className="bg-white pdf-export-optimized"
        >
          {bgImageEl && (
            <Layer listening={false}>
              <KonvaImage image={bgImageEl} x={0} y={0} width={dimensions.width} height={dimensions.height} />
            </Layer>
          )}
          <Layer>
            {shapes.map((shape, i) => {
              if (shape.type === "rectangle") {
                return (
                  <Rect
                    key={i}
                    x={shape.points[0] * displayScale}
                    y={shape.points[1] * displayScale}
                    width={(shape.points[2] - shape.points[0]) * displayScale}
                    height={(shape.points[3] - shape.points[1]) * displayScale}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth * displayScale}
                    fill={shape.fill}
                  />
                );
              } else if (shape.type === "circle") {
                return (
                  <Circle
                    key={i}
                    x={shape.points[0] * displayScale}
                    y={shape.points[1] * displayScale}
                    radius={Math.sqrt(
                      Math.pow(shape.points[2] - shape.points[0], 2) + Math.pow(shape.points[3] - shape.points[1], 2)
                    ) * displayScale}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth * displayScale}
                    fill={shape.fill}
                  />
                );
              } else if (shape.type === "arrow") {
                return (
                  <Arrow
                    key={i}
                    points={shape.points.map((v) => v * displayScale)}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth * displayScale}
                    fill={shape.color}
                  />
                );
              }
              return null;
            })}

            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points.map((v) => v * displayScale)}
                stroke={line.color}
                strokeWidth={line.strokeWidth * displayScale}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                opacity={line.opacity}
                globalCompositeOperation={line.globalCompositeOperation}
              />
            ))}

            {texts.map((t, i) => (
              <Text
                key={t.x + '-' + t.y + '-' + i}
                x={t.x * displayScale}
                y={t.y * displayScale}
                text={t.text}
                fontSize={t.fontSize * displayScale}
                fill={t.fill}
                fontFamily="Arial"
                fontStyle={t.fontStyle || "normal"}
                onDblClick={() => handleTextDblClick(i)}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <TextInputOverlay
        showTextInput={showTextInput}
        textInput={textInput}
        setTextInput={setTextInput}
        textPosition={textPosition}
        onAddText={addText}
        onClose={() => setShowTextInput(false)}
        containerRef={containerRef}
        displayScale={displayScale}
      />
    </div>
  );
};

export default PageCanvas;


