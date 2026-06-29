// Spoken-number parsing for the voice flow. Turns an utterance like
// "show me number ten" or "player 9" into the integer 10 / 9.

const ONES: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

/**
 * Extract a jersey number (0-99) from a spoken phrase.
 * Returns null if no number is found.
 *
 * Examples:
 *   "number ten"        -> 10
 *   "show me 9"         -> 9
 *   "twenty three"      -> 23
 *   "who is forty-five" -> 45
 */
export function parseJerseyNumber(utterance: string): number | null {
  const text = utterance.toLowerCase();

  // 1) Plain digits win if present.
  const digits = text.match(/\d{1,2}/);
  if (digits) {
    const n = parseInt(digits[0], 10);
    if (n >= 0 && n <= 99) return n;
  }

  // 2) Spelled-out numbers. Scan tokens for "<tens> <ones>" or single words.
  const tokens = text.replace(/-/g, " ").split(/\s+/).filter(Boolean);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t in TENS) {
      const next = tokens[i + 1];
      if (next && next in ONES && ONES[next] < 10) {
        return TENS[t] + ONES[next];
      }
      return TENS[t];
    }
    if (t in ONES) {
      return ONES[t];
    }
  }

  return null;
}
