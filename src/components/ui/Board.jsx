import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Text, Rect, Circle, Arrow } from "react-konva";

const Board = () => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [currentColor, setCurrentColor] = useState("#3B82F6");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showWidthSlider, setShowWidthSlider] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [staticContent] = useState([
    {
      type: "text",
      x: 20,
      y: 20,
      text: "Static Content (لا يتم مسحه)",
      fontSize: 18,
      fill: "#7f8c8d",
    },
    {
      type: "text",
      x: 20,
      y: 50,
      text: "Double click to edit text",
      fontSize: 16,
      fill: "#7f8c8d",
    },
    {
      type: "text",
      x: 20,
      y: 80,
      text: "Use toolbar for more options",
      fontSize: 16,
      fill: "#7f8c8d",
    },
  ]);
  const isDrawing = useRef(false);
  const stageRef = useRef();

  const colors = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#84CC16",
    "#10B981",
    "#06B6D4",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#000000",
    "#FFFFFF",
  ];

  // Save state to history
  const saveToHistory = (newLines, newTexts, newShapes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ lines: newLines, texts: newTexts, shapes: newShapes });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setLines(prevState.lines);
      setTexts(prevState.texts);
      setShapes(prevState.shapes);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setLines(nextState.lines);
      setTexts(nextState.texts);
      setShapes(nextState.shapes);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Clear the canvas
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setLines([]);
      setTexts([]);
      setShapes([]);
      saveToHistory([], [], []);
    }
  };

  // Handle mouse down event
  const handleMouseDown = (e) => {
    if (tool === "text") {
      const pos = e.target.getStage().getPointerPosition();
      setTextPosition(pos);
      setShowTextInput(true);
      return;
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
      saveToHistory(lines, texts, newShapes);
      isDrawing.current = true;
      return;
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
    saveToHistory(newLines, texts, shapes);
  };

  // Handle mouse move event - FIXED THE newShapes ERROR
  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === "rectangle" || tool === "circle" || tool === "arrow") {
      let lastShape = shapes[shapes.length - 1];
      lastShape.points = [
        lastShape.points[0],
        lastShape.points[1],
        point.x,
        point.y,
      ];

      const updatedShapes = shapes.slice();
      updatedShapes.splice(shapes.length - 1, 1, lastShape);
      setShapes(updatedShapes);
      return;
    }

    if (tool === "text") return;

    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const updatedLines = lines.slice();
    updatedLines.splice(lines.length - 1, 1, lastLine);
    setLines(updatedLines);
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    if (isDrawing.current) {
      saveToHistory(lines, texts, shapes);
    }
    isDrawing.current = false;
  };

  // Add text to canvas
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

  // Double click edit text
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

  // Export canvas
  const exportImage = (format) => {
    const uri = stageRef.current.toDataURL({
      pixelRatio: format === "high" ? 3 : format === "medium" ? 2 : 1,
    });
    const link = document.createElement("a");
    link.download = `drawing-board.${format === "svg" ? "svg" : "png"}`;
    link.href = uri;
    link.click();
    setShowExportMenu(false);
  };

  // Set up initial history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory([], [], []);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="p-3 flex items-center justify-center flex-wrap shadow-md z-10 gap-2">
        {/* Tool selection */}
        <div className="flex  justify-between items-center rounded-lg p-1 gap-1">
          {[
            {
              tool: "pen",
              icon: (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_892_999)">
                    <path
                      d="M0.0234375 23.9763L0.0994375 22.9263C0.175438 21.8263 0.644438 16.2383 2.40644 14.4753C3.35498 13.5494 4.63031 13.0348 5.9558 13.0432C7.28129 13.0515 8.55005 13.5821 9.48687 14.5198C10.4237 15.4576 10.953 16.7268 10.9601 18.0523C10.9671 19.3778 10.4513 20.6527 9.52444 21.6003C7.76244 23.3623 2.17544 23.8303 1.07244 23.9063L0.0234375 23.9763ZM23.0994 0.86829C22.5158 0.310976 21.7399 0 20.9329 0C20.126 0 19.35 0.310976 18.7664 0.86829L8.25144 11.3873C9.25688 11.7294 10.1708 12.2969 10.9234 13.0463C11.6759 13.7957 12.2471 14.7073 12.5934 15.7113L23.0994 5.20029C23.673 4.62534 23.995 3.84639 23.995 3.03429C23.995 2.22219 23.673 1.44324 23.0994 0.86829Z"
                      fill="#34C759"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_892_999">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ),
              title: "Pen",
            },
            {
              tool: "eraser",
              icon: (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_892_824)">
                    <path
                      d="M7.24106 7.43755L12.7501 1.91055C13.9201 0.735547 15.9631 0.735547 17.1331 1.91055L23.0681 7.86555C24.2741 9.07555 24.2741 11.0445 23.0681 12.2545L17.5621 17.7795L7.24106 7.43755ZM14.3521 20.9995L16.1501 19.1955L5.82906 8.85455L0.881063 13.8195C-0.324937 15.0295 -0.324937 16.9985 0.881063 18.2085L5.65506 22.9995H23.9991V20.9995H14.3521Z"
                      fill="#0088FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_892_824">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ),
              title: "Eraser",
            },
            {
              tool: "highlighter",
              icon: (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.25541 16.3933L5.67171 8.10885C5.67935 8.08063 5.68878 8.05283 5.69993 8.0256C5.73949 7.92751 5.80096 7.83977 5.87965 7.7691L12.9127 0.73605C13.1883 0.460379 13.6353 0.460379 13.9109 0.73605C14.1866 1.01172 14.1866 1.45863 13.9109 1.7343L7.35124 8.29396L16.2353 17.178L22.7949 10.6183C23.0706 10.3427 23.5176 10.3427 23.7932 10.6183C24.0689 10.894 24.0689 11.3409 23.7932 11.6166L16.7602 18.6496C16.6896 18.7283 16.6018 18.7898 16.5037 18.8294C16.4766 18.8405 16.4488 18.8499 16.4205 18.8576L8.13602 21.2739L6.14627 23.2636C6.03679 23.3731 5.89433 23.4436 5.74085 23.4641C5.58737 23.4847 5.4314 23.4542 5.29695 23.3774L0.355734 20.5539C-0.0483733 20.323 -0.122295 19.771 0.206813 19.4419L3.25541 16.3933ZM7.96835 19.8522L14.8932 17.8325L6.69682 9.63612L4.67708 16.5609L7.96835 19.8522ZM6.76648 20.6469L3.88241 17.7628L1.85859 19.7867L5.52921 21.8842L6.76648 20.6469Z"
                    fill="#FFCC00"
                  />
                </svg>
              ),
              title: "Highlighter",
            },
            {
              tool: "text",
              icon: (
                <svg
                  width="24"
                  height="20"
                  viewBox="0 0 24 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.3627 0.587891H0.953531C0.582234 0.587891 0.28125 0.888875 0.28125 1.26017V5.294C0.28125 5.6653 0.582234 5.96628 0.953531 5.96628H2.29814C2.66944 5.96628 2.97042 5.6653 2.97042 5.294V3.94939H6.97734V16.7231H5.29659C4.9253 16.7231 4.62431 17.0241 4.62431 17.3954V18.74C4.62431 19.1113 4.9253 19.4123 5.29659 19.4123H12.0196C12.3909 19.4123 12.6919 19.1113 12.6919 18.74V17.3954C12.6919 17.0241 12.3909 16.7231 12.0196 16.7231H10.3388V3.94939H14.3458V5.294C14.3458 5.6653 14.6468 5.96628 15.018 5.96628H16.3627C16.734 5.96628 17.0349 5.6653 17.0349 5.294V1.26017C17.035 0.888875 16.734 0.587891 16.3627 0.587891Z"
                    fill="#6155F5"
                  />
                  <path
                    d="M23.2829 7.22656H13.3082C13.1928 7.22657 13.0821 7.27243 13.0005 7.35404C12.9189 7.43565 12.8731 7.54633 12.873 7.66175V10.2729C12.8731 10.3883 12.9189 10.499 13.0005 10.5806C13.0821 10.6622 13.1928 10.7081 13.3082 10.7081H14.1786C14.294 10.7081 14.4047 10.6622 14.4863 10.5806C14.5679 10.499 14.6138 10.3883 14.6138 10.2729V9.40255H17.2075V17.6712H16.1196C16.0041 17.6712 15.8935 17.7171 15.8118 17.7987C15.7302 17.8803 15.6844 17.991 15.6844 18.1064V18.9768C15.6844 19.0922 15.7302 19.2029 15.8119 19.2845C15.8935 19.3661 16.0041 19.4119 16.1196 19.412H20.4715C20.5869 19.412 20.6976 19.3661 20.7792 19.2845C20.8608 19.2029 20.9067 19.0922 20.9067 18.9768V18.1064C20.9067 17.991 20.8608 17.8803 20.7792 17.7987C20.6976 17.7171 20.5869 17.6712 20.4715 17.6712H19.3835V9.40255H21.9772V10.2729C21.9773 10.3883 22.0231 10.499 22.1047 10.5806C22.1863 10.6622 22.297 10.7081 22.4124 10.7081H23.2828C23.3982 10.7081 23.5089 10.6622 23.5905 10.5806C23.6721 10.499 23.718 10.3883 23.718 10.2729V7.66175C23.718 7.42142 23.5232 7.22656 23.2829 7.22656Z"
                    fill="#6155F5"
                  />
                </svg>
              ),
              title: "Text",
            },
            { tool: "rectangle", icon: "◻️", title: "Rectangle" },
            { tool: "circle", icon: "⭕", title: "Circle" },
            { tool: "arrow", icon: "➡️", title: "Arrow" },
          ].map((item) => (
            <button
              key={item.tool}
              onClick={() => setTool(item.tool)}
              className={`p-2 rounded-md transition-all ${
                tool === item.tool
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500"
              }`}
              title={item.title}
            >
              <span className="text-lg">{item.icon}</span>
            </button>
          ))}
        </div>

        {/* Color selection */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <div
              className="w-5 h-5 rounded-full mr-2 border border-gray-400"
              style={{ backgroundColor: currentColor }}
            ></div>
            Color
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 bg-white p-2 rounded-md shadow-lg z-50 grid grid-cols-6 gap-2 mt-1 w-64">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color);
                    setShowColorPicker(false);
                  }}
                  className="w-7 h-7 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stroke width */}
        <div className="relative">
          <button
            onClick={() => setShowWidthSlider(!showWidthSlider)}
            className="flex items-center p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <div
              className="h-1 mr-2 rounded-full bg-white"
              style={{ width: `${strokeWidth * 3}px` }}
            ></div>
            Size
          </button>

          {showWidthSlider && (
            <div className="absolute top-full left-0 bg-white p-3 rounded-md shadow-lg z-50 mt-1 w-48">
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1 text-center">
                {strokeWidth}px
              </div>
            </div>
          )}
        </div>

        {/* Font size for text */}
        {tool === "text" && (
          <div className="relative">
            <button className="flex items-center p-2 bg-gray-700 text-white rounded-md">
              <span className="mr-2">Font: {fontSize}px</span>
            </button>
            <div className="absolute top-full left-0 bg-white p-3 rounded-md shadow-lg z-50 mt-1 w-48">
              <input
                type="range"
                min="10"
                max="40"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1 text-center">
                {fontSize}px
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex bg-gray-700 rounded-lg p-1 gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`p-2 rounded-md ${
              historyIndex <= 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-500"
            }`}
            title="Undo"
          >
            <span className="text-lg">↩️</span>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-md ${
              historyIndex >= history.length - 1
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-500"
            }`}
            title="Redo"
          >
            <span className="text-lg">↪️</span>
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            title="Clear Canvas"
          >
            <span className="text-lg">🗑️</span>
          </button>
        </div>

        {/* Export button */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="Export"
          >
            <span className="text-lg">📷</span>
          </button>

          {showExportMenu && (
            <div className="absolute top-full left-0 bg-white p-2 rounded-md shadow-lg z-50 mt-1 w-48">
              <div className="text-sm font-medium text-gray-800 mb-2">
                Export Options
              </div>
              <button
                onClick={() => exportImage("low")}
                className="block w-full p-2 text-left hover:bg-gray-100 rounded-md text-sm"
              >
                📄 PNG (Standard)
              </button>
              <button
                onClick={() => exportImage("medium")}
                className="block w-full p-2 text-left hover:bg-gray-100 rounded-md text-sm"
              >
                📄 PNG (High Quality)
              </button>
              <button
                onClick={() => exportImage("high")}
                className="block w-full p-2 text-left hover:bg-gray-100 rounded-md text-sm"
              >
                📄 PNG (Ultra Quality)
              </button>
            </div>
          )}
        </div>

        {/* Current tool indicator */}
        <div className=" p-2 bg-gray-700 text-white rounded-md text-sm">
          Current:{" "}
          {tool === "pen"
            ? "Pen"
            : tool === "eraser"
            ? "Eraser"
            : tool === "highlighter"
            ? "Highlighter"
            : tool === "text"
            ? "Text"
            : tool === "rectangle"
            ? "Rectangle"
            : tool === "circle"
            ? "Circle"
            : "Arrow"}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 60}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          ref={stageRef}
          className="bg-white"
        >
          {/* Static layer (fixed content) */}
          <Layer listening={false}>
            {staticContent.map((item, i) => (
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
                onDblClick={() => handleTextDblClick(i)}
              />
            ))}
          </Layer>
        </Stage>

        {/* Text input overlay */}
        {showTextInput && (
          <div
            className="absolute bg-white p-3 rounded-md shadow-lg z-50 border border-gray-300"
            style={{ top: textPosition.y, left: textPosition.x }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text here"
              className="p-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") addText();
                if (e.key === "Escape") setShowTextInput(false);
              }}
            />
            <button
              onClick={addText}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Footer with instructions */}
      <div className="p-2 bg-gray-800 text-white text-sm flex justify-between items-center">
        <div>
          Draw with your mouse or touch. Double click text to edit. Select
          different tools from the toolbar.
        </div>
        <div className="text-xs opacity-75">Made with React + Konva</div>
      </div>
    </div>
  );
};

export default Board;
