import type { Group, Match } from "@/types";

/**
 * The prototype's frozen clock: Tuesday June 30, 2026, 15:50 local.
 * Round of 16, one match live. Swap this for `new Date()` (and the seed
 * data for an API) when the app goes live.
 */
export const MOCK_NOW = new Date("2026-06-30T15:50:00");

export const MATCHES: Match[] = [
  {
    id: "r16-bra-mar",
    round: "R16",
    slot: 0,
    stageLabel: "Round of 16",
    home: "BRA",
    away: "MAR",
    kickoff: "2026-06-30T14:30:00",
    venue: "MetLife Stadium",
    city: "New York / NJ",
    status: "live",
    minute: 67,
    period: "2nd half",
    score: { home: 2, away: 1 },
    watch: ["vinicius", "rodrygo"],
    winProb: { home: 60, draw: 23, away: 17 },
    momentum: [38, 42, 40, 47, 52, 44, 49, 55, 58, 54, 60],
    stats: {
      possession: [58, 42],
      shots: [14, 9],
      onTarget: [6, 4],
      xg: [2.31, 1.08],
      corners: [7, 3],
      fouls: [9, 12],
    },
    lineups: {
      home: {
        formation: "4-2-3-1",
        rows: [
          [{ num: 1, name: "Alisson" }],
          [
            { num: 2, name: "Danilo" },
            { num: 3, name: "Marquinhos" },
            { num: 14, name: "Gabriel" },
            { num: 6, name: "Wendell" },
          ],
          [
            { num: 5, name: "Bruno G." },
            { num: 15, name: "André" },
          ],
          [
            { num: 11, name: "Rodrygo" },
            { num: 8, name: "Paquetá" },
            { num: 7, name: "Vinícius" },
          ],
          [{ num: 9, name: "Endrick" }],
        ],
      },
      away: {
        formation: "4-3-3",
        rows: [
          [{ num: 1, name: "Bounou" }],
          [
            { num: 2, name: "Hakimi" },
            { num: 5, name: "Aguerd" },
            { num: 6, name: "Saïss" },
            { num: 3, name: "Mazraoui" },
          ],
          [
            { num: 4, name: "Amrabat" },
            { num: 8, name: "Ounahi" },
            { num: 10, name: "Amallah" },
          ],
          [
            { num: 7, name: "Ziyech" },
            { num: 19, name: "En-Nesyri" },
            { num: 17, name: "Boufal" },
          ],
        ],
      },
    },
    path: {
      home: ["Group G · Winners", "R32 · beat KOR 3-0"],
      away: ["Group F · Winners", "R32 · beat KOR 2-1"],
    },
    h2h: "BRA 2W · 1D · 0L in last 3 meetings",
    form: {
      home: ["W", "W", "W", "W"],
      away: ["W", "D", "W", "W"],
    },
  },
  {
    id: "r16-ned-usa",
    round: "R16",
    slot: 4,
    stageLabel: "Round of 16",
    home: "NED",
    away: "USA",
    kickoff: "2026-06-30T18:00:00",
    venue: "AT&T Stadium",
    city: "Dallas, TX",
    status: "upcoming",
    watch: ["gakpo", "pulisic"],
    winProb: { home: 44, draw: 27, away: 29 },
    path: {
      home: ["Group C · Winners", "R32 · beat NGA 2-0"],
      away: ["Group D · Winners", "R32 · beat ITA 1-0"],
    },
    h2h: "NED 1W · 0D · 0L in last meeting (2022 R16)",
    form: {
      home: ["W", "W", "D", "W"],
      away: ["W", "W", "D", "W"],
    },
  },
  {
    id: "r16-arg-jpn",
    round: "R16",
    slot: 1,
    stageLabel: "Round of 16",
    home: "ARG",
    away: "JPN",
    kickoff: "2026-06-30T20:00:00",
    venue: "Estadio Azteca",
    city: "Mexico City",
    status: "upcoming",
    watch: ["lautaro-martinez"],
    winProb: { home: 58, draw: 24, away: 18 },
    path: {
      home: ["Group A · Winners", "R32 · beat CAN 2-0"],
      away: ["Group E · Runners-up", "R32 · beat URU 1-0 aet"],
    },
    h2h: "First World Cup meeting",
    form: {
      home: ["W", "W", "W", "D"],
      away: ["W", "D", "L", "W"],
    },
  },
  {
    id: "r16-fra-sen",
    round: "R16",
    slot: 2,
    stageLabel: "Round of 16",
    home: "FRA",
    away: "SEN",
    kickoff: "2026-06-30T21:00:00",
    venue: "SoFi Stadium",
    city: "Los Angeles, CA",
    status: "upcoming",
    watch: ["mbappe", "theo-hernandez"],
    winProb: { home: 55, draw: 25, away: 20 },
    path: {
      home: ["Group B · Winners", "R32 · beat MEX 3-1"],
      away: ["Group G · Runners-up", "R32 · beat ENG 2-1"],
    },
    h2h: "FRA 1W · 0D · 1L in last 2 meetings",
    form: {
      home: ["W", "W", "L", "W"],
      away: ["W", "D", "W", "L"],
    },
  },
  {
    id: "r16-esp-cro",
    round: "R16",
    slot: 3,
    stageLabel: "Round of 16",
    home: "ESP",
    away: "CRO",
    kickoff: "2026-06-29T18:00:00",
    venue: "Gillette Stadium",
    city: "Boston, MA",
    status: "ft",
    score: { home: 3, away: 0 },
  },
  {
    id: "r16-ger-uru",
    round: "R16",
    slot: 5,
    stageLabel: "Round of 16",
    home: "GER",
    away: "URU",
    kickoff: "2026-06-29T21:00:00",
    venue: "Lincoln Financial Field",
    city: "Philadelphia, PA",
    status: "ft",
    score: { home: 1, away: 0 },
  },
  {
    id: "r16-por-mex",
    round: "R16",
    slot: 6,
    stageLabel: "Round of 16",
    home: "POR",
    away: "MEX",
    kickoff: "2026-07-01T18:00:00",
    venue: "Hard Rock Stadium",
    city: "Miami, FL",
    status: "upcoming",
    watch: ["leao"],
    winProb: { home: 48, draw: 27, away: 25 },
  },
  {
    id: "r16-eng-col",
    round: "R16",
    slot: 7,
    stageLabel: "Round of 16",
    home: "ENG",
    away: "COL",
    kickoff: "2026-07-01T21:00:00",
    venue: "Arrowhead Stadium",
    city: "Kansas City, MO",
    status: "upcoming",
    winProb: { home: 51, draw: 28, away: 21 },
  },
];

