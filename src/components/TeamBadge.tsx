import { getTeam } from "@/data/teams";
import { cn } from "@/lib/utils";

/** The little three-letter country chip ("BRA" on green). */
export function TeamBadge({
  code,
  size = "md",
  className,
}: {
  code: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const team = getTeam(code);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded font-num font-bold",
        size === "sm"
          ? "h-4 min-w-[1.9rem] px-1 text-[9px]"
          : "h-5 min-w-[2.3rem] px-1 text-[10px]",
        className,
      )}
      style={{ backgroundColor: team.badge.bg, color: team.badge.fg }}
    >
      {team.code}
    </span>
  );
}
