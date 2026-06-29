import { getTeam } from "@/data/rosters";
import type { Player } from "@/types";

/**
 * CORE ACTION. Resolve a jersey number to a player on a team.
 *
 * Shared by both entry points:
 *   - tapping a kit-number tile in the roster
 *   - saying a number into the mic (Web Speech API -> parseJerseyNumber)
 *
 * Returns the player, or undefined if no one wears that number.
 */
export function resolvePlayer(
  teamId: string,
  number: number,
): Player | undefined {
  return getTeam(teamId)?.players.find((p) => p.number === number);
}
