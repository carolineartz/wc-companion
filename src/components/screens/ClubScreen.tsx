import { ChevronRight } from "lucide-react";
import { BackHeader } from "@/components/BackHeader";
import { Monogram } from "@/components/Monogram";
import { PlayerRow } from "@/components/PlayerRow";
import { getClub, getLeague } from "@/data/players";
import { playersByClub } from "@/lib/queries";

export function ClubScreen({ id }: { id: string }) {
  const club = getClub(id);
  if (!club) {
    return (
      <div>
        <BackHeader title="Club" />
        <p className="px-4 text-sm text-muted-foreground">
          Unknown club. <a href="#/">Back to Today</a>.
        </p>
      </div>
    );
  }
  const league = getLeague(club.leagueId);
  const players = playersByClub(club.id);

  return (
    <div className="px-4 pb-6">
      <BackHeader title="Club" />
      <div className="flex items-center gap-4">
        <Monogram
          text={club.name}
          colors={club.colors}
          className="h-16 w-16 rounded-2xl text-lg"
        />
        <div>
          <h1 className="font-display text-2xl font-bold">{club.name}</h1>
          {league && (
            <a
              href={`#/league/${league.id}`}
              className="mt-1 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs"
            >
              {league.name}
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </a>
          )}
        </div>
      </div>

      <p className="section-label mt-6">
        At this World Cup · {players.length} player
        {players.length === 1 ? "" : "s"}
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {players.map((p) => (
          <PlayerRow key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}
