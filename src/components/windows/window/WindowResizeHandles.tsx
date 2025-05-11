
import React from 'react';

interface WindowResizeHandlesProps {
  startResize: (direction: string, e: React.MouseEvent) => void;
}

export const WindowResizeHandles: React.FC<WindowResizeHandlesProps> = ({ startResize }) => {
  return (
    <>
      <div
        className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
        onMouseDown={(e) => startResize('top-left', e)}
      />
      <div
        className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
        onMouseDown={(e) => startResize('top-right', e)}
      />
      <div
        className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
        onMouseDown={(e) => startResize('bottom-left', e)}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
        onMouseDown={(e) => startResize('bottom-right', e)}
      />
      <div
        className="absolute top-0 left-3 right-3 h-2 cursor-n-resize"
        onMouseDown={(e) => startResize('top', e)}
      />
      <div
        className="absolute bottom-0 left-3 right-3 h-2 cursor-s-resize"
        onMouseDown={(e) => startResize('bottom', e)}
      />
      <div
        className="absolute left-0 top-3 bottom-3 w-2 cursor-w-resize"
        onMouseDown={(e) => startResize('left', e)}
      />
      <div
        className="absolute right-0 top-3 bottom-3 w-2 cursor-e-resize"
        onMouseDown={(e) => startResize('right', e)}
      />
    </>
  );
};
