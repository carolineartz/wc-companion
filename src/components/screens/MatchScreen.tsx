import { useState } from "react";
import { BackHeader } from "@/components/BackHeader";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TeamBadge } from "@/components/TeamBadge";
import { getMatch } from "@/data/matches";
import { getClub, getPlayer } from "@/data/players";
import { getTeam } from "@/data/teams";
import { onColor } from "@/lib/color";
import { formatKickoff, untilKickoff } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Lineup, Match } from "@/types";

const TABS = ["Overview", "Lineups", "Stats"] as const;
type Tab = (typeof TABS)[number];

export function MatchScreen({ id }: { id: string }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const match = getMatch(id);
  if (!match) {
    return (
      <div>
        <BackHeader title="Match" />
        <p className="px-4 text-sm text-muted-foreground">
          Unknown match. <a href="#/">Back to Today</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <BackHeader
        title={match.stageLabel}
        subtitle={`${match.venue} · ${match.city}`}
      />
      <ScoreHeader match={match} />

      <div className="mx-4 mt-5 flex rounded-full bg-card p-1 text-xs">
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

      {tab === "Overview" && <OverviewTab match={match} />}
      {tab === "Lineups" && <LineupsTab match={match} />}
      {tab === "Stats" && <StatsTab match={match} />}
    </div>
  );
}

function TeamColumn({ code }: { code: string }) {
  const team = getTeam(code);
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-1.5">
      <span
        className="flex h-16 w-full items-center justify-center rounded-xl font-num text-base font-bold"
        style={{
          backgroundColor: team.kit.primary,
          color: onColor(team.kit.primary),
        }}
      >
        {team.code}
      </span>
      <span className="text-center text-sm leading-tight">{team.name}</span>
      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <KitSwatch colors={[team.kit.primary, team.kit.secondary]} />
        Home kit
      </span>
    </div>
  );
}

