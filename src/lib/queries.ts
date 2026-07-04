import { CLUBS, PLAYERS } from "@/data/players";
import type { Club, Match, Player, Profile, Round } from "@/types";
import { isToday } from "./time";

// Small derivation helpers so screens stay dumb. Match helpers take the
// active dataset (live or demo) as an argument; player/club/league helpers
// still read the seeded demo registry (no live equivalent yet).

/** The demo Golden Boot: goals desc, then assists desc. */
export function goldenBoot(limit = 10): Player[] {
  return Object.values(PLAYERS)
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, limit);
}

/** Everyone at this World Cup from one club (cross-national). */
export function playersByClub(clubId: string): Player[] {
  return Object.values(PLAYERS)
    .filter((p) => p.clubId === clubId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Clubs in a league that have at least one player here, with their players. */
export function clubsInLeague(
  leagueId: string,
): { club: Club; players: Player[] }[] {
  return Object.values(CLUBS)
    .filter((c) => c.leagueId === leagueId)
    .map((club) => ({ club, players: playersByClub(club.id) }))
    .filter(({ players }) => players.length > 0)
    .sort((a, b) => b.players.length - a.players.length);
}

export function liveMatches(matches: Match[]): Match[] {
  return matches.filter((m) => m.status === "live");
}

/**
 * Today's fixtures for the home screen: live first, then upcoming with the
 * user's teams floated up, then by kick-off; finished matches last.
 */
export function todaysMatches(
  matches: Match[],
  favorites: string[],
  now: Date,
): Match[] {
  const today = matches.filter((m) => isToday(m.kickoff, now));
  const involvesFavorite = (m: Match) =>
    favorites.includes(m.home) || favorites.includes(m.away) ? 0 : 1;
  const rank = { live: 0, upcoming: 1, ft: 2 } as const;
  return today.sort(
    (a, b) =>
      rank[a.status] - rank[b.status] ||
      involvesFavorite(a) - involvesFavorite(b) ||
      a.kickoff.localeCompare(b.kickoff),
  );
}

/** The next day (after `now`) that has fixtures, for quiet rest days. */
export function nextMatchday(matches: Match[], now: Date): Match[] {
  const upcoming = matches
    .filter((m) => m.status === "upcoming" && !isToday(m.kickoff, now))
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  if (upcoming.length === 0) return [];
  const firstDay = new Date(upcoming[0].kickoff);
  return upcoming.filter((m) => isToday(m.kickoff, firstDay));
}

/** The favorite team (if any) involved in a match, for "one of your teams". */
export function favoriteIn(match: Match, profile: Profile | null): string[] {
  if (!profile) return [];
  return [match.home, match.away].filter((c) => profile.teams.includes(c));
}

export function matchesInRound(matches: Match[], round: Round): Match[] {
  return matches
    .filter((m) => m.round === round)
    .sort((a, b) => a.slot - b.slot);
}

/**
 * Bracket feeders for rounds with no scheduled fixture yet: QF slot n is
 * fed by R16 slots 2n / 2n+1, and so on. Returns pairing labels
 * ("BRA/MAR") or the winner's code once a feeder is decided.
 */
export function feederLabel(
  matches: Match[],
  round: Round,
  slot: number,
): [string, string] {
  const prev: Record<Round, Round | null> = {
    R32: null,
    R16: "R32",
    QF: "R16",
    SF: "QF",
    F: "SF",
  };
  const from = prev[round];
  if (!from) return ["TBD", "TBD"];
  const feeders = [slot * 2, slot * 2 + 1].map((s) => {
    const m = matchesInRound(matches, from).find((x) => x.slot === s);
    if (!m) return "TBD";
    if (m.status === "ft" && m.score) {
      return winnerOf(m);
    }
    return `${m.home}/${m.away}`;
  });
  return [feeders[0], feeders[1]];
}

/** Winner's team code, shootout-aware. */
export function winnerOf(match: Match): string {
  const { score, shootout } = match;
  if (!score) return "TBD";
  if (score.home !== score.away) {
    return score.home > score.away ? match.home : match.away;
  }
  if (shootout) {
    return shootout.home > shootout.away ? match.home : match.away;
  }
  return "TBD";
}
