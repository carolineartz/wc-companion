import { describe, expect, it } from "vitest";

import { resolvePlayer } from "@/lib/resolvePlayer";

describe("resolvePlayer", () => {
  it("resolves a known number to the right player", () => {
    const player = resolvePlayer("usa", 10);
    expect(player?.name).toBe("Christian Pulisic");
    expect(player?.position).toBe("FWD");
  });

  it("returns undefined for a number nobody wears", () => {
    expect(resolvePlayer("usa", 99)).toBeUndefined();
  });

  it("returns undefined for an unknown team", () => {
    expect(resolvePlayer("atlantis", 10)).toBeUndefined();
  });

  it("is scoped per team (same number, different squads)", () => {
    expect(resolvePlayer("usa", 1)?.name).toBe("Matt Turner");
    expect(resolvePlayer("dads-team", 1)?.name).toBe("Sam Keeper");
  });
});
