import { useRef, useCallback } from 'react';

export const useCanvasDrawing = (
  tool,
  currentColor,
  strokeWidth,
  lines,
  shapes,
  setLines,
  setShapes,
  saveToHistory,
  pointerScale = 1
) => {
  const isDrawing = useRef(false);
  const currentLines = useRef(lines);
  const currentShapes = useRef(shapes);
  
  // Update refs when props change
  currentLines.current = lines;
  currentShapes.current = shapes;

  const handleMouseDown = useCallback((e) => {
    if (tool === "text") {
      const pos = e.target.getStage().getPointerPosition();
      const transformed = { x: pos.x / pointerScale, y: pos.y / pointerScale };
      return { type: 'text', position: transformed };
    }

    if (tool === "rectangle" || tool === "circle" || tool === "arrow") {
      const pos = e.target.getStage().getPointerPosition();
      const baseX = pos.x / pointerScale;
      const baseY = pos.y / pointerScale;
      const newShape = {
        type: tool,
        points: [baseX, baseY, baseX, baseY],
        color: currentColor,
        strokeWidth,
        fill: tool === "arrow" ? "transparent" : `${currentColor}33`,
      };

      const newShapes = [...shapes, newShape];
      setShapes(newShapes);
      currentShapes.current = newShapes;
      // Don't save to history here - let the parent handle it
      isDrawing.current = true;
      return { type: 'shape', shape: newShape };
    }

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const baseX = pos.x / pointerScale;
    const baseY = pos.y / pointerScale;
    const newLine = {
      tool,
      points: [baseX, baseY],
      color: currentColor,
      strokeWidth,
      opacity: tool === "highlighter" ? 0.3 : 1,
      globalCompositeOperation:
        tool === "eraser" ? "destination-out" : "source-over",
    };

    const newLines = [...lines, newLine];
    setLines(newLines);
    currentLines.current = newLines;
    // Don't save to history here - let the parent handle it
    return { type: 'line', line: newLine };
  }, [tool, currentColor, strokeWidth, lines, shapes, setLines, setShapes, pointerScale]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const px = point.x / pointerScale;
    const py = point.y / pointerScale;

    if (tool === "rectangle" || tool === "circle" || tool === "arrow") {
      let lastShape = shapes[shapes.length - 1];
      if (lastShape) {
        lastShape.points = [
          lastShape.points[0],
          lastShape.points[1],
          px,
          py,
        ];

      const updatedShapes = shapes.slice();
      updatedShapes.splice(shapes.length - 1, 1, lastShape);
      setShapes(updatedShapes);
      currentShapes.current = updatedShapes;
      }
      return;
    }

    if (tool === "text") return;

    let lastLine = lines[lines.length - 1];
    if (lastLine) {
      lastLine.points = lastLine.points.concat([px, py]);

      const updatedLines = lines.slice();
      updatedLines.splice(lines.length - 1, 1, lastLine);
      setLines(updatedLines);
      currentLines.current = updatedLines;
    }
  }, [isDrawing, tool, shapes, lines, setShapes, setLines, pointerScale]);

  const handleMouseUp = useCallback(() => {
    // Save to history when drawing is complete
    if (isDrawing.current) {
      // Use the current state from refs, which should be the updated state
      saveToHistory(currentLines.current, [], currentShapes.current);
    }
    isDrawing.current = false;
  }, [isDrawing, saveToHistory]);

  return {
    isDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
