import { onColor } from "@/lib/color";
import type { Team } from "@/types";

// Only the nations that appear in the mock tournament state. Badge = the
// little code chip (flag-ish identity color). Kit = what the team actually
// wears in a match context — match surfaces use KIT colors, not identity.
export const TEAMS: Record<string, Team> = {
  BRA: {
    code: "BRA",
    name: "Brazil",
    badge: { bg: "#1d9e4f", fg: "#ffffff" },
    kit: { primary: "#f2ce2a", secondary: "#1d9e4f" },
    jersey: { name: "#173a76", number: "#1d9e4f" },
  },
  MAR: {
    code: "MAR",
    name: "Morocco",
    badge: { bg: "#bb1e35", fg: "#ffffff" },
    kit: { primary: "#bb1e35", secondary: "#0d6b3f" },
    jersey: { name: "#0d6b3f", number: "#bb1e35" },
  },
  USA: {
    code: "USA",
    name: "United States",
    badge: { bg: "#25316d", fg: "#ffffff" },
    kit: { primary: "#f4f1ec", secondary: "#25316d" },
    jersey: { name: "#25316d", number: "#c1273c" },
  },
  NED: {
    code: "NED",
    name: "Netherlands",
    badge: { bg: "#e8641b", fg: "#ffffff" },
    kit: { primary: "#e8641b", secondary: "#f4f1ec" },
    jersey: { name: "#25316d", number: "#e8641b" },
  },
  ARG: {
    code: "ARG",
    name: "Argentina",
    badge: { bg: "#9cc3e5", fg: "#1c2a4a" },
    kit: { primary: "#9cc3e5", secondary: "#f4f1ec" },
    jersey: { name: "#1c2a4a", number: "#6da8dc" },
  },
  JPN: {
    code: "JPN",
    name: "Japan",
    badge: { bg: "#1c2a4a", fg: "#ffffff" },
    kit: { primary: "#20347c", secondary: "#f4f1ec" },
    jersey: { name: "#20347c", number: "#c1273c" },
  },
  FRA: {
    code: "FRA",
    name: "France",
    badge: { bg: "#20347c", fg: "#ffffff" },
    kit: { primary: "#20347c", secondary: "#f4f1ec" },
    jersey: { name: "#20347c", number: "#c1273c" },
  },
  SEN: {
    code: "SEN",
    name: "Senegal",
    badge: { bg: "#f4f1ec", fg: "#0d6b3f" },
    kit: { primary: "#f4f1ec", secondary: "#0d6b3f" },
    jersey: { name: "#0d6b3f", number: "#e0a412" },
  },
  ESP: {
    code: "ESP",
    name: "Spain",
    badge: { bg: "#c60b1e", fg: "#ffffff" },
    kit: { primary: "#c60b1e", secondary: "#e0a412" },
    jersey: { name: "#1c2a4a", number: "#c60b1e" },
  },
  CRO: {
    code: "CRO",
    name: "Croatia",
    badge: { bg: "#1c2a4a", fg: "#ffffff" },
    kit: { primary: "#f4f1ec", secondary: "#c1273c" },
    jersey: { name: "#1c2a4a", number: "#c1273c" },
  },
  GER: {
    code: "GER",
    name: "Germany",
    badge: { bg: "#f4f1ec", fg: "#171717" },
    kit: { primary: "#f4f1ec", secondary: "#171717" },
    jersey: { name: "#171717", number: "#c1273c" },
  },
  URU: {
    code: "URU",
    name: "Uruguay",
    badge: { bg: "#7db4e0", fg: "#1c2a4a" },
    kit: { primary: "#7db4e0", secondary: "#1c2a4a" },
    jersey: { name: "#1c2a4a", number: "#7db4e0" },
  },
  POR: {
    code: "POR",
    name: "Portugal",
    badge: { bg: "#7a1023", fg: "#ffffff" },
    kit: { primary: "#7a1023", secondary: "#0d6b3f" },
    jersey: { name: "#0d6b3f", number: "#7a1023" },
  },
  MEX: {
    code: "MEX",
    name: "Mexico",
    badge: { bg: "#0b7a3b", fg: "#ffffff" },
    kit: { primary: "#0b7a3b", secondary: "#f4f1ec" },
    jersey: { name: "#1c2a4a", number: "#0b7a3b" },
  },
  ENG: {
    code: "ENG",
    name: "England",
    badge: { bg: "#f4f1ec", fg: "#20347c" },
    kit: { primary: "#f4f1ec", secondary: "#20347c" },
    jersey: { name: "#20347c", number: "#c1273c" },
  },
  COL: {
    code: "COL",
    name: "Colombia",
    badge: { bg: "#e8c33b", fg: "#1c2a4a" },
    kit: { primary: "#e8c33b", secondary: "#20347c" },
    jersey: { name: "#20347c", number: "#c1273c" },
  },
  KOR: {
    code: "KOR",
    name: "South Korea",
    badge: { bg: "#1c2a4a", fg: "#ffffff" },
    kit: { primary: "#c1273c", secondary: "#1c2a4a" },
    jersey: { name: "#1c2a4a", number: "#c1273c" },
  },
  ITA: {
    code: "ITA",
    name: "Italy",
    badge: { bg: "#0066bf", fg: "#ffffff" },
    kit: { primary: "#0066bf", secondary: "#f4f1ec" },
    jersey: { name: "#0066bf", number: "#e0a412" },
  },
  NGA: {
    code: "NGA",
    name: "Nigeria",
    badge: { bg: "#0b7a3b", fg: "#ffffff" },
    kit: { primary: "#0b7a3b", secondary: "#f4f1ec" },
    jersey: { name: "#0b7a3b", number: "#171717" },
  },
  CAN: {
    code: "CAN",
    name: "Canada",
    badge: { bg: "#c1273c", fg: "#ffffff" },
    kit: { primary: "#c1273c", secondary: "#f4f1ec" },
    jersey: { name: "#171717", number: "#c1273c" },
  },
};

