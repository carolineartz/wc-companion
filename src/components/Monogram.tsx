import { cn } from "@/lib/utils";

/**
 * Stand-in for club/league crests we don't have assets for: a gradient
 * tile with a 1–2 letter monogram. Swap for real crest images later.
 */
export function Monogram({
  text,
  colors,
  className,
}: {
  text: string;
  colors: [string, string];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-num text-[9px] font-bold uppercase text-white/90",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      }}
    >
      {text.slice(0, 2)}
    </span>
  );
}
