import type { TeamColors } from "@/types";

/**
 * National-team kit palettes, keyed by team id. The kit card's "shirt" block
 * renders in these colors; `accent` can tint app accents for that team's fans.
 *
 * Seeded for USA, Argentina, Canada, Mexico, plus a neutral default that any
 * unknown team (including the editable "Dad's Team") falls back to.
 *
 * TODO: expand to all 48 finalists when wiring a live data source.
 */
export const TEAM_COLORS: Record<string, TeamColors> = {
  usa: {
    shirt: "#FFFFFF",
    shirtTo: "#EDEDED",
    text: "#0A2240", // navy nameset
    number: "#BF0A30", // red numbers
    accent: "#3C6FD6", // bright American blue
  },
  argentina: {
    shirt: "#75AADB",
    shirtTo: "#FFFFFF",
    text: "#0A1A2F",
    number: "#0A1A2F",
    accent: "#75AADB",
  },
  canada: {
    shirt: "#D52B1E",
    shirtTo: "#B3170C",
    text: "#FFFFFF",
    number: "#FFFFFF",
    accent: "#D52B1E",
  },
  mexico: {
    shirt: "#0B6E4F",
    shirtTo: "#08543C",
    text: "#FFFFFF",
    number: "#FFFFFF",
    accent: "#0B6E4F",
  },
  // Neutral fallback — also used by the editable placeholder team.
  default: {
    shirt: "#1E4D3E",
    shirtTo: "#143528",
    text: "#F4F1E6",
    number: "#34C76A",
    accent: "#34C76A",
  },
};

/** Look up a team's kit palette, falling back to the neutral default. */
export function getTeamColors(teamId: string): TeamColors {
  return TEAM_COLORS[teamId] ?? TEAM_COLORS.default;
}

/** Neutral club colors used when the companion can't supply real ones. */
export const NEUTRAL_CLUB_COLORS: [string, string] = ["#C9CFC4", "#0E3327"];