// Teams discovered at runtime from the live feed. Hand-tuned entries above
// win (they carry real kit colors); the feed fills in everyone else.
const RUNTIME_TEAMS: Record<string, Team> = {};

export function registerTeam(input: {
  code: string;
  name: string;
  color?: string; // ESPN identity hex, no leading "#"
  alternateColor?: string;
  logo?: string;
}): void {
  const seeded = TEAMS[input.code];
  if (seeded) {
    if (input.logo && !seeded.logo) seeded.logo = input.logo;
    return;
  }
  const primary = normalizeHex(input.color) ?? "#4b5563";
  const secondary = normalizeHex(input.alternateColor) ?? "#9ca3af";
  RUNTIME_TEAMS[input.code] = {
    code: input.code,
    name: input.name,
    badge: { bg: primary, fg: onColor(primary) },
    kit: { primary, secondary },
    jersey: { name: "#1f2937", number: primary },
    logo: input.logo,
  };
}

/** For persisting feed-discovered teams alongside the snapshot cache. */
export function dumpRuntimeTeams(): Team[] {
  return Object.values(RUNTIME_TEAMS);
}

export function restoreRuntimeTeams(teams: Team[]): void {
  for (const t of teams) {
    if (t?.code && !TEAMS[t.code] && !RUNTIME_TEAMS[t.code]) {
      RUNTIME_TEAMS[t.code] = t;
    }
  }
}

function normalizeHex(hex?: string): string | undefined {
  if (!hex || !/^[0-9a-fA-F]{6}$/.test(hex.replace("#", ""))) return undefined;
  return `#${hex.replace("#", "").toLowerCase()}`;
}

export function getTeam(code: string): Team {
  const team = TEAMS[code] ?? RUNTIME_TEAMS[code];
  if (team) return team;
  // Unknown code (incl. TBD slots) — neutral placeholder, never crash.
  return {
    code,
    name: code === "TBD" ? "TBD" : code,
    badge: { bg: "#4b5563", fg: "#ffffff" },
    kit: { primary: "#9ca3af", secondary: "#4b5563" },
    jersey: { name: "#1f2937", number: "#4b5563" },
  };
}

/** Teams offered in onboarding, in mock display order. */
export const PICKABLE_TEAMS = [
  "BRA",
  "ARG",
  "FRA",
  "ESP",
  "ENG",
  "POR",
  "NED",
  "USA",
  "GER",
  "MEX",
  "MAR",
  "JPN",
];
