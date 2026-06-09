"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterProps {
  originalUrl: string;
  upscaledUrl: string;
  originalLabel?: string;
  upscaledLabel?: string;
}

export function BeforeAfter({
  originalUrl,
  upscaledUrl,
  originalLabel = "Original",
  upscaledLabel = "Upscaled",
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove]
  );

  // Global mouseup to stop dragging outside component
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [isDragging]);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border bg-muted/20 select-none"
        style={{ aspectRatio: "16/10", maxHeight: "500px" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* Upscaled (background) — shown on the LEFT side of the slider */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={upscaledUrl}
          alt="Upscaled"
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        {/* Original (foreground) — clipped on the RIGHT side of the slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Handle circle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-xl border-2 border-primary flex items-center justify-center">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l8 8-8 8" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div
          className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded"
          style={{ opacity: sliderPosition < 30 ? 0 : 1 }}
        >
          {upscaledLabel}
        </div>
        <div
          className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded"
          style={{ opacity: sliderPosition > 70 ? 0 : 1 }}
        >
          {originalLabel}
        </div>

        {/* Instruction */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
          ← Drag slider to compare →
        </div>
      </div>
    </div>
  );
}
