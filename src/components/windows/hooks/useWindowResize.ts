
import { useState, useRef, useEffect, RefObject } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

export function useWindowResize(
  windowRef: RefObject<HTMLDivElement>,
  position: Position,
  windowSize: WindowSize,
  setWindowSize: React.Dispatch<React.SetStateAction<WindowSize>>,
  setPosition: React.Dispatch<React.SetStateAction<Position>>,
  isMaximized: boolean
) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  
  const resizeHandlerRef = useRef<(e: MouseEvent) => void>(() => {});
  const stopResizeRef = useRef<() => void>(() => {});

  const startResize = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    
    const handleResize = (e: MouseEvent) => {
      if (!isResizing || isMaximized) return;
      
      const { clientX, clientY } = e;
      
      if (windowRef.current) {
        const rect = windowRef.current.parentElement?.getBoundingClientRect();
        if (!rect) return;
        
        let newWidth = windowSize.width;
        let newHeight = windowSize.height;
        let newPosX = position.x;
        let newPosY = position.y;
        
        if (direction.includes('right')) {
          newWidth = Math.max(300, clientX - rect.left - position.x);
        }
        
        if (direction.includes('bottom')) {
          newHeight = Math.max(200, clientY - rect.top - position.y);
        }
        
        if (direction.includes('left')) {
          const deltaX = clientX - rect.left - position.x;
          newWidth = Math.max(300, windowSize.width - deltaX);
          newPosX = position.x + deltaX;
        }
        
        if (direction.includes('top')) {
          const deltaY = clientY - rect.top - position.y;
          newHeight = Math.max(200, windowSize.height - deltaY);
          newPosY = position.y + deltaY;
        }
        
        setWindowSize({ width: newWidth, height: newHeight });
        setPosition({ x: newPosX, y: newPosY });
      }
    };
    
    const stopResize = () => {
      setIsResizing(false);
      setResizeDirection(null);
      document.removeEventListener('mousemove', resizeHandlerRef.current);
      document.removeEventListener('mouseup', stopResizeRef.current);
    };
    
    resizeHandlerRef.current = handleResize;
    stopResizeRef.current = stopResize;
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', resizeHandlerRef.current);
      document.removeEventListener('mouseup', stopResizeRef.current);
    };
  }, []);

  return {
    isResizing,
    setIsResizing,
    resizeDirection,
    setResizeDirection,
    startResize
  };
}
