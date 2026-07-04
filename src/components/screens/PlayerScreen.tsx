import { BackHeader } from "@/components/BackHeader";
import { ChipLink } from "@/components/ChipLink";
import { TeamBadge } from "@/components/TeamBadge";
import { getClub, getLeague, getPlayer } from "@/data/players";
import { getTeam } from "@/data/teams";
import type { Player } from "@/types";

export function PlayerScreen({ id }: { id: string }) {
  const player = getPlayer(id);
  if (!player) {
    return (
      <div>
        <BackHeader title="Player profile" />
        <p className="px-4 text-sm text-muted-foreground">
          We don&apos;t have this player yet. <a href="#/">Back to Today</a>.
        </p>
      </div>
    );
  }
  const team = getTeam(player.teamCode);
  const club = getClub(player.clubId);
  const league = club ? getLeague(club.leagueId) : undefined;

  return (
    <div className="pb-6">
      <BackHeader title="Player profile" />
      <div className="mx-4 rounded-2xl bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-2">
            <TeamBadge code={player.teamCode} />
            <span className="truncate font-display text-xl font-bold">
              {team.name}
            </span>
          </p>
          <p className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
            {player.position} ·{" "}
            <span className="font-num font-bold text-foreground">
              #{player.number}
            </span>
          </p>
        </div>

        {player.photoUrl ? (
          <div className="mt-4 overflow-hidden rounded-xl bg-secondary">
            <img
              src={player.photoUrl}
              alt={player.name}
              className="aspect-square w-full object-cover"
            />
          </div>
        ) : (
          <JerseyPanel player={player} />
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {club && (
            <ChipLink
              label={club.name}
              colors={club.colors}
              href={`#/club/${club.id}`}
            />
          )}
          {league && (
            <ChipLink
              label={league.name}
              colors={league.colors}
              href={`#/league/${league.id}`}
            />
          )}
        </div>

        <p className="mt-4 flex items-baseline gap-1.5 border-b border-border/60 pb-4 text-xs text-muted-foreground">
          <Stat value={player.apps} label="apps" tone="text-foreground" />
          <Stat value={player.goals} label="goals" tone="text-accent" />
          <Stat value={player.assists} label="assists" tone="text-primary" />
        </p>

        <p className="section-label mt-4 !text-gold">Headline</p>
        <p className="mt-2 text-sm leading-relaxed">{player.headline}</p>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: string;
}) {
  return (
    <>
      <span className={`font-num text-base font-bold ${tone}`}>{value}</span>
      <span className="mr-2">{label}</span>
    </>
  );
}

/** No photo? Render the shirt: surname + big squad number in team colors. */
function JerseyPanel({ player }: { player: Player }) {
  const team = getTeam(player.teamCode);
  return (
    <div
      className="mt-4 flex aspect-square w-full flex-col items-center justify-center rounded-xl"
      style={{ backgroundColor: "#f4f1ec" }}
    >
      <p
        className="font-display text-2xl font-bold tracking-[0.2em]"
        style={{ color: team.jersey.name }}
      >
        {player.surname}
      </p>
      <p
        className="font-num text-8xl font-bold leading-none"
        style={{ color: team.jersey.number }}
      >
        {player.number}
      </p>
    </div>
  );
}
