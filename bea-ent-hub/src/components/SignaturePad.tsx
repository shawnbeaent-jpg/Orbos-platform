import React, { useRef, useState } from 'react';
import { Eraser } from 'lucide-react';

interface Props {
  onCapture: (dataUrl: string | null) => void;
}

const SignaturePad: React.FC<Props> = ({ onCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getContext = () => canvasRef.current?.getContext('2d') ?? null;

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const ctx = getContext();
    const p = getPoint(e);
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = getContext();
    const p = getPoint(e);
    if (!ctx) return;
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#D6A63C';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSignature(true);
  };

  const end = () => {
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas && hasSignature) onCapture(canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onCapture(null);
  };

  return (
    <div>
      <div className="rounded-lg border border-white/10 bg-midnight-900/70">
        <canvas
          ref={canvasRef}
          width={480}
          height={140}
          className="h-[140px] w-full cursor-crosshair touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[10px] text-charcoal-600">Sign with your mouse, trackpad, or touchscreen above.</p>
        <button type="button" onClick={clear} className="btn-ghost px-2.5 py-1 text-[11px]">
          <Eraser size={12} /> Clear
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
