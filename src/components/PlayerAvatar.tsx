import { getClub } from "@/data/players";
import { initials } from "@/lib/color";
import { cn } from "@/lib/utils";
import type { Player } from "@/types";

/**
 * Player photo when we have one; otherwise initials on a gradient built
 * from the player's club colors (matches the mock treatment).
 */
export function PlayerAvatar({
  player,
  className,
}: {
  player: Player;
  className?: string;
}) {
  const base = cn(
    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg",
    className,
  );
  if (player.photoUrl) {
    return (
      <span className={cn(base, "bg-secondary")}>
        <img
          src={player.photoUrl}
          alt={player.name}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }
  const club = getClub(player.clubId);
  const [from, to] = club?.colors ?? ["#4b5563", "#1f2937"];
  return (
    <span
      className={cn(base, "font-num text-xs font-bold text-white/90")}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {initials(player.name)}
    </span>
  );
}
