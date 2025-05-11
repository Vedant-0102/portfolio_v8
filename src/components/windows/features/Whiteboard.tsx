import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Brush, Undo, Save, RefreshCw, Square, MousePointer, Circle, Type, Bold, Italic, Underline, List } from 'lucide-react';

export const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'text' | 'select' | 'square' | 'circle'>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursorGuide, setShowCursorGuide] = useState(true);
  const [text, setText] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    size: 16,
    align: 'left' as CanvasTextAlign
  });
  const [shapePreview, setShapePreview] = useState<{ type: string; start: { x: number, y: number }; end: { x: number, y: number } } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const colorOptions = [
    '#000000', '#FFFFFF', '#FF0000', '#FFA500', 
    '#FFFF00', '#008000', '#0000FF', '#4B0082', 
    '#800080', '#FFC0CB', '#A52A2A', '#808080'
  ];

  // Initialize canvas with full screen size
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && toolbarRef.current) {
        const toolbarHeight = toolbarRef.current.clientHeight;
        const availableHeight = window.innerHeight - toolbarHeight;
        
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = availableHeight;

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = color;
          ctx.lineWidth = brushSize;
          setContext(ctx);

          // Fill with white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          // Save initial state
          const initialState = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
          setHistory([initialState]);
          setCurrentStep(0);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Update context when color or brush size changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      context.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
    }
  }, [color, brushSize, tool, context]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPosition({ x, y });

    if (tool === 'text') {
      setTextPosition({ x, y });
      setShowTextEditor(true);
      return;
    }

    if (tool === 'select') {
      return;
    }

    if (tool === 'square' || tool === 'circle') {
      setIsDrawing(true);
      setShapePreview({
        type: tool,
        start: { x, y },
        end: { x, y }
      });
      return;
    }

    setIsDrawing(true);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorPosition({ x, y });
    
    if (!isDrawing || !context) return;

    if (tool === 'square' || tool === 'circle') {
      setShapePreview({
        type: tool,
        start: startPosition,
        end: { x, y }
      });
      return;
    }

    if (tool === 'brush' || tool === 'eraser') {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const endDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !context || !isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (shapePreview && (tool === 'square' || tool === 'circle')) {
      const { start } = shapePreview;
      
      context.beginPath();
      
      if (tool === 'square') {
        const width = x - start.x;
        const height = y - start.y;
        context.rect(start.x, start.y, width, height);
      } else {
        const width = Math.abs(x - start.x);
        const height = Math.abs(y - start.y);
        const radiusX = width / 2;
        const radiusY = height / 2;
        const centerX = start.x + (x - start.x) / 2;
        const centerY = start.y + (y - start.y) / 2;
        context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      }
      
      context.stroke();
      setShapePreview(null);
    }

    setIsDrawing(false);
    
    if (canvasRef.current) {
      const newState = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const newHistory = history.slice(0, currentStep + 1);
      newHistory.push(newState);
      
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
    }
  };

  const updateCursorPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorPosition({ x, y });
  };

  const undo = () => {
    if (currentStep > 0 && context && canvasRef.current) {
      const newStep = currentStep - 1;
      context.putImageData(history[newStep], 0, 0);
      setCurrentStep(newStep);
    }
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const newState = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHistory([newState]);
      setCurrentStep(0);
    }
  };

  const saveCanvas = () => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = image;
      link.click();
    }
  };

  const addText = () => {
    if (!context || !text) return;

    let fontStyle = '';
    if (textStyle.bold) fontStyle += 'bold ';
    if (textStyle.italic) fontStyle += 'italic ';
    context.font = `${fontStyle}${textStyle.size}px Arial`;
    context.fillStyle = color;
    context.textAlign = textStyle.align;
    
    context.fillText(text, textPosition.x, textPosition.y);
    
    if (canvasRef.current) {
      const newState = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      const newHistory = history.slice(0, currentStep + 1);
      newHistory.push(newState);
      
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
    }
    
    setText('');
    setShowTextEditor(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
      <div ref={toolbarRef} className="flex flex-col bg-white border-b">
        <div className="flex justify-between items-center p-4">          
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setTool('brush')}
              title="Brush"
            >
              <Brush size={18} />
            </button>
            <button 
              className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setTool('eraser')}
              title="Eraser"
            >
              <Eraser size={18} />
            </button>
            <button 
              className={`p-2 rounded ${tool === 'text' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setTool('text')}
              title="Text"
            >
              <Type size={18} />
            </button>
            <button 
              className={`p-2 rounded ${tool === 'select' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setTool('select')}
              title="Select"
            >
              <MousePointer size={18} />
            </button>
            <button 
              className={`p-2 rounded ${tool === 'square' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setTool('square')}
              title="Square"
            >
              <Square size={18} />
            </button>
            <button 
              className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setTool('circle')}
              title="Circle"
            >
              <Circle size={18} />
            </button>
            <button 
              className="p-2 rounded hover:bg-gray-100"
              onClick={undo}
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button 
              className="p-2 rounded hover:bg-gray-100"
              onClick={clearCanvas}
              title="Clear"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              className="p-2 rounded hover:bg-gray-100"
              onClick={saveCanvas}
              title="Save"
            >
              <Save size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4 p-4 pt-0">
          <div className="flex space-x-2">
            {colorOptions.map(c => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: c, border: c === '#FFFFFF' ? '1px solid #ccc' : 'none' }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm">Size:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24"
            />
            <span>{brushSize}px</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={showCursorGuide}
              onChange={() => setShowCursorGuide(!showCursorGuide)}
              id="cursorGuide"
            />
            <label htmlFor="cursorGuide" className="text-sm">Show cursor guide</label>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 touch-none bg-white"
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
            draw(e);
            updateCursorPosition(e);
          }}
          onMouseUp={endDrawing}
          onMouseLeave={() => {
            setIsDrawing(false);
            setShapePreview(null);
          }}
        />
        
        {showCursorGuide && (
          <>
            <div 
              className="absolute border-t border-gray-400 pointer-events-none"
              style={{ 
                left: 0, 
                right: 0,
                top: cursorPosition.y,
                borderStyle: 'dashed'
              }}
            />
            <div 
              className="absolute border-l border-gray-400 pointer-events-none"
              style={{ 
                top: 0, 
                bottom: 0,
                left: cursorPosition.x,
                borderStyle: 'dashed'
              }}
            />
            <div 
              className="absolute bg-white border border-gray-400 rounded text-xs px-1 pointer-events-none"
              style={{ 
                top: cursorPosition.y + 8,
                left: cursorPosition.x + 8,
              }}
            >
              x: {Math.round(cursorPosition.x)}, y: {Math.round(cursorPosition.y)}
            </div>
          </>
        )}
        
        {shapePreview && (tool === 'square' || tool === 'circle') && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {tool === 'square' && (
              <rect
                x={Math.min(shapePreview.start.x, shapePreview.end.x)}
                y={Math.min(shapePreview.start.y, shapePreview.end.y)}
                width={Math.abs(shapePreview.end.x - shapePreview.start.x)}
                height={Math.abs(shapePreview.end.y - shapePreview.start.y)}
                stroke={color}
                strokeWidth={brushSize}
                fill="none"
                strokeDasharray="5,5"
              />
            )}
            {tool === 'circle' && (
              <ellipse
                cx={(shapePreview.start.x + shapePreview.end.x) / 2}
                cy={(shapePreview.start.y + shapePreview.end.y) / 2}
                rx={Math.abs(shapePreview.end.x - shapePreview.start.x) / 2}
                ry={Math.abs(shapePreview.end.y - shapePreview.start.y) / 2}
                stroke={color}
                strokeWidth={brushSize}
                fill="none"
                strokeDasharray="5,5"
              />
            )}
          </svg>
        )}
      </div>

      {showTextEditor && (
        <div className="bg-white border rounded-lg p-3 m-4 shadow-md absolute z-10">
          <div className="flex space-x-2 mb-2">
            <button
              className={`p-1 rounded ${textStyle.bold ? 'bg-gray-200' : ''}`}
              onClick={() => setTextStyle({...textStyle, bold: !textStyle.bold})}
            >
              <Bold size={16} />
            </button>
            <button
              className={`p-1 rounded ${textStyle.italic ? 'bg-gray-200' : ''}`}
              onClick={() => setTextStyle({...textStyle, italic: !textStyle.italic})}
            >
              <Italic size={16} />
            </button>
            <button
              className={`p-1 rounded ${textStyle.underline ? 'bg-gray-200' : ''}`}
              onClick={() => setTextStyle({...textStyle, underline: !textStyle.underline})}
            >
              <Underline size={16} />
            </button>
            <select
              value={textStyle.size}
              onChange={(e) => setTextStyle({...textStyle, size: parseInt(e.target.value)})}
              className="text-sm border rounded p-1"
            >
              {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="flex-1 border rounded p-1 text-sm"
              autoFocus
            />
            <button
              onClick={addText}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setShowTextEditor(false)}
              className="bg-gray-300 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};