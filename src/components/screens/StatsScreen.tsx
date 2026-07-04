import { useState } from "react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TeamBadge } from "@/components/TeamBadge";
import { GROUPS } from "@/data/matches";
import { getClub } from "@/data/players";
import { getTeam } from "@/data/teams";
import { goldenBoot } from "@/lib/queries";
import { cn } from "@/lib/utils";
import type { Group } from "@/types";

const TABS = ["Standings", "Golden Boot"] as const;
type Tab = (typeof TABS)[number];

export function StatsScreen() {
  const [tab, setTab] = useState<Tab>("Standings");
  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Tournament
      </h1>

      <div className="mt-4 flex rounded-full bg-card p-1 text-xs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-2 font-medium",
              tab === t
                ? "bg-secondary font-bold text-foreground"
                : "text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Standings" ? <Standings /> : <GoldenBoot />}
    </div>
  );
}

/* --------------------------------------------------------------- Standings */

function Standings() {
  return (
    <div className="flex flex-col gap-4 pb-6 pt-4">
      {GROUPS.map((g) => (
        <GroupCard key={g.name} group={g} />
      ))}
      <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <span className="h-3 w-3 rounded bg-accent/40" />
        Through to the knockout rounds · 12 groups total
      </p>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-display text-base font-bold">{group.name}</p>
        <p className="font-num text-[10px] text-muted-foreground">
          P · W-D-L · GD · PTS
        </p>
      </div>
      {group.rows.map((row, i) => (
        <div
          key={row.teamCode}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5",
            row.qualified && "bg-accent/10",
          )}
        >
          <span className="w-3 font-num text-xs text-muted-foreground">
            {i + 1}
          </span>
          <TeamBadge code={row.teamCode} />
          <span className="flex-1 truncate text-sm">
            {getTeam(row.teamCode).name}
          </span>
          <span className="font-num text-xs text-muted-foreground">
            {row.played} · {row.record} · {row.gd > 0 ? `+${row.gd}` : row.gd}
          </span>
          <span className="w-6 text-right font-num text-sm font-bold">
            {row.pts}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- Golden Boot */

function GoldenBoot() {
  const players = goldenBoot();
  return (
    <div className="flex flex-col gap-3 pb-6 pt-4">
      {players.map((p, i) => (
        <a
          key={p.id}
          href={`#/player/${p.id}`}
          className="flex items-center gap-3 rounded-2xl bg-card p-3"
        >
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-num text-xs font-bold",
              i === 0
                ? "bg-gold text-background"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {i + 1}
          </span>
          <PlayerAvatar player={p} />
          <TeamBadge code={p.teamCode} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{p.name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {getClub(p.clubId)?.name}
            </span>
          </span>
          <span className="text-right">
            <span className="block font-num text-lg font-bold">{p.goals}</span>
            <span className="block text-[10px] text-muted-foreground">
              {p.assists} assists
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
