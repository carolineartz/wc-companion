import type { CompanionResponse, Player, Profile } from "@/types";
import { NEUTRAL_CLUB_COLORS } from "@/data/teamColors";

const ENDPOINT = "/.netlify/functions/companion";

export interface CompanionRequest {
  teamName: string;
  playerName: string;
  number: number;
  profile: Profile;
}

/**
 * Call the server-side companion function for a live player briefing.
 * The function holds the Anthropic key and runs web search server-side; the
 * browser only ever sees the structured JSON below.
 *
 * Always resolves to a usable CompanionResponse — on any error it returns a
 * neutral fallback so the kit card still renders.
 */
export async function fetchBriefing(
  team: { id: string; name: string },
  player: Player,
  profile: Profile,
): Promise<CompanionResponse> {
  const body: CompanionRequest = {
    teamName: team.name,
    playerName: player.name,
    number: player.number,
    profile,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`companion ${res.status}`);
    const data = (await res.json()) as Partial<CompanionResponse>;
    return normalize(data, player);
  } catch {
    return {
      briefing:
        "Couldn't reach the companion right now. Check your connection and tap to retry.",
      club: "—",
      league: "—",
      clubColors: NEUTRAL_CLUB_COLORS,
      position: player.position,
    };
  }
}

/**
 * Fetch a short club or league summary for a tapped chip. Routes through the
 * same serverless function (topic mode). Resolves to plain text; returns a
 * friendly fallback string on error.
 */
export async function fetchTopicSummary(
  kind: "club" | "league",
  subject: string,
  context: { teamName: string; playerName: string; profile: Profile },
): Promise<string> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: { kind, subject },
        teamName: context.teamName,
        playerName: context.playerName,
        profile: context.profile,
      }),
    });
    if (!res.ok) throw new Error(`companion ${res.status}`);
    const data = (await res.json()) as { summary?: unknown };
    if (typeof data.summary === "string" && data.summary.trim()) {
      return data.summary.trim();
    }
    throw new Error("empty summary");
  } catch {
    return `Couldn't load a summary for ${subject} right now. Tap to retry.`;
  }
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function normalize(
  data: Partial<CompanionResponse>,
  player: Player,
): CompanionResponse {
  const colors = Array.isArray(data.clubColors) ? data.clubColors : [];
  const clubColors: [string, string] = [
    typeof colors[0] === "string" && HEX.test(colors[0])
      ? colors[0]
      : NEUTRAL_CLUB_COLORS[0],
    typeof colors[1] === "string" && HEX.test(colors[1])
      ? colors[1]
      : NEUTRAL_CLUB_COLORS[1],
  ];
  return {
    briefing:
      typeof data.briefing === "string" && data.briefing.trim()
        ? data.briefing.trim()
        : "No briefing available yet.",
    club: typeof data.club === "string" && data.club.trim() ? data.club : "—",
    league:
      typeof data.league === "string" && data.league.trim()
        ? data.league
        : "—",
    clubColors,
    position:
      typeof data.position === "string" && data.position.trim()
        ? data.position
        : player.position,
  };
}