export function getMatch(id: string): Match | undefined {
  return MATCHES.find((m) => m.id === id);
}

// Group tables shown on the Standings tab. The mock shows the two groups
// containing the default profile's teams; 12 groups exist in the 48-team
// format but we only seed what the screen needs.
export const GROUPS: Group[] = [
  {
    name: "Group D",
    rows: [
      {
        teamCode: "USA",
        played: 3,
        record: "2-1-0",
        gd: 4,
        pts: 7,
        qualified: true,
      },
      {
        teamCode: "URU",
        played: 3,
        record: "1-2-0",
        gd: 2,
        pts: 5,
        qualified: true,
      },
      {
        teamCode: "NGA",
        played: 3,
        record: "1-0-2",
        gd: -1,
        pts: 3,
        qualified: false,
      },
      {
        teamCode: "CAN",
        played: 3,
        record: "0-1-2",
        gd: -5,
        pts: 1,
        qualified: false,
      },
    ],
  },
  {
    name: "Group G",
    rows: [
      {
        teamCode: "BRA",
        played: 3,
        record: "3-0-0",
        gd: 6,
        pts: 9,
        qualified: true,
      },
      {
        teamCode: "SEN",
        played: 3,
        record: "1-1-1",
        gd: 1,
        pts: 4,
        qualified: true,
      },
      {
        teamCode: "KOR",
        played: 3,
        record: "1-0-2",
        gd: -2,
        pts: 3,
        qualified: false,
      },
      {
        teamCode: "ITA",
        played: 3,
        record: "0-1-2",
        gd: -5,
        pts: 1,
        qualified: false,
      },
    ],
  },
];
