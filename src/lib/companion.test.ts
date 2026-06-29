import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NEUTRAL_CLUB_COLORS } from "@/data/teamColors";
import { fetchBriefing } from "@/lib/companion";
import type { Player, Profile } from "@/types";

const team = { id: "usa", name: "United States" };
const player: Player = {
  number: 10,
  name: "Christian Pulisic",
  position: "FWD",
};
const profile: Profile = { name: "Dad", favoriteTeamIds: ["usa"] };

function mockFetchOnce(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: () => Promise.resolve(body),
    }),
  );
}

describe("fetchBriefing", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("passes through a well-formed response", async () => {
    mockFetchOnce({
      briefing: "A live briefing.",
      club: "AC Milan",
      league: "Serie A",
      clubColors: ["#DA291C", "#000000"],
      position: "Winger",
    });

    const result = await fetchBriefing(team, player, profile);
    expect(result).toEqual({
      briefing: "A live briefing.",
      club: "AC Milan",
      league: "Serie A",
      clubColors: ["#DA291C", "#000000"],
      position: "Winger",
    });
  });

  it("replaces invalid hex values with neutral fallbacks", async () => {
    mockFetchOnce({
      briefing: "ok",
      club: "AC Milan",
      league: "Serie A",
      clubColors: ["red", "#000000"], // first is not a hex
      position: "Winger",
    });

    const result = await fetchBriefing(team, player, profile);
    expect(result.clubColors).toEqual([NEUTRAL_CLUB_COLORS[0], "#000000"]);
  });

  it("fills sensible defaults when fields are missing", async () => {
    mockFetchOnce({});

    const result = await fetchBriefing(team, player, profile);
    expect(result.club).toBe("—");
    expect(result.league).toBe("—");
    expect(result.position).toBe(player.position); // falls back to seed position
    expect(result.clubColors).toEqual(NEUTRAL_CLUB_COLORS);
  });

  it("returns a friendly fallback on a non-OK response", async () => {
    mockFetchOnce({}, false);

    const result = await fetchBriefing(team, player, profile);
    expect(result.briefing).toMatch(/couldn't reach the companion/i);
    expect(result.clubColors).toEqual(NEUTRAL_CLUB_COLORS);
  });

  it("returns a friendly fallback when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const result = await fetchBriefing(team, player, profile);
    expect(result.briefing).toMatch(/couldn't reach the companion/i);
  });
});
