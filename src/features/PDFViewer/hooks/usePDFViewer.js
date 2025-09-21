import { useState, useEffect, useCallback } from 'react';

const usePDFViewer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const getOptimalScale = useCallback((pdfWidth, pdfHeight) => {
    const { width: screenWidth, height: screenHeight } = screenSize;
    const availableWidth = screenWidth - 32; // Account for padding
    const availableHeight = screenHeight - 200; // Account for header and controls
    
    const scaleX = availableWidth / pdfWidth;
    const scaleY = availableHeight / pdfHeight;
    
    return Math.min(scaleX, scaleY, 1); // Don't scale up beyond original size
  }, [screenSize]);

  const getPageDimensions = useCallback((pdfWidth, pdfHeight) => {
    const scale = getOptimalScale(pdfWidth, pdfHeight);
    return {
      width: pdfWidth * scale,
      height: pdfHeight * scale,
      scale
    };
  }, [getOptimalScale]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    getOptimalScale,
    getPageDimensions
  };
};

export default usePDFViewer;
