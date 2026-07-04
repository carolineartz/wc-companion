import { MOCK_NOW } from "@/data/matches";
import { formatKickoff, greeting, isToday, untilKickoff } from "./time";

// MOCK_NOW is 2026-06-30T15:50 (see data/matches.ts).
describe("time helpers", () => {
  it("formats kick-off as 24h", () => {
    expect(formatKickoff("2026-06-30T18:00:00")).toBe("18:00");
    expect(formatKickoff("2026-06-30T09:05:00")).toBe("09:05");
  });

  it("counts down to kick-off", () => {
    expect(untilKickoff("2026-06-30T18:00:00", MOCK_NOW)).toBe("in 2h 10m");
    expect(untilKickoff("2026-06-30T16:35:00", MOCK_NOW)).toBe("in 45m");
    expect(untilKickoff("2026-06-30T14:30:00", MOCK_NOW)).toBe(""); // started
  });

  it("knows which fixtures are today", () => {
    expect(isToday("2026-06-30T21:00:00", MOCK_NOW)).toBe(true);
    expect(isToday("2026-06-29T18:00:00", MOCK_NOW)).toBe(false);
  });

  it("greets by time of day", () => {
    expect(greeting(MOCK_NOW)).toBe("Good afternoon");
    expect(greeting(new Date("2026-06-30T08:00:00"))).toBe("Good morning");
    expect(greeting(new Date("2026-06-30T21:30:00"))).toBe("Good evening");
  });
});
