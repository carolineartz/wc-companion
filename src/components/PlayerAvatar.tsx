import { initials } from "@/lib/color";
import { cn } from "@/lib/utils";

/**
 * Player photo when we have one; otherwise initials on a gradient
 * (club colors for seeded players, neutral for live-feed names).
 */
export function PlayerAvatar({
  name,
  colors,
  photoUrl,
  className,
}: {
  name: string;
  colors?: [string, string];
  photoUrl?: string;
  className?: string;
}) {
  const base = cn(
    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg",
    className,
  );
  if (photoUrl) {
    return (
      <span className={cn(base, "bg-secondary")}>
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      </span>
    );
  }
  const [from, to] = colors ?? ["#4b5563", "#1f2937"];
  return (
    <span
      className={cn(base, "font-num text-xs font-bold text-white/90")}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {initials(name)}
    </span>
  );
}
