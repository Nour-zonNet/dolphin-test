import React, { useEffect, useMemo, useRef, useState } from "react";
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
  stageRef,
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [bgImageEl, setBgImageEl] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const { lines, texts, shapes } = pageState;
  const setLines = (next) => onUpdatePageState(pageIndex, { ...pageState, lines: next });
  const setShapes = (next) => onUpdatePageState(pageIndex, { ...pageState, shapes: next });
  const setTexts = (next) => onUpdatePageState(pageIndex, { ...pageState, texts: next });

  const saveToHistory = useMemo(() => {
    // For now, just persist state upward; per-page undo can be added later
    return (newLines, newTexts, newShapes) => {
      onUpdatePageState(pageIndex, {
        lines: newLines.length ? newLines : lines,
        texts: newTexts.length ? newTexts : texts,
        shapes: newShapes.length ? newShapes : shapes,
      });
    };
  }, [onUpdatePageState, pageIndex, lines, texts, shapes]);

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

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setBgImageEl(img);
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  const onCanvasMouseDown = (e) => {
    const result = handleMouseDown(e);
    if (result?.type === "text") {
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
      saveToHistory(lines, newTexts, shapes);
    }
    setTextInput("");
    setShowTextInput(false);
  };

  const handleTextDblClick = (idx) => {
    const newText = prompt("Edit text:", texts[idx].text);
    if (newText !== null) {
      const updated = texts.map((t, i) => (i === idx ? { ...t, text: newText } : t));
      setTexts(updated);
      saveToHistory(lines, updated, shapes);
    }
  };

  return (
    <div className="p-2 pl-0 border border-graycustom/30 rounded-2xl w-full">
      <div
        ref={containerRef}
        className="relative rounded-2xl custom-scrollbar w-full"
        style={{ overflowX: "auto", overflowY: "auto" }}
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={onCanvasMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          ref={stageRef}
          className="bg-white pdf-export-optimized"
        >
          {bgImageEl && (
            <Layer listening={false}>
              <KonvaImage image={bgImageEl} x={0} y={0} width={bgImageEl.width} height={bgImageEl.height} />
            </Layer>
          )}
          <Layer>
            {shapes.map((shape, i) => {
              if (shape.type === "rectangle") {
                return (
                  <Rect
                    key={i}
                    x={shape.points[0]}
                    y={shape.points[1]}
                    width={shape.points[2] - shape.points[0]}
                    height={shape.points[3] - shape.points[1]}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill={shape.fill}
                  />
                );
              } else if (shape.type === "circle") {
                return (
                  <Circle
                    key={i}
                    x={shape.points[0]}
                    y={shape.points[1]}
                    radius={Math.sqrt(
                      Math.pow(shape.points[2] - shape.points[0], 2) + Math.pow(shape.points[3] - shape.points[1], 2)
                    )}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill={shape.fill}
                  />
                );
              } else if (shape.type === "arrow") {
                return (
                  <Arrow key={i} points={shape.points} stroke={shape.color} strokeWidth={shape.strokeWidth} fill={shape.color} />
                );
              }
              return null;
            })}

            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                opacity={line.opacity}
                globalCompositeOperation={line.globalCompositeOperation}
              />
            ))}

            {texts.map((t, i) => (
              <Text
                key={i}
                x={t.x}
                y={t.y}
                text={t.text}
                fontSize={t.fontSize}
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
      />
    </div>
  );
};

export default PageCanvas;


