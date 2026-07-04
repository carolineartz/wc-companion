import {
  normalizeScoreboard,
  normalizeStandings,
  normalizeSummary,
  roundFromLabel,
} from "./normalize";

// Trimmed-down payloads in the documented ESPN shapes. If ESPN drifts,
// these tests keep the normalizers honest about what they assume.

const SCOREBOARD = {
  events: [
    {
      id: "740001",
      date: "2026-07-04T20:00Z",
      status: {
        displayClock: "63'",
        period: 2,
        type: { state: "in" },
      },
      competitions: [
        {
          venue: {
            fullName: "MetLife Stadium",
            address: { city: "East Rutherford" },
          },
          notes: [{ type: "event", headline: "Round of 16" }],
          competitors: [
            {
              homeAway: "home",
              score: "2",
              form: "WWWW",
              team: {
                id: "202",
                abbreviation: "BRA",
                displayName: "Brazil",
                color: "ffdf00",
                alternateColor: "00a651",
                logo: "https://a.espncdn.com/i/teamlogos/soccer/500/202.png",
              },
            },
            {
              homeAway: "away",
              score: "1",
              form: "WDWW",
              team: {
                id: "5",
                abbreviation: "MAR",
                displayName: "Morocco",
                color: "c1272d",
              },
            },
          ],
        },
      ],
    },
    {
      id: "740002",
      date: "2026-07-05T18:00Z",
      status: { type: { state: "pre" } },
      competitions: [
        {
          venue: { fullName: "AT&T Stadium", address: { city: "Arlington" } },
          notes: [{ headline: "Quarterfinals" }],
          competitors: [
            {
              homeAway: "home",
              team: { abbreviation: "TBD", displayName: "TBD" },
            },
            {
              homeAway: "away",
              team: { abbreviation: "TBD", displayName: "TBD" },
            },
          ],
        },
      ],
    },
    {
      id: "740000",
      date: "2026-07-03T18:00Z",
      status: { type: { state: "post" } },
      competitions: [
        {
          notes: [{ headline: "Round of 32" }],
          competitors: [
            {
              homeAway: "home",
              score: "1",
              shootoutScore: 4,
              team: { abbreviation: "GER", displayName: "Germany" },
            },
            {
              homeAway: "away",
              score: "1",
              shootoutScore: 2,
              team: { abbreviation: "URU", displayName: "Uruguay" },
            },
          ],
        },
      ],
    },
  ],
};

describe("normalizeScoreboard", () => {
  const matches = normalizeScoreboard(SCOREBOARD);

  it("maps live matches with clock, score, venue and round", () => {
    const live = matches.find((m) => m.id === "740001");
    expect(live).toMatchObject({
      home: "BRA",
      away: "MAR",
      status: "live",
      clock: "63'",
      period: "2nd half",
      score: { home: 2, away: 1 },
      round: "R16",
      stageLabel: "Round of 16",
      venue: "MetLife Stadium",
      city: "East Rutherford",
    });
    expect(live?.form).toEqual({
      home: ["W", "W", "W", "W"],
      away: ["W", "D", "W", "W"],
    });
  });

  it("keeps undecided knockout slots as TBD", () => {
    const future = matches.find((m) => m.id === "740002");
    expect(future).toMatchObject({
      home: "TBD",
      away: "TBD",
      status: "upcoming",
      round: "QF",
    });
  });

  it("carries shootout scores on drawn finals", () => {
    const pens = matches.find((m) => m.id === "740000");
    expect(pens).toMatchObject({
      status: "ft",
      score: { home: 1, away: 1 },
      shootout: { home: 4, away: 2 },
    });
  });

  it("sorts by kickoff and slots within each round", () => {
    expect(matches.map((m) => m.id)).toEqual(["740000", "740001", "740002"]);
    expect(matches.every((m) => m.slot === 0)).toBe(true); // one per round
  });

  it("survives garbage input", () => {
    expect(normalizeScoreboard(null)).toEqual([]);
    expect(normalizeScoreboard({ events: [{}, { competitions: [] }] })).toEqual(
      [],
    );
  });
});

describe("roundFromLabel", () => {
  it("maps ESPN stage headlines to bracket rounds", () => {
    expect(roundFromLabel("Round of 32")).toBe("R32");
    expect(roundFromLabel("Round of 16")).toBe("R16");
    expect(roundFromLabel("Quarterfinals")).toBe("QF");
    expect(roundFromLabel("Semifinals")).toBe("SF");
    expect(roundFromLabel("Final")).toBe("F");
    expect(roundFromLabel("Third Place Game")).toBeUndefined();
    expect(roundFromLabel("Group A")).toBeUndefined();
  });
});

