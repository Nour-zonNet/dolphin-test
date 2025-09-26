import React, { useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import "../utils/pdfConfig"; // Import centralized PDF configuration

export default function PDFEditor() {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [setNumPages] = useState(0);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stack, setStack] = useState([]); // لحفظ كل رسم أو نص

  // تحميل PDF من ملف محلي
  useEffect(() => {
    fetch("/pdf.pdf") // ملف PDF في public folder
      .then((res) => res.arrayBuffer())
      .then((bytes) => setPdfBytes(bytes));
  }, []);

  // الرسم بالقلم
  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.lineCap = "round";
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    setStack((prev) => [
      ...prev,
      { type: "draw", x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
    ]);
  };

  // إضافة نصوص ديناميكي
  const addText = () => {
    const text = prompt("Enter text:");
    if (!text) return;
    const x = 100;
    const y = 100;
    const ctx = canvasRef.current.getContext("2d");
    ctx.font = "20px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(text, x, y);
    setStack((prev) => [...prev, { type: "text", text, x, y }]);
  };

  // إعادة رسم stack (لـ undo)
  const redraw = (newStack) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    newStack.forEach((item) => {
      if (item.type === "draw") {
        ctx.fillStyle = "red";
        ctx.fillRect(item.x, item.y, 2, 2); // نقاط صغيرة تمثل الرسم
      } else if (item.type === "text") {
        ctx.font = "20px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText(item.text, item.x, item.y);
      }
    });
  };

  const undo = () => {
    const newStack = [...stack];
    newStack.pop();
    setStack(newStack);
    redraw(newStack);
  };

  // حفظ PDF النهائي
 const savePDF = async () => {
  if (!pdfBytes) return;

  // نسخ الـ ArrayBuffer الأصلي
  const pdfCopy = pdfBytes.slice(0);

  const pdfDoc = await PDFDocument.load(pdfCopy);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // تحويل Canvas إلى PNG
  const pngDataUrl = canvasRef.current.toDataURL('image/png');
  const pngImage = await pdfDoc.embedPng(pngDataUrl);

  firstPage.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: firstPage.getWidth(),
    height: firstPage.getHeight(),
  });

  const editedPdfBytes = await pdfDoc.save();
  const blob = new Blob([editedPdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'edited.pdf';
  link.click();
};
  return (
    <div style={{ position: "relative", width: "800px" }}>
      {pdfBytes && (
        <Document
          file={pdfBytes}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={1} width={800} />
        </Document>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={1000}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "auto", // لازم للأحداث الماوس
          zIndex: 1,
        }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />

      <div
        style={{
          position: "relative", // أو fixed/top حسب الحاجة
          marginTop: "10px",
          zIndex: 2, // فوق الـ canvas
        }}
      >
        <button onClick={addText}>Add Text</button>
        <button onClick={undo}>Undo</button>
        <button onClick={savePDF}>Save PDF</button>
      </div>
    </div>
  );
}
