import type { Profile } from "@/types";

// v2: the "Broadcast direction" profile (teams + alerts + theme). The v1
// roster-app profile used a different key/shape; we simply ignore it.
const KEY = "companion.profile.v2";

export const DEFAULT_ALERTS: Profile["alerts"] = {
  kickoff: true,
  goals: true,
  yourTeamsOnly: true,
  fullTime: false,
};

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isProfile(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(KEY);
}

function isProfile(value: unknown): value is Profile {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.name === "string" &&
    Array.isArray(p.teams) &&
    p.teams.every((t) => typeof t === "string") &&
    typeof p.alerts === "object" &&
    p.alerts !== null &&
    (p.theme === "dark" || p.theme === "light")
  );
}
