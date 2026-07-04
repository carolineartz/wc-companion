import type { Profile } from "@/types";
import {
  clearProfile,
  DEFAULT_ALERTS,
  loadProfile,
  saveProfile,
} from "./profile";

const VALID: Profile = {
  name: "Alex",
  teams: ["USA", "BRA"],
  alerts: DEFAULT_ALERTS,
  theme: "dark",
};

describe("profile persistence", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips a profile through localStorage", () => {
    saveProfile(VALID);
    expect(loadProfile()).toEqual(VALID);
  });

  it("returns null on first run", () => {
    expect(loadProfile()).toBeNull();
  });

  it("returns null for corrupt JSON", () => {
    localStorage.setItem("companion.profile.v2", "{nope");
    expect(loadProfile()).toBeNull();
  });

  it("rejects the old v1 profile shape", () => {
    localStorage.setItem(
      "companion.profile.v2",
      JSON.stringify({ name: "Alex", favoriteTeamIds: ["usa"] }),
    );
    expect(loadProfile()).toBeNull();
  });

  it("clears the saved profile", () => {
    saveProfile(VALID);
    clearProfile();
    expect(loadProfile()).toBeNull();
  });
});
