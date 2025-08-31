import React from 'react';
import { Stage, Layer, Line, Text, Rect, Circle, Arrow } from 'react-konva';
import { STATIC_CONTENT } from './constants';

const Canvas = ({
  stageRef,
  lines,
  texts,
  shapes,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTextDblClick,
}) => {
  return (
    <div className="flex-1 overflow-hidden relative border rounded-xl border-gray-400">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 60}
        onMouseDown={onMouseDown}
        onMousemove={onMouseMove}
        onMouseup={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
        ref={stageRef}
        className="bg-white"
      >
        {/* Static layer (fixed content) */}
        <Layer listening={false}>
          {STATIC_CONTENT.map((item, i) => (
            <Text
              key={i}
              x={item.x}
              y={item.y}
              text={item.text}
              fontSize={item.fontSize}
              fill={item.fill}
              fontFamily="Arial"
            />
          ))}
        </Layer>

        {/* User drawings */}
        <Layer>
          {/* Draw shapes */}
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

          {/* Draw lines */}
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

          {/* Render text */}
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
  );
};

export default Canvas;
