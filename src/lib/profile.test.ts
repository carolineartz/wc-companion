import { describe, it, expect, beforeEach } from "vitest";

import { loadProfile, saveProfile, clearProfile } from "@/lib/profile";
import type { Profile } from "@/types";

const KEY = "companion.profile";

describe("profile persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null on first run (nothing stored)", () => {
    expect(loadProfile()).toBeNull();
  });

  it("round-trips a saved profile", () => {
    const profile: Profile = { name: "Dad", favoriteTeamIds: ["usa"] };
    saveProfile(profile);
    expect(loadProfile()).toEqual(profile);
  });

  it("trims the name and drops unknown team ids", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ name: "  Dad  ", favoriteTeamIds: ["usa", "atlantis"] }),
    );
    expect(loadProfile()).toEqual({ name: "Dad", favoriteTeamIds: ["usa"] });
  });

  it("returns null for malformed JSON", () => {
    localStorage.setItem(KEY, "{not json");
    expect(loadProfile()).toBeNull();
  });

  it("returns null when no valid team remains", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ name: "Dad", favoriteTeamIds: ["atlantis"] }),
    );
    expect(loadProfile()).toBeNull();
  });

  it("returns null when the name is blank", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ name: "   ", favoriteTeamIds: ["usa"] }),
    );
    expect(loadProfile()).toBeNull();
  });

  it("clears the stored profile", () => {
    saveProfile({ name: "Dad", favoriteTeamIds: ["usa"] });
    clearProfile();
    expect(loadProfile()).toBeNull();
  });
});
