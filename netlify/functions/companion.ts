import Anthropic from "@anthropic-ai/sdk";
import type { Handler } from "@netlify/functions";

/**
 * World Cup companion — server-side. Holds the Anthropic key (never exposed to
 * the browser) and enables the web_search server tool so club/league/form
 * comes from the live web, not training data.
 *
 * Two modes, switched on the request body:
 *   - default: a player briefing -> structured JSON
 *       { briefing, club, league, clubColors: [hex,hex], position }
 *   - { topic: { kind, subject } }: a short club/league summary -> { summary }
 *
 * Model + tool versions per docs.claude.com:
 *   model: claude-opus-4-8
 *   tool:  web_search_20260209 (dynamic filtering; adaptive thinking)
 */

const MODEL = "claude-opus-4-8";

// web_search_20260209 is the current variant for Opus 4.8 (dynamic filtering).
// Typed loosely so the function transpiles regardless of SDK tool-union drift.
const WEB_SEARCH_TOOL = {
  type: "web_search_20260209",
  name: "web_search",
  max_uses: 4,
} as unknown as Anthropic.Tool;

const SYSTEM_PROMPT =
  "World Cup watching companion. Given a player, return a tight briefing: who " +
  "they are, current club + league, role, and 2026 World Cup context. Tone " +
  "matches the user's profile.";

const NEUTRAL_CLUB_COLORS: [string, string] = ["#C9CFC4", "#0E3327"];

interface Profile {
  name?: string;
  favoriteTeamIds?: string[];
}

const jsonResponse = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "ANTHROPIC_API_KEY is not set" });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const client = new Anthropic({ apiKey });

  try {
    // ---- Topic mode: short club/league summary ----
    if (body.topic && typeof body.topic === "object") {
      const topic = body.topic as { kind?: string; subject?: string };
      const kind = topic.kind === "league" ? "league" : "club";
      const subject = String(topic.subject ?? "").slice(0, 120);
      const teamName = String(body.teamName ?? "");
      const playerName = String(body.playerName ?? "");

      const prompt =
        `Give a 2-3 sentence summary of the ${kind} "${subject}", as relevant ` +
        `to ${playerName} of ${teamName}. Use current (2026) information about ` +
        `form, standing, and notable context. Return ONLY the summary text — ` +
        `no preamble, no markdown, no JSON.`;

      const text = await runModel(client, prompt);
      return jsonResponse(200, { summary: stripFences(text).trim() });
    }

    // ---- Briefing mode: structured player card ----
    const teamName = String(body.teamName ?? "");
    const playerName = String(body.playerName ?? "");
    const number = Number(body.number ?? 0);
    const profile = (body.profile ?? {}) as Profile;

    const tone = profile.name
      ? `The reader is ${profile.name}` +
        (profile.favoriteTeamIds?.length
          ? `, who follows ${profile.favoriteTeamIds.join(", ")}.`
          : ".")
      : "Keep it friendly and concise.";

    const prompt =
      `Player: ${playerName} (#${number}), ${teamName} national team.\n` +
      `${tone}\n\n` +
      `Search the web for this player's CURRENT club, league, role, and recent ` +
      `form, plus 2026 World Cup context. Then return ONLY a single JSON object ` +
      `(no markdown fences, no prose before or after) with EXACTLY these keys:\n` +
      `{\n` +
      `  "briefing": string,   // ~3 sentences: who they are, current club+league, role, 2026 WC context\n` +
      `  "club": string,       // current club name\n` +
      `  "league": string,     // current league name\n` +
      `  "clubColors": [string, string], // two hex colors of the CLUB kit, e.g. ["#DA291C","#FBE122"]\n` +
      `  "position": string    // playing position\n` +
      `}`;

    const text = await runModel(client, prompt);
    const parsed = extractJson(text);

    const result = {
      briefing: asString(parsed?.briefing, "No briefing available."),
      club: asString(parsed?.club, "—"),
      league: asString(parsed?.league, "—"),
      clubColors: asHexPair(parsed?.clubColors),
      position: asString(parsed?.position, ""),
    };

    return jsonResponse(200, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse(502, { error: `Companion failed: ${message}` });
  }
};

/**
 * Run the model with web search + adaptive thinking, handling pause_turn
 * continuations, and return the concatenated visible text.
 */
async function runModel(client: Anthropic, prompt: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  let response = await create(client, messages);
  let guard = 0;
  // Server-tool loops can pause; re-send to resume (no extra user message).
  while (response.stop_reason === "pause_turn" && guard < 3) {
    messages.push({ role: "assistant", content: response.content });
    response = await create(client, messages);
    guard += 1;
  }

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

function create(client: Anthropic, messages: Anthropic.MessageParam[]) {
  return client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    thinking: { type: "adaptive" },
    // Keep latency down for the serverless timeout; web search adds round-trips.
    output_config: { effort: "low" },
    tools: [WEB_SEARCH_TOOL],
    messages,
  } as Anthropic.MessageCreateParamsNonStreaming);
}

/** Remove ```json ... ``` fences if the model added them. */
function stripFences(text: string): string {
  return text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

/** Best-effort extraction of the first balanced JSON object from text. */
function extractJson(text: string): Record<string, unknown> | null {
  const cleaned = stripFences(text);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function asHexPair(value: unknown): [string, string] {
  if (Array.isArray(value)) {
    const a =
      typeof value[0] === "string" && HEX.test(value[0]) ? value[0] : null;
    const b =
      typeof value[1] === "string" && HEX.test(value[1]) ? value[1] : null;
    if (a || b) {
      return [a ?? NEUTRAL_CLUB_COLORS[0], b ?? NEUTRAL_CLUB_COLORS[1]];
    }
  }
  return NEUTRAL_CLUB_COLORS;
}
