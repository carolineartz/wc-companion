import { useMemo, useState, type FormEvent } from "react";
import { ArrowDownUp } from "lucide-react";

import type { Player, Team } from "@/types";
import { getTeamColors } from "@/data/teamColors";
import { resolvePlayer } from "@/lib/resolvePlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MicButton } from "@/components/MicButton";

interface RosterProps {
  team: Team;
  onSelect: (player: Player) => void;
}

type SortDir = "asc" | "desc";

/**
 * The selected team's squad as a grid of KIT-NUMBER TILES — sortable by
 * number, with a number input to jump straight to a player. Tile tap and the
 * jump form both go through resolvePlayer (the same core action voice uses).
 */
export function Roster({ team, onSelect }: RosterProps) {
  const kit = useMemo(() => getTeamColors(team.id), [team.id]);
  const [sort, setSort] = useState<SortDir>("asc");
  const [jump, setJump] = useState("");
  const [jumpError, setJumpError] = useState<string | null>(null);

  const players = useMemo(() => {
    const sorted = [...team.players].sort((a, b) =>
      sort === "asc" ? a.number - b.number : b.number - a.number,
    );
    return sorted;
  }, [team.players, sort]);

  const handleJump = (e: FormEvent) => {
    e.preventDefault();
    const n = parseInt(jump, 10);
    if (Number.isNaN(n)) {
      setJumpError("Enter a number");
      return;
    }
    const player = resolvePlayer(team.id, n);
    if (!player) {
      setJumpError(`No #${n} on this squad`);
      return;
    }
    setJumpError(null);
    setJump("");
    onSelect(player);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <form onSubmit={handleJump} className="flex items-end gap-2">
          <div className="space-y-1">
            <label
              htmlFor="jump"
              className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              Jump to #
            </label>
            <Input
              id="jump"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="10"
              value={jump}
              onChange={(e) => {
                setJump(e.target.value.replace(/[^0-9]/g, ""));
                setJumpError(null);
              }}
              className="w-24 font-mono"
            />
          </div>
          <Button type="submit" variant="secondary">
            Go
          </Button>
          {jumpError && (
            <span className="pb-2 font-mono text-[11px] text-destructive">
              {jumpError}
            </span>
          )}
        </form>

        <div className="flex items-end gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortDir)}>
            <SelectTrigger className="w-[9.5rem]" aria-label="Sort order">
              <ArrowDownUp className="mr-1 h-4 w-4 opacity-60" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Number ↑</SelectItem>
              <SelectItem value="desc">Number ↓</SelectItem>
            </SelectContent>
          </Select>
          <MicButton teamId={team.id} onResolve={onSelect} />
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {players.map((player) => (
          <li key={player.number}>
            <button
              type="button"
              onClick={() => onSelect(player)}
              className="group flex h-full w-full flex-col items-start gap-1 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className="font-display text-4xl font-bold leading-none"
                style={{ color: kit.accent }}
              >
                {player.number}
              </span>
              <span className="mt-1 line-clamp-1 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                {player.name}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {player.position}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
