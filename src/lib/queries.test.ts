import {
  clubsInLeague,
  feederLabel,
  goldenBoot,
  playersByClub,
  todaysMatches,
} from "./queries";

describe("goldenBoot", () => {
  it("sorts by goals, then assists", () => {
    const boot = goldenBoot();
    expect(boot[0].id).toBe("mbappe");
    expect(boot[1].id).toBe("vinicius");
    for (let i = 1; i < boot.length; i++) {
      const prev = boot[i - 1];
      const cur = boot[i];
      expect(
        prev.goals > cur.goals ||
          (prev.goals === cur.goals && prev.assists >= cur.assists),
      ).toBe(true);
    }
  });
});

describe("club and league drill-downs", () => {
  it("finds all four AC Milan players across nations", () => {
    const milan = playersByClub("ac-milan");
    expect(milan).toHaveLength(4);
    expect(new Set(milan.map((p) => p.teamCode))).toEqual(
      new Set(["USA", "POR", "FRA", "NED"]),
    );
  });

  it("groups Serie A by club, biggest contingent first", () => {
    const serieA = clubsInLeague("serie-a");
    expect(serieA[0].club.id).toBe("ac-milan");
    const total = serieA.reduce((n, c) => n + c.players.length, 0);
    expect(total).toBe(6);
    expect(serieA).toHaveLength(3);
  });
});

describe("todaysMatches", () => {
  it("puts live first, then the user's teams, then by kick-off", () => {
    const ids = todaysMatches(["USA", "ARG"]).map((m) => m.id);
    expect(ids).toEqual([
      "r16-bra-mar", // live
      "r16-ned-usa", // favorite, 18:00
      "r16-arg-jpn", // favorite, 20:00
      "r16-fra-sen", // 21:00
    ]);
  });
});

describe("feederLabel (bracket)", () => {
  it("resolves a finished feeder to the winner", () => {
    // QF slot 1 is fed by R16 slots 2 (FRA/SEN) and 3 (ESP beat CRO).
    expect(feederLabel("QF", 1)).toEqual(["FRA/SEN", "ESP"]);
  });

  it("labels unplayed feeders as pairings", () => {
    expect(feederLabel("QF", 0)).toEqual(["BRA/MAR", "ARG/JPN"]);
  });
});
