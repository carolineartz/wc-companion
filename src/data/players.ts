import type { Club, League, Player } from "@/types";

export const LEAGUES: Record<string, League> = {
  "serie-a": { id: "serie-a", name: "Serie A", colors: ["#1a63c8", "#00a752"] },
  "la-liga": { id: "la-liga", name: "La Liga", colors: ["#ee3b56", "#f7a01d"] },
  "premier-league": {
    id: "premier-league",
    name: "Premier League",
    colors: ["#38003c", "#e90052"],
  },
  "super-lig": {
    id: "super-lig",
    name: "Süper Lig",
    colors: ["#e30a17", "#f4f1ec"],
  },
};

export const CLUBS: Record<string, Club> = {
  "ac-milan": {
    id: "ac-milan",
    name: "AC Milan",
    leagueId: "serie-a",
    colors: ["#fb090b", "#1c1c1c"],
  },
  inter: {
    id: "inter",
    name: "Inter",
    leagueId: "serie-a",
    colors: ["#0068a8", "#1c1c1c"],
  },
  juventus: {
    id: "juventus",
    name: "Juventus",
    leagueId: "serie-a",
    colors: ["#1c1c1c", "#6b7280"],
  },
  "real-madrid": {
    id: "real-madrid",
    name: "Real Madrid",
    leagueId: "la-liga",
    colors: ["#febe10", "#f4f1ec"],
  },
  liverpool: {
    id: "liverpool",
    name: "Liverpool",
    leagueId: "premier-league",
    colors: ["#c8102e", "#00b2a9"],
  },
  fenerbahce: {
    id: "fenerbahce",
    name: "Fenerbahçe",
    leagueId: "super-lig",
    colors: ["#ffed00", "#163962"],
  },
};

// A thin slice of players — enough to make Golden Boot, Who to Watch, and the
// club/league drill-downs feel real. Add freely; everything else derives.
export const PLAYERS: Record<string, Player> = {
  pulisic: {
    id: "pulisic",
    name: "Christian Pulisic",
    surname: "PULISIC",
    teamCode: "USA",
    number: 10,
    position: "Winger",
    clubId: "ac-milan",
    apps: 4,
    goals: 3,
    assists: 1,
    headline:
      "The USA's talisman; carries the ball more than anyone on the team.",
  },
  reijnders: {
    id: "reijnders",
    name: "Tijjani Reijnders",
    surname: "REIJNDERS",
    teamCode: "NED",
    number: 14,
    position: "Midfielder",
    clubId: "ac-milan",
    apps: 4,
    goals: 2,
    assists: 1,
    headline: "Press-resistant Dutch midfielder who arrives late in the box.",
  },
  leao: {
    id: "leao",
    name: "Rafael Leão",
    surname: "LEÃO",
    teamCode: "POR",
    number: 17,
    position: "Left Winger",
    clubId: "ac-milan",
    apps: 3,
    goals: 2,
    assists: 2,
    headline: "Explosive off the left; unplayable when he gets a runway.",
  },
  "theo-hernandez": {
    id: "theo-hernandez",
    name: "Theo Hernández",
    surname: "HERNÁNDEZ",
    teamCode: "FRA",
    number: 22,
    position: "Left Back",
    clubId: "ac-milan",
    apps: 4,
    goals: 0,
    assists: 2,
    headline: "A left back who attacks like a winger; France's overlap engine.",
  },
  mckennie: {
    id: "mckennie",
    name: "Weston McKennie",
    surname: "MCKENNIE",
    teamCode: "USA",
    number: 8,
    position: "Box-to-box Mid",
    clubId: "juventus",
    apps: 4,
    goals: 1,
    assists: 0,
    headline: "All-action midfielder; wins everything in the air.",
  },
  "lautaro-martinez": {
    id: "lautaro-martinez",
    name: "Lautaro Martínez",
    surname: "MARTÍNEZ",
    teamCode: "ARG",
    number: 10,
    position: "Striker",
    clubId: "inter",
    apps: 4,
    goals: 3,
    assists: 0,
    headline: "Relentless pressing striker; Argentina's reference point.",
  },
  mbappe: {
    id: "mbappe",
    name: "Kylian Mbappé",
    surname: "MBAPPÉ",
    teamCode: "FRA",
    number: 10,
    position: "Forward",
    clubId: "real-madrid",
    apps: 4,
    goals: 5,
    assists: 1,
    headline: "The tournament's fastest man in behind; leads the Boot race.",
  },
  vinicius: {
    id: "vinicius",
    name: "Vinícius Júnior",
    surname: "VINÍCIUS JR.",
    teamCode: "BRA",
    number: 7,
    position: "Left Winger",
    clubId: "real-madrid",
    apps: 4,
    goals: 4,
    assists: 2,
    headline: "Brazil's spark — isolate him one-v-one and it's already over.",
  },
  rodrygo: {
    id: "rodrygo",
    name: "Rodrygo",
    surname: "RODRYGO",
    teamCode: "BRA",
    number: 11,
    position: "Forward",
    clubId: "real-madrid",
    apps: 4,
    goals: 2,
    assists: 3,
    headline: "Drifts between the lines and makes the final pass look easy.",
  },
  gakpo: {
    id: "gakpo",
    name: "Cody Gakpo",
    surname: "GAKPO",
    teamCode: "NED",
    number: 11,
    position: "Forward",
    clubId: "liverpool",
    apps: 4,
    goals: 3,
    assists: 2,
    headline: "Keeps scoring at World Cups; inverts in off the left.",
  },
  "en-nesyri": {
    id: "en-nesyri",
    name: "Youssef En-Nesyri",
    surname: "EN-NESYRI",
    teamCode: "MAR",
    number: 19,
    position: "Striker",
    clubId: "fenerbahce",
    apps: 4,
    goals: 3,
    assists: 0,
    headline: "Aerial threat; hangs in the air longer than anyone alive.",
  },
};

export function getPlayer(id: string): Player | undefined {
  return PLAYERS[id];
}

export function getClub(id: string): Club | undefined {
  return CLUBS[id];
}

export function getLeague(id: string): League | undefined {
  return LEAGUES[id];
}
