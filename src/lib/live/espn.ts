// Thin fetch layer over ESPN's public (unofficial, key-free) soccer API.
// Primary: direct browser call (site.api.espn.com sends open CORS headers).
// Fallback: same path through our own origin (/api/espn/*), proxied by the
// Vite dev server locally and a Netlify redirect in production.

const LEAGUE = "fifa.world";
const DIRECT = "https://site.api.espn.com";
const PROXY = "/api/espn";

// The whole 2026 tournament window — one scoreboard call returns every match.
export const TOURNAMENT_DATES = "20260611-20260719";

async function fetchJson(path: string): Promise<unknown> {
  try {
    const res = await fetch(`${DIRECT}${path}`, { mode: "cors" });
    if (!res.ok) throw new Error(`ESPN direct ${res.status}`);
    return await res.json();
  } catch {
    const res = await fetch(`${PROXY}${path}`);
    if (!res.ok) throw new Error(`ESPN proxy ${res.status}`);
    return await res.json();
  }
}

/** Every event in the date range (all 104 matches for the full window). */
export function fetchScoreboard(
  dates: string = TOURNAMENT_DATES,
): Promise<unknown> {
  return fetchJson(
    `/apis/site/v2/sports/soccer/${LEAGUE}/scoreboard?dates=${dates}&limit=400`,
  );
}

/** Boxscore, rosters/lineups, key events for one match. */
export function fetchSummary(eventId: string): Promise<unknown> {
  return fetchJson(
    `/apis/site/v2/sports/soccer/${LEAGUE}/summary?event=${eventId}`,
  );
}

/** Group-stage tables. */
export function fetchStandings(): Promise<unknown> {
  return fetchJson(`/apis/v2/sports/soccer/${LEAGUE}/standings?level=2`);
}
