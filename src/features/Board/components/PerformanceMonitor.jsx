import React, { useState, useEffect } from 'react';

const PerformanceMonitor = ({ isVisible = false }) => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    fps: 0,
    pageCount: 0,
    canvasCount: 0
  });

  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        let memoryUsage = 0;
        if ('memory' in performance) {
          memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }

        setMetrics(prev => ({
          ...prev,
          memoryUsage,
          fps
        }));
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded font-mono z-40 max-w-xs">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>Pages: {metrics.pageCount}</div>
      <div>Canvases: {metrics.canvasCount}</div>
    </div>
  );
};

export default PerformanceMonitor;
