
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  onDoubleClick: () => void;
  id: string;
}

export const DesktopIcon = ({ label, icon, onClick, onDoubleClick, id }: DesktopIconProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Load saved position from localStorage on mount
  useEffect(() => {
    const savedPositions = localStorage.getItem('win11-icon-positions');
    if (savedPositions) {
      try {
        const positions = JSON.parse(savedPositions);
        if (positions[id]) {
          setPosition(positions[id]);
        }
      } catch (error) {
        console.error("Error loading icon positions:", error);
      }
    }
  }, [id]);
  
  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    
    // Save position to localStorage
    try {
      const savedPositions = localStorage.getItem('win11-icon-positions');
      const positions = savedPositions ? JSON.parse(savedPositions) : {};
      
      positions[id] = newPosition;
      localStorage.setItem('win11-icon-positions', JSON.stringify(positions));
    } catch (error) {
      console.error("Error saving icon positions:", error);
    }
  };
  
  return (
    <Draggable
      position={position}
      onStop={handleDragStop}
      bounds="parent"
      nodeRef={nodeRef}
      grid={[10, 10]} // Make movement less floaty by snapping to a grid
    >
      <div 
        ref={nodeRef}
        className="flex flex-col items-center w-24 h-24 p-2 rounded hover:bg-white/10 cursor-pointer select-none"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <div className="h-12 w-12 flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement, { 
            size: 36,
            className: "text-white drop-shadow-md" 
          })}
        </div>
        <p className="text-sm text-white font-medium mt-1 text-center leading-tight drop-shadow-md line-clamp-2">
          {label}
        </p>
      </div>
    </Draggable>
  );
};
