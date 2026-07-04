import { ChevronRight } from "lucide-react";
import { BackHeader } from "@/components/BackHeader";
import { Monogram } from "@/components/Monogram";
import { PlayerRow } from "@/components/PlayerRow";
import { getLeague } from "@/data/players";
import { clubsInLeague } from "@/lib/queries";

export function LeagueScreen({ id }: { id: string }) {
  const league = getLeague(id);
  if (!league) {
    return (
      <div>
        <BackHeader title="League" />
        <p className="px-4 text-sm text-muted-foreground">
          Unknown league. <a href="#/">Back to Today</a>.
        </p>
      </div>
    );
  }
  const clubs = clubsInLeague(league.id);
  const playerCount = clubs.reduce((n, c) => n + c.players.length, 0);

  return (
    <div className="px-4 pb-6">
      <BackHeader title="League" />
      <div className="flex items-center gap-4">
        <Monogram
          text={league.name}
          colors={league.colors}
          className="h-16 w-16 rounded-2xl text-lg"
        />
        <div>
          <h1 className="font-display text-2xl font-bold">{league.name}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {playerCount} players · {clubs.length} clubs
          </p>
        </div>
      </div>

      <p className="section-label mt-6">Who&apos;s here · by club</p>
      <div className="mt-3 flex flex-col gap-3">
        {clubs.map(({ club, players }) => (
          <div key={club.id}>
            <a
              href={`#/club/${club.id}`}
              className="flex items-center gap-2 px-1 py-2"
            >
              <Monogram text={club.name} colors={club.colors} />
              <span className="flex-1 text-sm font-bold">{club.name}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
            <div className="flex flex-col gap-2">
              {players.map((p) => (
                <PlayerRow key={p.id} player={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
