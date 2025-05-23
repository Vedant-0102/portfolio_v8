import React, { useState, useRef, useEffect } from 'react';
import { WindowType } from './types/WindowTypes';
import Draggable from 'react-draggable';
import { useWindowPosition } from './hooks/useWindowPosition';
import { useWindowResize } from './hooks/useWindowResize';
import { WindowHeader } from './window/WindowHeader';
import { WindowContent } from './window/WindowContent';
import { WindowResizeHandles } from './window/WindowResizeHandles';

interface WindowProps {
  window: WindowType;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

export const Window = ({ window, onClose, onMinimize, onFocus }: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowSize, setWindowSize] = useState({ 
    width: window.defaultSize?.width || 700, 
    height: window.defaultSize?.height || 500 
  });
  const [originalSize, setOriginalSize] = useState({ 
    width: window.defaultSize?.width || 700, 
    height: window.defaultSize?.height || 500 
  });
  
  const windowRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  
  const { position, setPosition, originalPosition, setOriginalPosition } = 
    useWindowPosition(window, windowSize);
  
  const { isResizing, setIsResizing, resizeDirection, setResizeDirection, 
    startResize } = useWindowResize(windowRef, position, windowSize, 
    setWindowSize, setPosition, isMaximized);

  useEffect(() => {
    if (window.isOpen && !window.isMinimized) {
      if (typeof globalThis.window !== 'undefined') {
        const screenWidth = globalThis.window.innerWidth;
        const screenHeight = globalThis.window.innerHeight;
        
        const centerX = Math.max(0, Math.min((screenWidth - windowSize.width) / 2, screenWidth - windowSize.width));
        const centerY = Math.max(0, Math.min((screenHeight - windowSize.height - 60) / 2, screenHeight - windowSize.height - 60));
        
        setPosition({x: centerX, y: centerY});
        setOriginalPosition({x: centerX, y: centerY});
      }
      
      if (windowRef.current) {
        windowRef.current.focus();
      }
    }
  }, [window.isOpen]);

  const handleMaximize = () => {
    if (!isMaximized) {
      setOriginalPosition(position);
      setOriginalSize({
        width: windowSize.width,
        height: windowSize.height
      });
      setIsMaximized(true);
    } else {
      setPosition(originalPosition);
      setIsMaximized(false);
    }
  };

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    if (!isMaximized) {
      const screenWidth = globalThis.window?.innerWidth || 1920;
      const screenHeight = globalThis.window?.innerHeight || 1080;
      
      const maxX = screenWidth - 100; 
      const maxY = screenHeight - 60;  
      const minX = -windowSize.width + 100; 
      
      const constrainedX = Math.max(minX, Math.min(maxX, data.x));
      const constrainedY = Math.max(0, Math.min(maxY, data.y));
      
      setPosition({ x: constrainedX, y: constrainedY });
      dragRef.current = { x: constrainedX, y: constrainedY };
    }
  };

  const handleDragStart = () => {
    onFocus();
  };

  if (!window.isOpen) return null;

  return (
    <Draggable
      handle=".window-header"
      disabled={isMaximized || isResizing}
      onStart={handleDragStart}
      onDrag={handleDrag}
      position={isMaximized ? { x: 0, y: 0 } : position}
      bounds="parent"
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={`win11-glass absolute animate-window-open ${isMaximized ? 'transition-all duration-200' : ''} ${window.isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{
          width: isMaximized ? '100%' : windowSize.width,
          height: isMaximized ? 'calc(100% - 48px)' : windowSize.height,
          left: isMaximized ? 0 : undefined,
          top: isMaximized ? 0 : undefined,
          zIndex: window.zIndex,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'opacity 0.2s ease-in-out',
          maxWidth: '100%',
          maxHeight: 'calc(100% - 48px)'
        }}
        onClick={onFocus}
        tabIndex={0}
      >
        <WindowHeader 
          title={window.title}
          icon={window.icon}
          isMaximizable={window.isMaximizable}
          isClosable={window.isClosable}
          onMinimize={onMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
        />
        
        <WindowContent windowRef={windowRef}>
          {window.content}
        </WindowContent>
        
        {}
        {!isMaximized && window.isResizable !== false && (
          <WindowResizeHandles startResize={startResize} />
        )}
      </div>
    </Draggable>
  );
};
