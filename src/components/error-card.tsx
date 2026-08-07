import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border-2 border-destructive/40 bg-destructive-soft p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-1 size-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
          <p className="text-sm leading-relaxed text-foreground">{message}</p>
          {onRetry ? (
            <Button type="button" onClick={onRetry} variant="outline" className="min-h-11 gap-2">
              <RefreshCw className="size-4" aria-hidden="true" />
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
