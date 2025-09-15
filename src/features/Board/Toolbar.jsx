import React from 'react';
import {
  ToolSelector,
  ActionButtons,
  ExportButton,
  ToolIndicator,
  ImportPDFButton,
} from './components';

const Toolbar = ({
  tool,
  setTool,
  currentColor,
  setCurrentColor,
  strokeWidth,
  setStrokeWidth,
  fontSize,
  setFontSize,
  // canUndo,
  // canRedo,
  // onUndo,
  // onRedo,
  // onClear,
  onExport,
  onImportPDF,
}) => {
  return (
    <div className=" flex items-center  flex-wrap z-10 gap-2">
      <ToolSelector
        tool={tool}
        setTool={setTool}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onExport={onExport}
      />
      <ImportPDFButton onLoadPDF={onImportPDF} />
      
      {/* <ActionButtons
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        onClear={onClear}
      /> */}
      
      {/* <ToolIndicator tool={tool} /> */}
    </div>
  );
};

export default Toolbar;
