import { ChevronLeft } from "lucide-react";
import { back } from "@/lib/router";

/** "‹  Player profile" header used by every pushed screen. */
export function BackHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pb-4 pt-5">
      <button
        type="button"
        aria-label="Back"
        onClick={back}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
