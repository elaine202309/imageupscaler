"use client";

import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  imageUrl?: string; // For server-uploaded images
}

export function ImagePreview({ file, onRemove, imageUrl }: ImagePreviewProps) {
  const src = imageUrl || URL.createObjectURL(file);

  return (
    <div className="relative group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={file.name}
        className="w-full max-h-[400px] object-contain rounded-xl border bg-muted/20"
      />
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="shadow-lg"
        >
          Remove
        </Button>
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm font-medium truncate max-w-md mx-auto">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(file.size)} • {file.type}
        </p>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
