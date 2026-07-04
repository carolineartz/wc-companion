// Shared domain types for the WC Companion prototype.
// Everything is mock data for now (frozen at June 30, 2026 — Round of 16);
// the shapes are meant to survive a later swap to a live football API.

export interface Team {
  code: string; // "BRA"
  name: string; // "Brazil"
  /** Small flag-ish badge chip: solid background + text color. */
  badge: { bg: string; fg: string };
  /**
   * Kit colors, used wherever a team appears in a MATCH context (hero card,
   * score header swatches, win-prob bar, lineup dots) — deliberately the kit,
   * not the flag/identity color.
   */
  kit: { primary: string; secondary: string };
  /** Jersey-panel colors for the no-photo player profile (name / number). */
  jersey: { name: string; number: string };
  /** Crest image URL when a live data source provides one. */
  logo?: string;
}

export interface Club {
  id: string; // "ac-milan"
  name: string; // "AC Milan"
  leagueId: string; // "serie-a"
  /** Two-stop gradient for the club dot/monogram. */
  colors: [string, string];
}

export interface League {
  id: string; // "serie-a"
  name: string; // "Serie A"
  colors: [string, string];
}

export interface Player {
  id: string; // "pulisic"
  name: string; // "Christian Pulisic"
  /** Shirt name for the jersey panel ("REIJNDERS"). */
  surname: string;
  teamCode: string;
  number: number;
  position: string; // free text: "Winger", "Box-to-box Mid"…
  clubId: string;
  apps: number;
  goals: number;
  assists: number;
  /** One-line scouting blurb shown under HEADLINE on the profile. */
  headline: string;
  /** Optional real photo; falls back to the jersey panel / initials. */
  photoUrl?: string;
}

export type MatchStatus = "upcoming" | "live" | "ft";
export type Round = "R32" | "R16" | "QF" | "SF" | "F";

/** One line of a formation, top of the pitch = first row. */
export type LineupRow = { num: number; name: string }[];

export interface Lineup {
  formation: string; // "4-3-3"
  rows: LineupRow[]; // GK first
}

/** One comparative stat line ("58% · Possession · 42%"). */
export interface StatRow {
  label: string;
  home: string; // display values — live feeds mix ints, floats and %s
  away: string;
  homeShare?: number; // 0–1 for the bar; omitted = no bar
}

export interface Match {
  id: string; // live: ESPN event id; demo: "r16-bra-mar"
  /** Knockout round for the bracket; undefined = group stage. */
  round?: Round;
  /** Position within the round, 0-based top→bottom; drives the bracket. */
  slot: number;
  stageLabel: string; // "Round of 16", "Group A"
  home: string; // team code
  away: string;
  kickoff: string; // ISO
  venue: string;
  city: string;
  status: MatchStatus;
  /** Display clock while live ("67'", "45'+2"). */
  clock?: string;
  period?: string; // "2nd half"
  score?: { home: number; away: number };
  shootout?: { home: number; away: number };
  /** Player ids surfaced as "Who to watch" (demo only for now). */
  watch?: string[];
  winProb?: { home: number; draw: number; away: number };
  /** Home win-prob over time (0–100), KO→now, for the momentum sparkline. */
  momentum?: number[];
  stats?: StatRow[];
  lineups?: { home: Lineup; away: Lineup };
  /** Short "path to this point" lines per side. */
  path?: { home: string[]; away: string[] };
  h2h?: string; // "BRA 3W · 1D · 1L in last 5"
  form?: { home: string[]; away: string[] }; // ["W","W","D"] most recent first
}

/** A Golden Boot row; `playerId` links into the player registry when known. */
export interface BootEntry {
  playerId?: string;
  name: string;
  teamCode: string;
  club?: string;
  goals: number;
  assists: number;
}

export interface GroupRow {
  teamCode: string;
  played: number;
  record: string; // "2-1-0" (W-D-L)
  gd: number;
  pts: number;
  qualified: boolean;
}

export interface Group {
  name: string; // "Group D"
  rows: GroupRow[]; // already in table order
}

/** Persisted user profile (localStorage key "companion.profile.v2"). */
export interface Profile {
  name: string;
  /** Team codes the user follows, in pick order. */
  teams: string[];
  alerts: {
    kickoff: boolean;
    goals: boolean;
    yourTeamsOnly: boolean;
    fullTime: boolean;
  };
  theme: "dark" | "light";
}
