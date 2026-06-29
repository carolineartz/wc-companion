import { describe, it, expect } from "vitest";

import { parseJerseyNumber } from "@/lib/numbers";

describe("parseJerseyNumber", () => {
  it("reads spelled-out single words", () => {
    expect(parseJerseyNumber("number ten")).toBe(10);
    expect(parseJerseyNumber("show me nine")).toBe(9);
    expect(parseJerseyNumber("who is zero")).toBe(0);
  });

  it("reads plain digits", () => {
    expect(parseJerseyNumber("player 9")).toBe(9);
    expect(parseJerseyNumber("23")).toBe(23);
  });

  it("prefers digits when both are present", () => {
    expect(parseJerseyNumber("number 7 seven")).toBe(7);
  });

  it("reads compound tens (with or without a hyphen)", () => {
    expect(parseJerseyNumber("twenty three")).toBe(23);
    expect(parseJerseyNumber("who is forty-five")).toBe(45);
    expect(parseJerseyNumber("ninety")).toBe(90);
  });

  it("is case-insensitive", () => {
    expect(parseJerseyNumber("NUMBER ELEVEN")).toBe(11);
  });

  it("returns null when there is no number", () => {
    expect(parseJerseyNumber("show me the captain")).toBeNull();
    expect(parseJerseyNumber("")).toBeNull();
  });

  it("ignores out-of-range multi-digit input", () => {
    // Only the first 1-2 digit run is considered.
    expect(parseJerseyNumber("100")).toBe(10);
  });
});
