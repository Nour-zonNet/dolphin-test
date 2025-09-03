import { useRef, useCallback } from 'react';

export const useCanvasDrawing = (tool, currentColor, strokeWidth, lines, shapes, setLines, setShapes, saveToHistory) => {
  const isDrawing = useRef(false);

  const handleMouseDown = useCallback((e) => {
    if (tool === "text") {
      const pos = e.target.getStage().getPointerPosition();
      return { type: 'text', position: pos };
    }

    if (tool === "rectangle" || tool === "circle" || tool === "arrow") {
      const pos = e.target.getStage().getPointerPosition();
      const newShape = {
        type: tool,
        points: [pos.x, pos.y, pos.x, pos.y],
        color: currentColor,
        strokeWidth,
        fill: tool === "arrow" ? "transparent" : `${currentColor}33`,
      };

      const newShapes = [...shapes, newShape];
      setShapes(newShapes);
      saveToHistory(lines, [], newShapes);
      isDrawing.current = true;
      return { type: 'shape', shape: newShape };
    }

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      tool,
      points: [pos.x, pos.y],
      color: currentColor,
      strokeWidth,
      opacity: tool === "highlighter" ? 0.3 : 1,
      globalCompositeOperation:
        tool === "eraser" ? "destination-out" : "source-over",
    };

    const newLines = [...lines, newLine];
    setLines(newLines);
    saveToHistory(newLines, [], shapes);
    return { type: 'line', line: newLine };
  }, [tool, currentColor, strokeWidth, lines, shapes, setLines, setShapes, saveToHistory]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === "rectangle" || tool === "circle" || tool === "arrow") {
      let lastShape = shapes[shapes.length - 1];
      if (lastShape) {
        lastShape.points = [
          lastShape.points[0],
          lastShape.points[1],
          point.x,
          point.y,
        ];

        const updatedShapes = shapes.slice();
        updatedShapes.splice(shapes.length - 1, 1, lastShape);
        setShapes(updatedShapes);
      }
      return;
    }

    if (tool === "text") return;

    let lastLine = lines[lines.length - 1];
    if (lastLine) {
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      const updatedLines = lines.slice();
      updatedLines.splice(lines.length - 1, 1, lastLine);
      setLines(updatedLines);
    }
  }, [isDrawing, tool, shapes, lines, setShapes, setLines]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing.current) {
      saveToHistory(lines, [], shapes);
    }
    isDrawing.current = false;
  }, [isDrawing, lines, shapes, saveToHistory]);

  return {
    isDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
