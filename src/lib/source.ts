// Two interchangeable data sources: the LIVE tournament (ESPN's public
// feed) and the frozen DEMO dataset (June 30 2026, used for design work
// and as a refuge when the feed is down). Pick demo with "?demo" in the URL.

import { GROUPS, MATCHES, MOCK_NOW } from "@/data/matches";
import { dumpRuntimeTeams, restoreRuntimeTeams } from "@/data/teams";
import { fetchScoreboard, fetchStandings, fetchSummary } from "@/lib/live/espn";
import {
  type MatchDetails,
  normalizeScoreboard,
  normalizeStandings,
  normalizeSummary,
} from "@/lib/live/normalize";
import { goldenBoot } from "@/lib/queries";
import type { BootEntry, Group, Match, Team } from "@/types";

export interface TournamentSnapshot {
  matches: Match[];
  groups: Group[];
  /** null = this source can't provide top scorers. */
  boot: BootEntry[] | null;
  fetchedAt: number;
}

export interface DataSource {
  kind: "live" | "demo";
  now(): Date;
  load(): Promise<TournamentSnapshot>;
  /** Extra per-match data (stats/lineups); null = already on the match. */
  matchDetails(id: string): Promise<MatchDetails | null>;
}

export function chooseSource(
  search: string = window.location.search,
): DataSource {
  return new URLSearchParams(search).has("demo") ? demoSource : liveSource;
}

/* --------------------------------------------------------------------- demo */

export const demoSource: DataSource = {
  kind: "demo",
  now: () => MOCK_NOW,
  load: async () => ({
    matches: MATCHES,
    groups: GROUPS,
    boot: goldenBoot().map((p) => ({
      playerId: p.id,
      name: p.name,
      teamCode: p.teamCode,
      club: p.clubId,
      goals: p.goals,
      assists: p.assists,
    })),
    fetchedAt: MOCK_NOW.getTime(),
  }),
  matchDetails: async () => null,
};

/* --------------------------------------------------------------------- live */

const CACHE_KEY = "companion.livecache.v1";

interface CachedSnapshot extends TournamentSnapshot {
  teams: Team[];
}

export const liveSource: DataSource = {
  kind: "live",
  now: () => new Date(),
  load: async () => {
    // Standings can fail independently of the scoreboard; don't let the
    // group tables take down the whole app.
    const [scoreboard, standings] = await Promise.all([
      fetchScoreboard(),
      fetchStandings().catch(() => null),
    ]);
    const snapshot: TournamentSnapshot = {
      matches: normalizeScoreboard(scoreboard),
      groups: standings ? normalizeStandings(standings) : [],
      boot: null, // no reliable free top-scorers feed yet
      fetchedAt: Date.now(),
    };
    if (snapshot.matches.length === 0) {
      throw new Error("Live feed returned no matches");
    }
    saveCache(snapshot);
    return snapshot;
  },
  matchDetails: async (id) => normalizeSummary(await fetchSummary(id)),
};

function saveCache(snapshot: TournamentSnapshot): void {
  try {
    const cached: CachedSnapshot = { ...snapshot, teams: dumpRuntimeTeams() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // storage full/blocked — cache is best-effort
  }
}

/** Last good live snapshot, for instant paint while the fresh fetch runs. */
export function loadCache(): TournamentSnapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedSnapshot;
    if (!Array.isArray(cached.matches)) return null;
    restoreRuntimeTeams(cached.teams ?? []);
    return cached;
  } catch {
    return null;
  }
}
