# PDF Viewer Feature

A simple and reliable PDF viewing solution using iframe for displaying PDF documents from URLs.

## Components

### PDFViewer
Main component that combines URL input and PDF preview functionality.

### PDFIframeViewer
Displays PDF documents using iframe with responsive design and error handling.

### PDFURLInput
Input component for entering PDF URLs with validation and example loading.

## Usage

```jsx
import { PDFViewer, PDFViewerPage } from 'features/PDFViewer';

// Use the main viewer component
<PDFViewer 
  isVisible={true}
  isMobile={false}
  className="h-full"
/>

// Or use the full page
<PDFViewerPage />
```

## Features

- ✅ Load PDF from URL
- ✅ iframe-based display (simple and reliable)
- ✅ Responsive design
- ✅ Error handling
- ✅ Mobile support
- ✅ Local file testing
- ✅ No CORS issues (iframe approach)

## Dependencies

- React hooks for state management
- Tailwind CSS for styling
