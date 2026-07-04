// ESPN JSON -> our domain types. Everything here is defensive: the API is
// unofficial, so a missing/renamed field must degrade a section, never
// crash a screen. Keep assumptions small and local.

import { registerTeam } from "@/data/teams";
import type {
  Group,
  GroupRow,
  Lineup,
  Match,
  MatchStatus,
  Round,
  StatRow,
} from "@/types";

// biome-ignore lint/suspicious/noExplicitAny: raw third-party JSON boundary
type Raw = any;

/* ------------------------------------------------------------- scoreboard */

export function normalizeScoreboard(data: unknown): Match[] {
  const events: Raw[] = (data as Raw)?.events ?? [];
  const matches = events
    .map((e) => normalizeEvent(e))
    .filter((m): m is Match => m !== null)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  // Slot = kickoff order within each round; drives bracket layout.
  const counters = new Map<string, number>();
  for (const m of matches) {
    const key = m.round ?? "group";
    const n = counters.get(key) ?? 0;
    m.slot = n;
    counters.set(key, n + 1);
  }
  return matches;
}

function normalizeEvent(e: Raw): Match | null {
  try {
    const comp = e?.competitions?.[0];
    const competitors: Raw[] = comp?.competitors ?? [];
    const home = competitors.find((c) => c?.homeAway === "home");
    const away = competitors.find((c) => c?.homeAway === "away");
    if (!home?.team || !away?.team) return null;

    const homeCode = teamCode(home.team);
    const awayCode = teamCode(away.team);
    register(home.team);
    register(away.team);

    const state: string = e?.status?.type?.state ?? "pre";
    const status: MatchStatus =
      state === "in" ? "live" : state === "post" ? "ft" : "upcoming";

    const stageLabel: string =
      comp?.notes?.[0]?.headline ?? e?.season?.slug ?? "World Cup";

    const hasScore = status !== "upcoming";
    const shootout =
      home?.shootoutScore != null && away?.shootoutScore != null
        ? {
            home: Number(home.shootoutScore),
            away: Number(away.shootoutScore),
          }
        : undefined;

    return {
      id: String(e?.id ?? `${homeCode}-${awayCode}-${e?.date ?? ""}`),
      round: roundFromLabel(stageLabel),
      slot: 0, // assigned by normalizeScoreboard
      stageLabel,
      home: homeCode,
      away: awayCode,
      kickoff: e?.date ?? "",
      venue: comp?.venue?.fullName ?? "",
      city: comp?.venue?.address?.city ?? "",
      status,
      clock: status === "live" ? (e?.status?.displayClock ?? "") : undefined,
      period: status === "live" ? periodLabel(e?.status?.period) : undefined,
      score: hasScore
        ? { home: Number(home?.score ?? 0), away: Number(away?.score ?? 0) }
        : undefined,
      shootout,
      form:
        typeof home?.form === "string" && typeof away?.form === "string"
          ? {
              home: home.form.split("").slice(0, 5),
              away: away.form.split("").slice(0, 5),
            }
          : undefined,
    };
  } catch {
    return null;
  }
}

function teamCode(team: Raw): string {
  const abbr = team?.abbreviation ?? team?.shortDisplayName ?? "TBD";
  const name: string = team?.displayName ?? "";
  // ESPN renders undecided knockout slots as "TBD"-ish teams.
  if (/^tbd$/i.test(abbr) || /winner|loser|to be determined/i.test(name)) {
    return "TBD";
  }
  return String(abbr).toUpperCase();
}

function register(team: Raw): void {
  const code = teamCode(team);
  if (code === "TBD") return;
  registerTeam({
    code,
    name: team?.displayName ?? code,
    color: team?.color,
    alternateColor: team?.alternateColor,
    logo: team?.logo,
  });
}

function periodLabel(period: unknown): string | undefined {
  if (period === 1) return "1st half";
  if (period === 2) return "2nd half";
  if (period === 3 || period === 4) return "Extra time";
  if (period === 5) return "Penalties";
  return undefined;
}

export function roundFromLabel(label: string): Round | undefined {
  const l = label.toLowerCase();
  if (l.includes("round of 32")) return "R32";
  if (l.includes("round of 16")) return "R16";
  if (l.includes("quarter")) return "QF";
  if (l.includes("semi")) return "SF";
  if (l.includes("third place") || l.includes("3rd place")) return undefined;
  if (l.includes("final")) return "F";
  return undefined;
}

/* ---------------------------------------------------------------- summary */

export interface MatchDetails {
  stats?: StatRow[];
  lineups?: { home: Lineup; away: Lineup };
}

export function normalizeSummary(data: unknown): MatchDetails {
  return {
    stats: summaryStats(data as Raw),
    lineups: summaryLineups(data as Raw),
  };
}

