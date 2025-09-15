import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Text, Rect, Circle, Arrow, Image as KonvaImage } from "react-konva";
import "./style.css";

const Canvas = ({
  stageRef,
  lines,
  texts,
  shapes,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTextDblClick,
  backgroundImage,
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [bgImageEl, setBgImageEl] = useState(null);

  // Calculate responsive dimensions based on container and content
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      // If background image exists, lock canvas size to PDF page image
      if (bgImageEl) {
        setDimensions({ width: bgImageEl.width, height: bgImageEl.height });
        return;
      }
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // Calculate minimum dimensions based on content
      const minWidth = Math.max(800, containerWidth * 0.9); // At least 800px or 90% of container
      const minHeight = Math.max(600, containerHeight * 0.9); // At least 600px or 90% of container

      // Use container dimensions but ensure minimum sizes (when no PDF)
      const finalWidth = Math.max(minWidth, containerWidth - 40);
      const finalHeight = Math.max(minHeight, containerHeight - 40);

      setDimensions({
        width: finalWidth,
        height: finalHeight,
      });
    };

    updateSize();

    // Debounced resize handler for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateSize, 100);
    };

    window.addEventListener("resize", handleResize);

    // Also listen for container size changes
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [bgImageEl]);

  // Load background image when provided
  useEffect(() => {
    if (!backgroundImage) {
      setBgImageEl(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setBgImageEl(img);
      // Lock canvas to image size exactly
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  return (
    <div className="p-2 pl-0 border border-graycustom/30 rounded-2xl flex-1">
      <div
        ref={containerRef}
        className="relative rounded-2xl custom-scrollbar w-full h-full min-h-[70vh] max-h-[85vh] p-3"
        style={{
          overflowX: "auto",
          overflowY: "auto",
          minHeight: "70vh",
          maxHeight: "85vh",
        }}
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onMouseDown}
          onTouchMove={onMouseMove}
          onTouchEnd={onMouseUp}
          ref={stageRef}
          className="bg-white pdf-export-optimized"
        >
          {/* Background image layer */}
          {bgImageEl && (
            <Layer listening={false}>
              <KonvaImage image={bgImageEl} x={0} y={0} width={bgImageEl.width} height={bgImageEl.height} />
            </Layer>
          )}
          {/* Static layer removed as requested: no STATIC_CONTENT */}

          {/* User drawings */}
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
                      Math.pow(shape.points[2] - shape.points[0], 2) +
                        Math.pow(shape.points[3] - shape.points[1], 2)
                    )}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill={shape.fill}
                  />
                );
              } else if (shape.type === "arrow") {
                return (
                  <Arrow
                    key={i}
                    points={shape.points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill={shape.color}
                  />
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
                onDblClick={() => onTextDblClick(i)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;
