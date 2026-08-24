import React, { useRef, useState, useEffect } from 'react';
import { Undo, Redo } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  
  // For undo/redo
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Fix resolution
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Save initial blank state
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialState]);
        setHistoryStep(0);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = lineWidth;
      }
    }
  }, [lineWidth]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (e.type !== 'mouseout') {
      e.preventDefault();
    }
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.closePath();
          // Save to history
          const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const newHistory = history.slice(0, historyStep + 1);
          newHistory.push(currentState);
          setHistory(newHistory);
          setHistoryStep(newHistory.length - 1);
        }
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(currentState);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
      }
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(history[newStep], 0, 0);
        }
      }
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(history[newStep], 0, 0);
        }
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl relative w-full max-w-[650px] animate-in fade-in zoom-in duration-200">
        
        {/* Canvas Area */}
        <div className="flex gap-2 sm:gap-4 mb-3 sm:mb-4">
          {/* Thickness slider (vertical) */}
          <div className="w-7 sm:w-8 flex flex-col items-center justify-center bg-gray-50 rounded-full py-2 sm:py-4 border border-gray-200 shadow-inner h-[200px] sm:h-[300px]">
             <input 
               type="range" 
               min="1" 
               max="10" 
               value={lineWidth} 
               onChange={(e) => setLineWidth(Number(e.target.value))}
               className="w-[160px] sm:w-[250px] -rotate-90 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-300 [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1e3a8a] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:-mt-1.5 cursor-pointer"
             />
          </div>

          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-inner relative h-[200px] sm:h-[300px]">
            <canvas
              ref={canvasRef}
              width={520}
              height={300}
              className="w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
            {historyStep <= 0 && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300 font-medium select-none text-sm sm:text-xl">
                Draw your signature here
              </div>
            )}
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={undo} 
              disabled={historyStep <= 0}
              title="Undo"
              className="w-10 sm:w-12 h-9 sm:h-10 flex items-center justify-center bg-[#e0e7ff] text-[#1e3a8a] rounded-lg border border-[#a5b4fc] disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              <Undo className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={redo} 
              disabled={historyStep >= history.length - 1}
              title="Redo"
              className="w-10 sm:w-12 h-9 sm:h-10 flex items-center justify-center bg-[#e0e7ff] text-[#1e3a8a] rounded-lg border border-[#a5b4fc] disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              <Redo className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="flex gap-2 sm:gap-3 ml-auto">
            <button 
              onClick={onCancel}
              className="px-3.5 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={clearCanvas}
              className="px-3.5 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#334155] hover:bg-[#1e293b] transition-colors shadow-sm cursor-pointer"
            >
              Clear
            </button>
            <button 
              onClick={handleSave}
              className="px-4 sm:px-8 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1e3a8a] hover:bg-[#152c6b] transition-colors shadow-sm cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