// Ordered subset of ESPN stat names we know how to present.
const STAT_LABELS: [string, string][] = [
  ["possessionPct", "Possession"],
  ["totalShots", "Shots"],
  ["shotsOnTarget", "On target"],
  ["wonCorners", "Corners"],
  ["foulsCommitted", "Fouls"],
  ["offsides", "Offsides"],
  ["saves", "Saves"],
];

function summaryStats(data: Raw): StatRow[] | undefined {
  try {
    const teams: Raw[] = data?.boxscore?.teams ?? [];
    if (teams.length !== 2) return undefined;
    // boxscore.teams order is [away, home] on ESPN soccer; match by homeAway
    // when present, otherwise fall back to that convention.
    const byRole = (role: string) =>
      teams.find((t) => t?.homeAway === role) ??
      (role === "home" ? teams[1] : teams[0]);
    const home = byRole("home");
    const away = byRole("away");

    const value = (side: Raw, name: string): string | undefined => {
      const s = (side?.statistics ?? []).find((x: Raw) => x?.name === name);
      return s?.displayValue;
    };

    const rows: StatRow[] = [];
    for (const [name, label] of STAT_LABELS) {
      const h = value(home, name);
      const a = value(away, name);
      if (h == null || a == null) continue;
      const suffix = name === "possessionPct" ? "%" : "";
      const hn = Number.parseFloat(h);
      const an = Number.parseFloat(a);
      rows.push({
        label,
        home: `${h}${suffix}`,
        away: `${a}${suffix}`,
        homeShare:
          Number.isFinite(hn) && Number.isFinite(an) && hn + an > 0
            ? hn / (hn + an)
            : undefined,
      });
    }
    return rows.length > 0 ? rows : undefined;
  } catch {
    return undefined;
  }
}

function summaryLineups(data: Raw): { home: Lineup; away: Lineup } | undefined {
  try {
    const rosters: Raw[] = data?.rosters ?? [];
    const side = (role: string) => rosters.find((r) => r?.homeAway === role);
    const home = rosterToLineup(side("home"));
    const away = rosterToLineup(side("away"));
    if (!home || !away) return undefined;
    return { home, away };
  } catch {
    return undefined;
  }
}

function rosterToLineup(roster: Raw): Lineup | undefined {
  if (!roster) return undefined;
  const starters: Raw[] = (roster?.roster ?? []).filter((p: Raw) => p?.starter);
  if (starters.length === 0) return undefined;

  starters.sort(
    (a: Raw, b: Raw) =>
      Number(a?.formationPlace ?? 99) - Number(b?.formationPlace ?? 99),
  );
  const players = starters.map((p: Raw) => ({
    num: Number(p?.jersey ?? 0),
    name: p?.athlete?.shortName ?? p?.athlete?.displayName ?? "—",
  }));

  // "4-2-3-1" -> row sizes [1, 4, 2, 3, 1]; players are already GK-first.
  const formation: string = roster?.team?.formation ?? roster?.formation ?? "";
  const parts = formation
    .split("-")
    .map((n: string) => Number.parseInt(n, 10))
    .filter((n: number) => Number.isFinite(n) && n > 0);
  const sizes =
    parts.length > 0 && parts.reduce((a, b) => a + b, 0) === players.length - 1
      ? [1, ...parts]
      : chunkSizes(players.length);

  const rows = [];
  let i = 0;
  for (const size of sizes) {
    rows.push(players.slice(i, i + size));
    i += size;
  }
  return { formation: formation || `${players.length} starters`, rows };
}

/** Fallback rows-of-4 when we don't know the formation. */
function chunkSizes(total: number): number[] {
  const sizes = [];
  let left = total;
  while (left > 0) {
    const take = Math.min(4, left);
    sizes.push(take);
    left -= take;
  }
  return sizes;
}

/* -------------------------------------------------------------- standings */

export function normalizeStandings(data: unknown): Group[] {
  const children: Raw[] = (data as Raw)?.children ?? [];
  const groups: Group[] = [];
  for (const child of children) {
    try {
      const entries: Raw[] = child?.standings?.entries ?? [];
      if (entries.length === 0) continue;
      const rows: GroupRow[] = entries.map((entry: Raw) => {
        register(entry?.team);
        const stat = (name: string): number => {
          const s = (entry?.stats ?? []).find((x: Raw) => x?.name === name);
          return Number(s?.value ?? 0);
        };
        return {
          teamCode: teamCode(entry?.team),
          played: stat("gamesPlayed"),
          record: `${stat("wins")}-${stat("ties")}-${stat("losses")}`,
          gd: stat("pointDifferential") || stat("pointsDiff"),
          pts: stat("points"),
          qualified: Boolean(entry?.note) || stat("rank") <= 2,
        };
      });
      rows.sort((a, b) => b.pts - a.pts || b.gd - a.gd);
      groups.push({ name: child?.name ?? "Group", rows });
    } catch {
      // skip malformed group
    }
  }
  return groups;
}
