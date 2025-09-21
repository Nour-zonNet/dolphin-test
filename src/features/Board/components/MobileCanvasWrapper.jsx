import React, { useRef, useEffect, useCallback } from 'react';
import useMobileTouchHandler from '../hooks/useMobileTouchHandler';

const MobileCanvasWrapper = ({ 
  children, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  className = "",
  style = {},
  isMobile = false
}) => {
  const containerRef = useRef();
  const { 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    handleTouchCancel 
  } = useMobileTouchHandler();

  // Prevent default touch behaviors that interfere with drawing
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMobile) return;

    const preventDefault = (e) => {
      // Prevent zoom, scroll, and other touch behaviors during drawing
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
    };

    const preventContextMenu = (e) => {
      e.preventDefault(); // Prevent context menu on long press
    };

    // Add touch event listeners
    container.addEventListener('touchstart', preventDefault, { passive: false });
    container.addEventListener('touchmove', preventDefault, { passive: false });
    container.addEventListener('touchend', preventDefault, { passive: false });
    container.addEventListener('contextmenu', preventContextMenu);

    return () => {
      container.removeEventListener('touchstart', preventDefault);
      container.removeEventListener('touchmove', preventDefault);
      container.removeEventListener('touchend', preventDefault);
      container.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [isMobile]);

  const handleTouchStartWrapper = useCallback((e) => {
    // Handle zoom gestures first
    if (onTouchStart) {
      onTouchStart(e);
    }
    // Then handle drawing
    handleTouchStart(e, onMouseDown);
  }, [handleTouchStart, onMouseDown, onTouchStart]);

  const handleTouchMoveWrapper = useCallback((e) => {
    // Handle zoom gestures first
    if (onTouchMove) {
      onTouchMove(e);
    }
    // Then handle drawing
    handleTouchMove(e, onMouseMove);
  }, [handleTouchMove, onMouseMove, onTouchMove]);

  const handleTouchEndWrapper = useCallback((e) => {
    // Handle zoom gestures first
    if (onTouchEnd) {
      onTouchEnd(e);
    }
    // Then handle drawing
    handleTouchEnd(e, onMouseUp);
  }, [handleTouchEnd, onMouseUp, onTouchEnd]);

  const handleTouchCancelWrapper = useCallback((e) => {
    // Handle zoom gestures first
    if (onTouchEnd) {
      onTouchEnd(e);
    }
    // Then handle drawing
    handleTouchCancel(e, onMouseUp);
  }, [handleTouchCancel, onMouseUp, onTouchEnd]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        touchAction: isMobile ? 'none' : 'auto', // Prevent default touch behaviors
        userSelect: 'none', // Prevent text selection
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none', // Prevent callout on iOS
        WebkitTapHighlightColor: 'transparent', // Remove tap highlight
        overscrollBehavior: 'none', // Prevent overscroll
        position: 'relative',
        minHeight: isMobile ? '200px' : 'auto'
      }}
      onTouchStart={isMobile ? handleTouchStartWrapper : undefined}
      onTouchMove={isMobile ? handleTouchMoveWrapper : undefined}
      onTouchEnd={isMobile ? handleTouchEndWrapper : undefined}
      onTouchCancel={isMobile ? handleTouchCancelWrapper : undefined}
      onMouseDown={!isMobile ? onMouseDown : undefined}
      onMouseMove={!isMobile ? onMouseMove : undefined}
      onMouseUp={!isMobile ? onMouseUp : undefined}
    >
      {children}
    </div>
  );
};

export default MobileCanvasWrapper;
