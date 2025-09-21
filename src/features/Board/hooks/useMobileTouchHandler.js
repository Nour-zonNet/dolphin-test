import { useRef, useCallback } from 'react';

const useMobileTouchHandler = () => {
  const touchState = useRef({
    isDrawing: false,
    isScrolling: false,
    lastTouchTime: 0,
    touchStartPos: null,
    touchMoved: false,
    preventScroll: false
  });

  const handleTouchStart = useCallback((e, onMouseDown) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    // Prevent double-tap zoom
    if (now - touchState.current.lastTouchTime < 300) {
      e.preventDefault();
      return;
    }
    
    touchState.current.lastTouchTime = now;
    touchState.current.touchStartPos = {
      x: touch.clientX,
      y: touch.clientY,
      time: now
    };
    touchState.current.touchMoved = false;
    touchState.current.isScrolling = false;
    touchState.current.isDrawing = false;

    // Create a synthetic mouse event for drawing
    const mouseEvent = {
      target: e.target,
      preventDefault: () => e.preventDefault(),
      stopPropagation: () => e.stopPropagation(),
      getStage: () => e.target.getStage?.() || e.target,
      getPointerPosition: () => ({
        x: touch.clientX,
        y: touch.clientY
      })
    };

    // Start drawing immediately on touch start
    const result = onMouseDown(mouseEvent);
    if (result) {
      touchState.current.isDrawing = true;
      touchState.current.preventScroll = true;
    }
  }, []);

  const handleTouchMove = useCallback((e, onMouseMove) => {
    if (!touchState.current.touchStartPos) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchState.current.touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchState.current.touchStartPos.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // If touch moved more than 10px, consider it intentional movement
    if (distance > 10) {
      touchState.current.touchMoved = true;
      
      // Determine if this is scrolling or drawing based on movement pattern
      const isVerticalScroll = deltaY > deltaX && deltaY > 20;
      const isHorizontalScroll = deltaX > deltaY && deltaX > 20;
      
      if (isVerticalScroll || isHorizontalScroll) {
        touchState.current.isScrolling = true;
        touchState.current.isDrawing = false;
        touchState.current.preventScroll = false;
      } else if (touchState.current.isDrawing) {
        // Continue drawing
        e.preventDefault();
        const mouseEvent = {
          target: e.target,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          getStage: () => e.target.getStage?.() || e.target,
          getPointerPosition: () => ({
            x: touch.clientX,
            y: touch.clientY
          })
        };
        onMouseMove(mouseEvent);
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e, onMouseUp) => {
    if (touchState.current.isDrawing) {
      e.preventDefault();
      const mouseEvent = {
        target: e.target,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
        getStage: () => e.target.getStage?.() || e.target,
        getPointerPosition: () => ({
          x: touchState.current.touchStartPos?.x || 0,
          y: touchState.current.touchStartPos?.y || 0
        })
      };
      onMouseUp(mouseEvent);
    }
    
    // Reset touch state
    touchState.current.isDrawing = false;
    touchState.current.isScrolling = false;
    touchState.current.touchMoved = false;
    touchState.current.touchStartPos = null;
    touchState.current.preventScroll = false;
  }, []);

  const handleTouchCancel = useCallback((e, onMouseUp) => {
    if (touchState.current.isDrawing) {
      onMouseUp(e);
    }
    
    // Reset touch state
    touchState.current.isDrawing = false;
    touchState.current.isScrolling = false;
    touchState.current.touchMoved = false;
    touchState.current.touchStartPos = null;
    touchState.current.preventScroll = false;
  }, []);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    isDrawing: () => touchState.current.isDrawing,
    isScrolling: () => touchState.current.isScrolling
  };
};

export default useMobileTouchHandler;
