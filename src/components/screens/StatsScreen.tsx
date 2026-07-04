import { useState } from "react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TeamBadge } from "@/components/TeamBadge";
import { getClub } from "@/data/players";
import { getTeam } from "@/data/teams";
import { useTournament } from "@/hooks/useTournament";
import { cn } from "@/lib/utils";
import type { BootEntry, Group } from "@/types";

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
  const t = useTournament();
  if (t.groups.length === 0) {
    return (
      <p className="pt-8 text-center text-sm text-muted-foreground">
        {t.loading
          ? "Loading standings…"
          : "Group tables aren't available right now."}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4 pb-6 pt-4">
      {t.groups.map((g) => (
        <GroupCard key={g.name} group={g} />
      ))}
      <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <span className="h-3 w-3 rounded bg-accent/40" />
        Through to the knockout rounds
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
  const t = useTournament();
  if (!t.boot) {
    return (
      <p className="px-2 pt-8 text-center text-sm text-muted-foreground">
        Top scorers aren&apos;t wired to the live feed yet — that list needs a
        stats source we haven&apos;t added. (It works in{" "}
        <a href="/?demo#/stats" className="underline">
          demo mode
        </a>
        .)
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3 pb-6 pt-4">
      {t.boot.map((entry, i) => (
        <BootRow
          key={`${entry.name}-${entry.teamCode}`}
          entry={entry}
          rank={i + 1}
        />
      ))}
    </div>
  );
}

function BootRow({ entry, rank }: { entry: BootEntry; rank: number }) {
  const club = entry.club ? getClub(entry.club) : undefined;
  const body = (
    <>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-num text-xs font-bold",
          rank === 1
            ? "bg-gold text-background"
            : "bg-secondary text-muted-foreground",
        )}
      >
        {rank}
      </span>
      <PlayerAvatar name={entry.name} colors={club?.colors} />
      <TeamBadge code={entry.teamCode} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{entry.name}</span>
        {club && (
          <span className="block truncate text-xs text-muted-foreground">
            {club.name}
          </span>
        )}
      </span>
      <span className="text-right">
        <span className="block font-num text-lg font-bold">{entry.goals}</span>
        <span className="block text-[10px] text-muted-foreground">
          {entry.assists} assists
        </span>
      </span>
    </>
  );
  const className = "flex items-center gap-3 rounded-2xl bg-card p-3";
  return entry.playerId ? (
    <a href={`#/player/${entry.playerId}`} className={className}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
