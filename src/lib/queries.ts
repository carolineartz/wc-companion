import { MATCHES } from "@/data/matches";
import { CLUBS, PLAYERS } from "@/data/players";
import type { Club, Match, Player, Profile, Round } from "@/types";
import { isToday } from "./time";

// Small derivation helpers so screens stay dumb. All of this is O(tiny)
// over seed data — no memoization needed.

/** The Golden Boot table: goals desc, then assists desc. */
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

export function liveMatches(): Match[] {
  return MATCHES.filter((m) => m.status === "live");
}

/**
 * Today's fixtures for the home screen: live first, then upcoming by
 * kick-off, with the user's teams floated to the top of the upcoming list.
 */
export function todaysMatches(favorites: string[] = []): Match[] {
  const today = MATCHES.filter((m) => isToday(m.kickoff));
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

/** The favorite team (if any) involved in a match, for "one of your teams". */
export function favoriteIn(match: Match, profile: Profile | null): string[] {
  if (!profile) return [];
  return [match.home, match.away].filter((c) => profile.teams.includes(c));
}

export function matchesInRound(round: Round): Match[] {
  return MATCHES.filter((m) => m.round === round).sort(
    (a, b) => a.slot - b.slot,
  );
}

/**
 * Bracket feeders: QF slot n is fed by R16 slots 2n / 2n+1, and so on.
 * Returns the (possibly unplayed) pairing label for a future slot,
 * e.g. ["BRA/MAR", "ARG/JPN"], or the winner code once decided.
 */
export function feederLabel(round: Round, slot: number): [string, string] {
  const prev: Record<Round, Round | null> = {
    R16: null,
    QF: "R16",
    SF: "QF",
    F: "SF",
  };
  const from = prev[round];
  if (!from) return ["TBD", "TBD"];
  const feeders = [slot * 2, slot * 2 + 1].map((s) => {
    const m = matchesInRound(from).find((x) => x.slot === s);
    if (!m) return "TBD";
    if (m.status === "ft" && m.score) {
      return m.score.home >= m.score.away ? m.home : m.away;
    }
    return `${m.home}/${m.away}`;
  });
  return [feeders[0], feeders[1]];
}
