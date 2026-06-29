import type { Team } from "@/types";

/**
 * Hard-coded seed squads so the app works end-to-end with no external API.
 * Two teams: USA and an editable placeholder ("Dad's Team") so a second user
 * has a squad to browse out of the box.
 *
 * TODO: swap this module for a live football API (squads change constantly).
 */
export const TEAMS: Team[] = [
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    players: [
      { number: 1, name: "Matt Turner", position: "GK" },
      { number: 2, name: "Sergiño Dest", position: "DEF" },
      { number: 3, name: "Chris Richards", position: "DEF" },
      { number: 4, name: "Tyler Adams", position: "MID" },
      { number: 5, name: "Antonee Robinson", position: "DEF" },
      { number: 6, name: "Yunus Musah", position: "MID" },
      { number: 8, name: "Weston McKennie", position: "MID" },
      { number: 9, name: "Folarin Balogun", position: "FWD" },
      { number: 10, name: "Christian Pulisic", position: "FWD" },
      { number: 11, name: "Tim Weah", position: "FWD" },
      { number: 13, name: "Tim Ream", position: "DEF" },
      { number: 16, name: "Gio Reyna", position: "MID" },
      { number: 19, name: "Ricardo Pepi", position: "FWD" },
    ],
  },
  {
    id: "dads-team",
    // Placeholder so a second user (e.g. my dad) has a squad before wiring a
    // real one. Rename the team or repoint the profile in Settings.
    name: "Dad's Team",
    flag: "⚽",
    players: [
      { number: 1, name: "Sam Keeper", position: "GK" },
      { number: 2, name: "Leo Marsh", position: "DEF" },
      { number: 3, name: "Owen Pitt", position: "DEF" },
      { number: 4, name: "Diego Cole", position: "DEF" },
      { number: 5, name: "Marco Vidal", position: "DEF" },
      { number: 6, name: "Hugo Banks", position: "MID" },
      { number: 7, name: "Andre Sol", position: "MID" },
      { number: 8, name: "Niko Frost", position: "MID" },
      { number: 9, name: "Rafa Mendez", position: "FWD" },
      { number: 10, name: "Theo Kane", position: "FWD" },
      { number: 11, name: "Bruno Vega", position: "FWD" },
      { number: 14, name: "Eli Park", position: "MID" },
      { number: 17, name: "Caleb Ortiz", position: "FWD" },
    ],
  },
];

/** Find a team by id. */
export function getTeam(teamId: string): Team | undefined {
  return TEAMS.find((t) => t.id === teamId);
}
