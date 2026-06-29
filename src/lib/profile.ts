import { TEAMS } from "@/data/rosters";
import type { Profile } from "@/types";

const STORAGE_KEY = "companion.profile";

/** Read the persisted profile, or null on first run / invalid data. */
export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    if (
      typeof parsed?.name !== "string" ||
      !Array.isArray(parsed?.favoriteTeamIds)
    ) {
      return null;
    }
    // Drop any team ids that no longer exist in the seed data.
    const valid = parsed.favoriteTeamIds.filter((id) =>
      TEAMS.some((t) => t.id === id),
    );
    if (!parsed.name.trim() || valid.length === 0) return null;
    return { name: parsed.name.trim(), favoriteTeamIds: valid };
  } catch {
    return null;
  }
}

/** Persist the profile to localStorage. */
export function saveProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** Clear the saved profile (used by "reset" in Settings). */
export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}