function ScoreHeader({ match }: { match: Match }) {
  const started = match.status !== "upcoming";
  return (
    <div className="flex items-start justify-between gap-2 px-6">
      <TeamColumn code={match.home} />
      <div className="flex-1 self-center pb-8 text-center">
        {started && match.score ? (
          <>
            <p className="font-num text-5xl font-bold tracking-wider">
              {match.score.home}
              <span className="mx-2 text-muted-foreground">:</span>
              {match.score.away}
            </p>
            <p className="mt-2 text-xs">
              {match.status === "live" ? (
                <span className="flex items-center justify-center gap-1.5 font-bold text-destructive">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
                  LIVE · {match.minute}&apos;
                </span>
              ) : (
                <span className="font-bold text-muted-foreground">
                  Full-time
                </span>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="font-num text-4xl font-bold text-primary">
              {formatKickoff(match.kickoff)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {untilKickoff(match.kickoff) || "Kick-off"}
            </p>
          </>
        )}
      </div>
      <TeamColumn code={match.away} />
    </div>
  );
}

function KitSwatch({ colors }: { colors: [string, string] }) {
  return (
    <span className="flex gap-px">
      {colors.map((c) => (
        <span key={c} className="h-2 w-2" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

/* ---------------------------------------------------------------- Overview */

function OverviewTab({ match }: { match: Match }) {
  const watch = (match.watch ?? [])
    .map((id) => getPlayer(id))
    .filter((p) => p !== undefined);
  return (
    <div className="px-4">
      {watch.length > 0 && (
        <>
          <p className="section-label mt-6">◎ Who to watch</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {watch.map((p) => (
              <a
                key={p.id}
                href={`#/player/${p.id}`}
                className="rounded-2xl bg-card p-3"
              >
                <div className="flex items-start justify-between">
                  <PlayerAvatar player={p} />
                  <span className="flex flex-col items-end gap-1">
                    <TeamBadge code={p.teamCode} size="sm" />
                    <span className="text-[10px] text-muted-foreground">
                      {p.position}
                    </span>
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold leading-tight">{p.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {getClub(p.clubId)?.name}
                </p>
                <p className="mt-3 flex gap-4 border-t border-border/60 pt-2 font-num text-sm font-bold">
                  <span>
                    {p.goals}
                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                      G
                    </span>
                  </span>
                  <span>
                    {p.assists}
                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                      A
                    </span>
                  </span>
                </p>
              </a>
            ))}
          </div>
        </>
      )}

      {match.winProb && <WinProbability match={match} />}

      {match.path && (
        <>
          <p className="section-label mt-6">Path to this point</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["home", "away"] as const).map((side) => (
              <div key={side} className="rounded-2xl bg-card p-3">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <TeamBadge code={match[side]} size="sm" />
                  {getTeam(match[side]).name}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {match.path?.[side].map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {(match.h2h || match.form) && (
        <div className="mt-6 rounded-2xl bg-card p-4">
          {match.h2h && (
            <>
              <p className="section-label">Head to head</p>
              <p className="mt-1.5 text-sm">{match.h2h}</p>
            </>
          )}
          {match.form && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="section-label">Recent form</p>
              {(["home", "away"] as const).map((side) => (
                <div key={side} className="flex items-center gap-2">
                  <TeamBadge code={match[side]} size="sm" />
                  <span className="flex gap-1.5">
                    {keyed(match.form?.[side] ?? []).map(({ key, value }) => (
                      <FormChip key={key} result={value} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Stable keys for short repeated-value lists like ["W","W","D"]. */
function keyed(values: string[]): { key: string; value: string }[] {
  return values.map((value, i) => ({ key: `${i}-${value}`, value }));
}

function FormChip({ result }: { result: string }) {
  const tone =
    result === "W"
      ? "bg-accent/20 text-accent"
      : result === "L"
        ? "bg-destructive/20 text-destructive"
        : "bg-secondary text-muted-foreground";
  return (
    <span
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded font-num text-[10px] font-bold",
        tone,
      )}
    >
      {result}
    </span>
  );
}

function WinProbability({ match }: { match: Match }) {
  const { home, away } = match;
  const prob = match.winProb;
  if (!prob) return null;
  const homeKit = getTeam(home).kit.primary;
  const awayKit = getTeam(away).kit.primary;
  return (
    <div className="mt-6 rounded-2xl bg-card p-4">
      <p className="section-label">Win probability</p>
      <div className="mt-3 flex items-baseline justify-between font-num text-sm font-bold">
        <span>
          {home} {prob.home}%
        </span>
        <span className="text-muted-foreground">D {prob.draw}%</span>
        <span>
          {prob.away}% {away}
        </span>
      </div>
      <div className="mt-2 flex h-2.5 gap-px overflow-hidden rounded-full">
        <span style={{ width: `${prob.home}%`, backgroundColor: homeKit }} />
        <span
          className="bg-muted-foreground/40"
          style={{ width: `${prob.draw}%` }}
        />
        <span style={{ width: `${prob.away}%`, backgroundColor: awayKit }} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Lineups */

function LineupsTab({ match }: { match: Match }) {
  if (!match.lineups) {
    return (
      <p className="px-4 pt-8 text-center text-sm text-muted-foreground">
        Lineups drop about an hour before kick-off.
      </p>
    );
  }
  const { home, away } = match.lineups;
  return (
    <div className="px-4">
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-b from-accent/15 via-accent/5 to-accent/15">
        {/* halfway line + center circle */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-foreground/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10" />

        <SideHeader code={match.away} formation={away.formation} />
        <FormationRows lineup={away} code={match.away} />
        <div className="h-6" />
        <FormationRows lineup={home} code={match.home} reversed />
        <SideHeader code={match.home} formation={home.formation} />
      </div>
    </div>
  );
}

function SideHeader({ code, formation }: { code: string; formation: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-bold">
        <TeamBadge code={code} size="sm" />
        {getTeam(code).name}
      </p>
      <p className="font-num text-xs text-muted-foreground">{formation}</p>
    </div>
  );
}

function FormationRows({
  lineup,
  code,
  reversed = false,
}: {
  lineup: Lineup;
  code: string;
  reversed?: boolean;
}) {
  const kit = getTeam(code).kit.primary;
  const rows = reversed ? [...lineup.rows].reverse() : lineup.rows;
  return (
    <div className="flex flex-col gap-3 px-2 pb-2">
      {rows.map((row) => (
        <div
          key={row.map((p) => p.num).join("-")}
          className="flex justify-around"
        >
          {row.map((p) => (
            <span
              key={p.num}
              className="flex items-center gap-1.5 rounded-full bg-background/60 py-1 pl-2 pr-2.5 text-[11px]"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: kit }}
              />
              <span className="font-num font-bold">{p.num}</span>
              {p.name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------- Stats */

function StatsTab({ match }: { match: Match }) {
  if (!match.stats) {
    return (
      <p className="px-4 pt-8 text-center text-sm text-muted-foreground">
        Stats appear once the match kicks off.
      </p>
    );
  }
  const s = match.stats;
  const rows: { label: string; values: [number, number]; decimals?: number }[] =
    [
      { label: "Possession", values: s.possession },
      { label: "Shots", values: s.shots },
      { label: "On target", values: s.onTarget },
      { label: "Expected goals (xG)", values: s.xg, decimals: 2 },
      { label: "Corners", values: s.corners },
      { label: "Fouls", values: s.fouls },
    ];
  const homeKit = getTeam(match.home).kit.primary;
  const awayKit = getTeam(match.away).kit.primary;

  return (
    <div className="px-4">
      <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-card p-4">
        {rows.map(({ label, values: [h, a], decimals = 0 }) => {
          const total = h + a || 1;
          const suffix = label === "Possession" ? "%" : "";
          return (
            <div key={label}>
              <div className="flex items-baseline justify-between">
                <span className="w-12 font-num text-sm font-bold">
                  {h.toFixed(decimals)}
                  {suffix}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="w-12 text-right font-num text-sm font-bold">
                  {a.toFixed(decimals)}
                  {suffix}
                </span>
              </div>
              <div className="mx-auto mt-1.5 flex h-1.5 w-2/3 gap-1">
                <span className="flex flex-1 justify-end">
                  <span
                    className="rounded-full"
                    style={{
                      width: `${(h / total) * 100}%`,
                      backgroundColor: homeKit,
                    }}
                  />
                </span>
                <span className="flex flex-1">
                  <span
                    className="rounded-full"
                    style={{
                      width: `${(a / total) * 100}%`,
                      backgroundColor: awayKit,
                    }}
                  />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {match.momentum && match.winProb && (
        <div className="mt-4 rounded-2xl bg-card p-4">
          <div className="flex items-baseline justify-between">
            <p className="section-label">{match.home} win-prob momentum</p>
            <p className="font-num text-sm font-bold text-accent">
              {match.winProb.home}%
            </p>
          </div>
          <Sparkline values={match.momentum} />
          <div className="mt-1 flex justify-between font-num text-[10px] text-muted-foreground">
            <span>KO</span>
            <span>HT</span>
            <span>{match.minute}&apos;</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 300;
  const h = 60;
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-16 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Win probability over time"
    >
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
