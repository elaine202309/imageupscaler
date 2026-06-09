"use client";

interface ProgressIndicatorProps {
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

export function ProgressIndicator({ status, error }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      {status === "processing" && (
        <>
          <Spinner />
          <p className="text-sm font-medium">Processing your image...</p>
          <p className="text-xs text-muted-foreground">
            This usually takes 10–30 seconds depending on image size.
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <ErrorIcon className="w-10 h-10 text-destructive" />
          <p className="text-sm font-medium text-destructive">Upscale failed</p>
          {error && (
            <p className="text-xs text-muted-foreground max-w-md text-center">
              {error}
            </p>
          )}
        </>
      )}

      {status === "completed" && (
        <>
          <CheckIcon className="w-10 h-10 text-green-500" />
          <p className="text-sm font-medium text-green-600">Upscale complete!</p>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
