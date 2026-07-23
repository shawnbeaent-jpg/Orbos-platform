'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Barcode/QR scanner using the browser Barcode Detection API when available, with a
 * dependable manual-entry fallback. Camera access requires HTTPS on mobile browsers.
 * A scan is assistive: the detected value is shown for the receiver to confirm — it is
 * never treated as proof of identity on its own.
 */
export function BarcodeScanner({ onDetected }: { onDetected: (value: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [manual, setManual] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'BarcodeDetector' in window);
  }, []);

  useEffect(() => {
    if (!scanning) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let cancelled = false;

    async function run() {
      try {
        const Detector = window.BarcodeDetector;
        if (!Detector) throw new Error('unsupported');
        const detector = new Detector();
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (cancelled) return;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const tick = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0 && codes[0]) {
              onDetected(codes[0].rawValue);
              setScanning(false);
              return;
            }
          } catch {
            // transient decode error; keep scanning
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setError('Camera unavailable. Enter the code manually.');
        setScanning(false);
      }
    }
    void run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [scanning, onDetected]);

  return (
    <div className="space-y-2">
      {supported ? (
        scanning ? (
          <div className="space-y-2">
            <video ref={videoRef} className="w-full rounded-md bg-black" muted playsInline aria-label="Barcode camera" />
            <button type="button" className="btn-secondary w-full" onClick={() => setScanning(false)}>
              Cancel scan
            </button>
          </div>
        ) : (
          <button type="button" className="btn-secondary w-full" onClick={() => setScanning(true)}>
            Scan barcode / QR
          </button>
        )
      ) : (
        <p className="text-xs text-steel-500">Scanning not supported on this device — enter the code manually.</p>
      )}

      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Enter SKU / UPC / code"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          aria-label="Manual barcode entry"
        />
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            if (manual.trim()) onDetected(manual.trim());
          }}
        >
          Use
        </button>
      </div>
      {error ? <p className="text-xs text-status-delayed">{error}</p> : null}
    </div>
  );
}
