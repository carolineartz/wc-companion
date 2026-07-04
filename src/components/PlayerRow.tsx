import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TeamBadge } from "@/components/TeamBadge";
import { getTeam } from "@/data/teams";
import type { Player } from "@/types";

/** List row: avatar · name / position · nation ······ team badge. */
export function PlayerRow({ player }: { player: Player }) {
  const team = getTeam(player.teamCode);
  return (
    <a
      href={`#/player/${player.id}`}
      className="flex items-center gap-3 rounded-xl bg-card p-3"
    >
      <PlayerAvatar player={player} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{player.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {player.position} · {team.name}
        </span>
      </span>
      <TeamBadge code={player.teamCode} />
    </a>
  );
}
