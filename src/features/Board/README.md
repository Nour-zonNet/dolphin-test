# Board Component

A refactored drawing board component built with React and Konva, split into smaller, manageable components with enhanced toolbar behavior.

## Structure

```
Board/
├── components/           # Individual toolbar components
│   ├── ToolSelector.jsx     # Tool selection buttons with dropdowns
│   ├── ColorPicker.jsx      # Color selection (standalone + compact mode)
│   ├── StrokeWidthSlider.jsx # Stroke width control (standalone + compact mode)
│   ├── FontSizeSlider.jsx   # Font size control for text (always visible)
│   ├── ActionButtons.jsx     # Undo, redo, clear actions
│   ├── ExportButton.jsx      # Export functionality
│   ├── ToolIndicator.jsx     # Current tool display
│   └── index.js             # Component exports
├── hooks/                # Custom hooks
│   ├── useBoardHistory.js    # History management
│   ├── useCanvasDrawing.js   # Drawing functionality
│   └── index.js             # Hook exports
├── constants.js          # Static data and configuration
├── Board.jsx            # Main component (orchestrator)
├── Toolbar.jsx          # Toolbar container
├── Canvas.jsx           # Drawing canvas
├── TextInputOverlay.jsx # Text input overlay
├── Footer.jsx           # Instructions and credits
├── index.js             # Main exports
└── README.md            # This file
```

## Enhanced Toolbar Behavior

### 🛠️ Drawing Tools (Pen, Highlighter, Eraser)

When you click on a drawing tool button, a dropdown opens containing:

- **🎨 ColorPicker**: Compact color selection with visual preview
- **📏 StrokeWidthSlider**: Compact stroke width control (1-20px)

The dropdown automatically closes when:
- Clicking outside the dropdown
- Pressing the Escape key
- Selecting a different tool
- Clicking the close button (✕)

### ✍️ Text Tool

When the text tool is selected, the font size slider appears immediately without needing to click anything.

## Components

### Main Components

- **Board.jsx**: Main orchestrator component that manages state and coordinates between other components
- **Toolbar.jsx**: Container for all toolbar controls with enhanced behavior
- **Canvas.jsx**: Drawing area using Konva
- **TextInputOverlay.jsx**: Text input interface for adding text to canvas
- **Footer.jsx**: Instructions and credits

### Toolbar Components

- **ToolSelector.jsx**: Drawing tool selection with smart dropdowns for drawing tools
- **ColorPicker.jsx**: Color selection with visual preview (standalone + compact dropdown mode)
- **StrokeWidthSlider.jsx**: Line thickness control (standalone + compact dropdown mode)
- **FontSizeSlider.jsx**: Text size control (always visible when text tool is selected)
- **ActionButtons.jsx**: Undo, redo, and clear canvas actions
- **ExportButton.jsx**: Export canvas as PNG with quality options
- **ToolIndicator.jsx**: Shows currently selected tool

### Custom Hooks

- **useBoardHistory.js**: Manages undo/redo functionality and history state
- **useCanvasDrawing.js**: Handles mouse events and drawing logic

### Constants

- **constants.js**: Contains tool definitions, color palettes, static content, and export options

## Features

- **Enhanced Toolbar**: Smart dropdowns for drawing tools with integrated color and stroke width controls
- **Multiple Drawing Tools**: pen, eraser, highlighter, text, rectangle, circle, arrow
- **Smart Color Selection**: 12 predefined colors with visual preview and compact dropdown mode
- **Adjustable Stroke Width**: 1-20px range with compact slider in dropdowns
- **Immediate Font Size Control**: Font size slider appears instantly when text tool is selected
- **Undo/redo functionality**: Full history management
- **Canvas clearing**: With confirmation dialog
- **Export Options**: PNG export with multiple quality options
- **Touch Support**: Mobile device compatibility
- **Double-click Text Editing**: In-place text editing
- **Static Content**: Persists across canvas clears
- **Responsive Design**: Dropdowns automatically position to avoid going off-screen
- **Keyboard Navigation**: Escape key closes dropdowns
- **Click Outside**: Dropdowns close when clicking elsewhere

## Usage

```jsx
import { Board } from './components/ui/Board';

function App() {
  return (
    <div>
      <Board />
    </div>
  );
}
```

## Benefits of Enhanced Toolbar

1. **Better UX**: Drawing tools now have integrated settings in convenient dropdowns
2. **Cleaner Interface**: Font size control appears immediately for text tool
3. **Improved Workflow**: No need to navigate between separate controls for drawing tools
4. **Responsive Design**: Dropdowns automatically position to stay on-screen
5. **Accessibility**: Keyboard navigation and click-outside behavior
6. **Maintainability**: Each component has a single responsibility
7. **Reusability**: Components can be reused in other parts of the application
8. **Testability**: Smaller components are easier to test individually
9. **Readability**: Code is more organized and easier to understand
10. **Performance**: Better separation of concerns can lead to optimized re-renders
11. **Scalability**: Easier to add new features or modify existing ones

## Dependencies

- React
- react-konva (Konva for React)
- Tailwind CSS (for styling)
- Custom CSS for enhanced slider styling
