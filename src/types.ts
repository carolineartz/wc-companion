// Shared domain types for the WC Companion.

export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface Player {
  number: number;
  name: string;
  position: Position;
}

export interface Team {
  id: string;
  /** National team display name. */
  name: string;
  /** Flag emoji shown on tiles and the kit card header. */
  flag: string;
  players: Player[];
}

/**
 * A national team's kit palette. Drives the "shirt" block on the kit card.
 * `accent` is the national color used to tint app accents for a fan of this
 * team. Seed values live in src/data/teamColors.ts.
 */
export interface TeamColors {
  /** Shirt fill (primary kit color). */
  shirt: string;
  /** Optional gradient end for the shirt (falls back to `shirt`). */
  shirtTo?: string;
  /** Nameset color printed on the shirt (display caps). */
  text: string;
  /** Kit number color. */
  number: string;
  /** National accent (hex) for tinting app UI for this team's fans. */
  accent: string;
}

/** Structured payload returned by the companion serverless function. */
export interface CompanionResponse {
  briefing: string;
  club: string;
  league: string;
  /** [primary, secondary] club hexes; neutral fallback if unknown. */
  clubColors: [string, string];
  position: string;
}

/** Persisted user profile (localStorage key "companion.profile"). */
export interface Profile {
  name: string;
  /** Team ids the user follows; the first is the "active" team. */
  favoriteTeamIds: string[];
}
