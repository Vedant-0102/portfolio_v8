
import { useState, useEffect } from 'react';
import { WindowType } from '../types/WindowTypes';

interface WindowSize {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

export function useWindowPosition(window: WindowType, windowSize: WindowSize) {
  // Center position calculation - improved to ensure windows are always visible
  const getCenterPosition = (): Position => {
    if (typeof globalThis.window !== 'undefined') {
      const screenWidth = globalThis.window.innerWidth;
      const screenHeight = globalThis.window.innerHeight;
      const defaultX = window.defaultPosition?.x;
      const defaultY = window.defaultPosition?.y;
      
      // Use default position if provided, otherwise center
      if (defaultX !== undefined && defaultY !== undefined) {
        return { 
          x: Math.max(0, Math.min(defaultX, screenWidth - windowSize.width)), 
          y: Math.max(0, Math.min(defaultY, screenHeight - windowSize.height - 60)) 
        };
      }
      
      // Center position calculation that ensures window is fully visible
      return { 
        x: Math.max(0, Math.min((screenWidth - windowSize.width) / 2, screenWidth - windowSize.width)), 
        y: Math.max(0, Math.min((screenHeight - windowSize.height) / 2, screenHeight - windowSize.height - 60)) 
      };
    }
    return { x: 100, y: 100 };
  };
  
  const [position, setPosition] = useState<Position>(getCenterPosition);
  const [originalPosition, setOriginalPosition] = useState<Position>(position);

  // Update position if window size changes
  useEffect(() => {
    if (window.isOpen && !window.isMinimized) {
      const centerPos = getCenterPosition();
      setPosition(centerPos);
      setOriginalPosition(centerPos);
    }
  }, [windowSize.width, windowSize.height, window.isOpen, window.isMinimized]);

  // Listen for window resize
  useEffect(() => {
    const handleScreenResize = () => {
      if (window.isOpen && !window.isMinimized) {
        const screenWidth = globalThis.window?.innerWidth || 1920;
        const screenHeight = globalThis.window?.innerHeight || 1080;
        
        // If window is now off screen after resize, bring it back into view
        let newPosX = position.x;
        let newPosY = position.y;
        
        if (newPosX + windowSize.width > screenWidth) {
          newPosX = Math.max(0, screenWidth - windowSize.width);
        }
        
        if (newPosY + windowSize.height > screenHeight - 60) {
          newPosY = Math.max(0, screenHeight - windowSize.height - 60);
        }
        
        if (newPosX !== position.x || newPosY !== position.y) {
          setPosition({ x: newPosX, y: newPosY });
        }
      }
    };
    
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.addEventListener('resize', handleScreenResize);
      return () => {
        globalThis.window.removeEventListener('resize', handleScreenResize);
      };
    }
    
    return undefined;
  }, [window.isOpen, window.isMinimized, position, windowSize]);

  return {
    position,
    setPosition,
    originalPosition,
    setOriginalPosition
  };
}
