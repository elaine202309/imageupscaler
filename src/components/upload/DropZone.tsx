"use client";

import { useCallback, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/types";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`Unsupported format. Please use ${ALLOWED_EXTENSIONS.join(", ")}.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); if (!disabled) setIsDragging(true); }, [disabled]);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  }, [disabled, validateAndSelect]);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    e.target.value = "";
  };

  return (
    <div className="w-full">
      <div
        onClick={disabled ? undefined : handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          border-2 border-dashed rounded-3xl p-14 transition-all duration-300
          ${isDragging
            ? "border-purple-400 bg-purple-50/50 scale-[1.01] shadow-lg shadow-purple-500/10"
            : "border-muted-foreground/20 hover:border-purple-300 hover:bg-purple-50/30"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          glass
        `}
      >
        <input ref={inputRef} type="file" accept={ALLOWED_EXTENSIONS.join(",")} onChange={handleChange} className="hidden" />

        {/* Decorative icons */}
        <div className="mb-5 relative">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse-glow" style={{ background: "var(--gradient-primary)" }}>
            <UploadIcon className="w-9 h-9 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Drag & drop your image here</h3>
        <p className="text-sm text-muted-foreground mb-5">or click to browse — PNG, JPG, WEBP, HEIC up to 25MB</p>

        <Button variant="outline" type="button" disabled={disabled} className="rounded-xl px-8">
          Choose Image
        </Button>

        {error && (
          <p className="mt-4 text-sm text-red-500 font-medium bg-red-50 px-3 py-1.5 rounded-lg">{error}</p>
        )}
      </div>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}