describe("normalizeSummary", () => {
  const SUMMARY = {
    boxscore: {
      teams: [
        {
          homeAway: "away",
          statistics: [
            { name: "possessionPct", displayValue: "42" },
            { name: "totalShots", displayValue: "9" },
            { name: "shotsOnTarget", displayValue: "4" },
          ],
        },
        {
          homeAway: "home",
          statistics: [
            { name: "possessionPct", displayValue: "58" },
            { name: "totalShots", displayValue: "14" },
            { name: "shotsOnTarget", displayValue: "6" },
          ],
        },
      ],
    },
    rosters: [
      {
        homeAway: "home",
        team: { formation: "4-4-2" },
        roster: [
          ...[
            [1, "Alisson"],
            [2, "Danilo"],
            [3, "Marquinhos"],
            [4, "Gabriel"],
            [6, "Wendell"],
            [5, "Bruno G."],
            [8, "Paquetá"],
            [7, "Vinícius"],
            [11, "Rodrygo"],
            [9, "Endrick"],
            [10, "Neymar"],
          ].map(([jersey, name], i) => ({
            starter: true,
            jersey: String(jersey),
            formationPlace: String(i + 1),
            athlete: { shortName: name },
          })),
          { starter: false, jersey: "23", athlete: { shortName: "Sub" } },
        ],
      },
      {
        homeAway: "away",
        team: { formation: "4-3-3" },
        roster: Array.from({ length: 11 }, (_, i) => ({
          starter: true,
          jersey: String(i + 1),
          formationPlace: String(i + 1),
          athlete: { shortName: `Player ${i + 1}` },
        })),
      },
    ],
  };

  it("maps boxscore stats by role, home column first", () => {
    const { stats } = normalizeSummary(SUMMARY);
    expect(stats?.[0]).toMatchObject({
      label: "Possession",
      home: "58%",
      away: "42%",
    });
    expect(stats?.[1]).toMatchObject({ label: "Shots", home: "14", away: "9" });
  });

  it("builds formation rows GK-first from formationPlace order", () => {
    const { lineups } = normalizeSummary(SUMMARY);
    expect(lineups?.home.formation).toBe("4-4-2");
    expect(lineups?.home.rows.map((r) => r.length)).toEqual([1, 4, 4, 2]);
    expect(lineups?.home.rows[0][0].name).toBe("Alisson");
    expect(lineups?.away.rows.map((r) => r.length)).toEqual([1, 4, 3, 3]);
  });

  it("returns nothing rather than throwing on junk", () => {
    expect(normalizeSummary(null)).toEqual({
      stats: undefined,
      lineups: undefined,
    });
  });
});

describe("normalizeStandings", () => {
  const STANDINGS = {
    children: [
      {
        name: "Group A",
        standings: {
          entries: [
            {
              team: { abbreviation: "MEX", displayName: "Mexico" },
              note: { description: "Advance to knockout" },
              stats: [
                { name: "gamesPlayed", value: 3 },
                { name: "wins", value: 2 },
                { name: "ties", value: 1 },
                { name: "losses", value: 0 },
                { name: "pointDifferential", value: 4 },
                { name: "points", value: 7 },
                { name: "rank", value: 1 },
              ],
            },
            {
              team: { abbreviation: "RSA", displayName: "South Africa" },
              stats: [
                { name: "gamesPlayed", value: 3 },
                { name: "wins", value: 0 },
                { name: "ties", value: 1 },
                { name: "losses", value: 2 },
                { name: "pointDifferential", value: -4 },
                { name: "points", value: 1 },
                { name: "rank", value: 4 },
              ],
            },
          ],
        },
      },
    ],
  };

  it("maps groups with records, GD, points and qualification", () => {
    const groups = normalizeStandings(STANDINGS);
    expect(groups).toHaveLength(1);
    expect(groups[0].name).toBe("Group A");
    expect(groups[0].rows[0]).toEqual({
      teamCode: "MEX",
      played: 3,
      record: "2-1-0",
      gd: 4,
      pts: 7,
      qualified: true,
    });
    expect(groups[0].rows[1].qualified).toBe(false);
  });

  it("returns [] on junk", () => {
    expect(normalizeStandings(null)).toEqual([]);
    expect(normalizeStandings({ children: [{}] })).toEqual([]);
  });
});
