# World Cup Companion · 2026

[![CI](https://github.com/carolineartz/wc-companion/actions/workflows/ci.yml/badge.svg)](https://github.com/carolineartz/wc-companion/actions/workflows/ci.yml)

A mobile-first watching companion for the 2026 World Cup, in the **"Pitch UI /
Broadcast"** direction (design mocks in [`docs/screens/`](docs/screens)).

**Status: live-data prototype.** The app follows the real 2026 tournament
through ESPN's public (unofficial, key-free) JSON feed: today's real
fixtures and live scores (repolled every 60s), the real knockout bracket,
real group standings, and per-match stats + lineups. Use it during actual
matches, notice what you reach for (and what you never touch), and rip out
the rest.

Add **`?demo`** to the URL for the frozen design dataset (June 30, 2026,
Brazil–Morocco live at 2–1 in the 67') — useful for design iteration and
as a refuge if the feed is down. If the live feed can't be reached, the
app says so and offers Retry / demo; it never renders a blank screen.

## What's in the prototype

- **Onboarding** — pick your teams + alert prefs, saved to `localStorage`.
  Re-enter anytime via **You → Edit**.
- **Today** — greeting, your-team chips, a live hero card (in the match's
  **kit colors**, deliberately not flag colors), and today's fixtures with
  your teams floated up and flagged.
- **Match** — score header with kit swatches, then tabs:
  - *Overview*: Who to Watch cards, win probability bar, path to this point,
    head-to-head + recent form
  - *Lineups*: formations laid out on a pitch
  - *Stats*: possession/shots/xG bars + a win-probability momentum sparkline
- **Bracket** — R16 → Final, horizontal scroll, live match outlined, TBD
  slots show their feeder pairings.
- **Stats** — group standings (qualified rows tinted) and the Golden Boot
  race (derived from player data — edit a player's goals and the table
  follows).
- **Player / Club / League** — player profiles (jersey-panel fallback when
  there's no photo; drop a `photoUrl` on a player to use a real one), tap
  through to their club, and from a club to everyone at the WC from that
  league, grouped by club.
- **You** — your teams, notification toggles (persisted, but no real pushes
  yet), dark/light theme.

What's live vs. demo-only today:

| | Live (ESPN) | Demo |
|---|---|---|
| Today's fixtures, live scores/clock | ✅ | ✅ |
| Bracket (incl. TBD future rounds) | ✅ | ✅ |
| Group standings | ✅ | ✅ |
| Match stats + lineups | ✅ | ✅ |
| Recent form | ✅ | ✅ |
| Golden Boot | ❌ (no free feed yet) | ✅ |
| Who to Watch, win probability, path | ❌ | ✅ |
| Player/club/league drill-downs | ❌ | ✅ |

The UI simply hides sections it has no data for, so live matches show a
leaner Overview than the demo one.

Deliberately **not** built yet (parked until the core proves itself): the
Electron menubar app, real push notifications, and the match event
timeline (mock 16).

## How live data works

- `src/lib/live/espn.ts` — fetches ESPN's public scoreboard / summary /
  standings endpoints. Direct from the browser first (ESPN sends open CORS
  headers); if that fails it retries through `/api/espn/*`, which the Vite
  dev server proxies locally and a Netlify redirect proxies in production.
- `src/lib/live/normalize.ts` — defensively maps ESPN JSON into our domain
  types (unit-tested against recorded shapes). A missing field degrades a
  section, never crashes a screen.
- `src/lib/source.ts` — the `DataSource` seam: `liveSource` vs `demoSource`.
  Everything else consumes `useTournament()` and doesn't care which is
  active. The last good live snapshot is cached in localStorage for instant
  paint.

## Where things live (for fast iteration)

```
src/
  data/            ALL mock content — edit these to change what you see
    matches.ts     fixtures, live match, lineups, stats, groups, MOCK_NOW
    players.ts     players, clubs, leagues (Golden Boot derives from goals)
    teams.ts       badge + kit + jersey colors per nation
  lib/             profile storage, hash router, time helpers, derivations
  components/
    screens/       one file per screen
    *.tsx          small shared pieces (TeamBadge, TabBar, Switch…)
  index.css        the whole theme: tokens for dark + light, font roles
```

- **Routing** is a ~30-line hash router (`#/match/r16-bra-mar`,
  `#/player/pulisic`…). Every screen is deep-linkable.
- **Fonts**: Arvo (display), Sometype Mono (UI), Geist Mono (numbers) —
  self-hosted via @fontsource.
- The **frozen clock** lives in `src/data/matches.ts` (`MOCK_NOW`).

## Run it

```bash
npm install
npm run dev
```

Open the URL it prints (on your phone: same Wi-Fi + `npm run dev -- --host`).
Deploys to Netlify from `netlify.toml` as before.

## Checks

```bash
npm test            # vitest
npm run lint        # biome (lint + format)
npm run typecheck   # tsc
npm run build
```

## History

The first pass at this app (roster grid → kit card → voice + a live
Claude-powered player briefing via `netlify/functions/companion.ts`) was a
different direction; it lives in git history, and the Netlify function is
still in the repo unused, in case live briefings come back.
