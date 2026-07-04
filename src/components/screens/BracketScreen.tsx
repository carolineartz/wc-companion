import { TeamBadge } from "@/components/TeamBadge";
import { feederLabel, matchesInRound } from "@/lib/queries";
import { cn } from "@/lib/utils";
import type { Match, Round } from "@/types";

const ROUNDS: { round: Round; label: string; slots: number }[] = [
  { round: "R16", label: "Round of 16", slots: 8 },
  { round: "QF", label: "Quarter-finals", slots: 4 },
  { round: "SF", label: "Semi-finals", slots: 2 },
  { round: "F", label: "Final", slots: 1 },
];

export function BracketScreen() {
  return (
    <div className="pt-6">
      <header className="px-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Knockout bracket
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Round of 16 → Final · tap a fixture
        </p>
      </header>

      <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto px-4 pb-4">
        {ROUNDS.map(({ round, label, slots }) => (
          <div key={round} className="w-44 shrink-0">
            <p className="pb-3 text-center text-xs text-muted-foreground">
              {label}
            </p>
            <div className="flex flex-col" style={{ height: `${8 * 5.5}rem` }}>
              {slotIds(slots).map((slot) => (
                <div key={slot} className="flex flex-1 flex-col justify-center">
                  <BracketCard round={round} slot={slot} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** [0, 1, … n-1] — a slot number IS the bracket position, so it's a fine key. */
function slotIds(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

function BracketCard({ round, slot }: { round: Round; slot: number }) {
  const match = matchesInRound(round).find((m) => m.slot === slot);
  if (match) return <PlayedCard match={match} />;

  // No fixture yet — show who feeds this slot ("BRA/MAR", or a decided code).
  const [a, b] = feederLabel(round, slot);
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-3">
      <FeederLine label={a} />
      <div className="h-2" />
      <FeederLine label={b} />
    </div>
  );
}

function FeederLine({ label }: { label: string }) {
  const decided = /^[A-Z]{3}$/.test(label);
  return decided ? (
    <p className="flex items-center gap-2 text-xs font-bold">
      <TeamBadge code={label} size="sm" />
      TBD
    </p>
  ) : (
    <p className="text-center text-[11px] text-muted-foreground">{label}</p>
  );
}

function PlayedCard({ match }: { match: Match }) {
  const live = match.status === "live";
  return (
    <a
      href={`#/match/${match.id}`}
      className={cn(
        "block rounded-xl bg-card p-3",
        live ? "border border-destructive/60" : "border border-transparent",
      )}
    >
      {(["home", "away"] as const).map((side) => (
        <div key={side} className="flex items-center justify-between py-0.5">
          <TeamBadge code={match[side]} size="sm" />
          <span className="font-num text-sm font-bold">
            {match.score ? match.score[side] : ""}
          </span>
        </div>
      ))}
      <p
        className={cn(
          "pt-1 text-right font-num text-[10px]",
          live ? "font-bold text-destructive" : "text-muted-foreground",
        )}
      >
        {live ? "LIVE" : match.status === "ft" ? "FT" : ""}
      </p>
    </a>
  );
}
