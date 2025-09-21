import { useEffect, useRef, useCallback } from 'react';

const useMemoryManager = () => {
  const canvasRefs = useRef(new Map());
  const imageCache = useRef(new Map());
  const maxCacheSize = 50; // Maximum number of cached images

  const cleanupCanvas = useCallback((canvasId) => {
    const canvas = canvasRefs.current.get(canvasId);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvasRefs.current.delete(canvasId);
    }
  }, []);

  const cleanupAllCanvases = useCallback(() => {
    canvasRefs.current.forEach((canvas, id) => {
      cleanupCanvas(id);
    });
  }, [cleanupCanvas]);

  const manageImageCache = useCallback((key, imageData) => {
    if (imageCache.current.size >= maxCacheSize) {
      // Remove oldest entry
      const firstKey = imageCache.current.keys().next().value;
      imageCache.current.delete(firstKey);
    }
    imageCache.current.set(key, imageData);
  }, []);

  const getCachedImage = useCallback((key) => {
    return imageCache.current.get(key);
  }, []);

  const clearImageCache = useCallback(() => {
    imageCache.current.clear();
  }, []);

  // Monitor memory usage
  useEffect(() => {
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = performance.memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
        
        // If using more than 80% of available memory, cleanup
        if (usedMB / limitMB > 0.8) {
          cleanupAllCanvases();
          clearImageCache();
        }
      }
    };

    const interval = setInterval(checkMemoryUsage, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [cleanupAllCanvases, clearImageCache]);

  return {
    cleanupCanvas,
    cleanupAllCanvases,
    manageImageCache,
    getCachedImage,
    clearImageCache
  };
};

export default useMemoryManager;
