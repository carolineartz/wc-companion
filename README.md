# World Cup Companion · 2026

[![CI](https://github.com/carolineartz/wc-companion/actions/workflows/ci.yml/badge.svg)](https://github.com/carolineartz/wc-companion/actions/workflows/ci.yml)

A mobile-first watching companion for the 2026 World Cup, in the **"Pitch UI /
Broadcast"** direction (design mocks in [`docs/screens/`](docs/screens)).

**Status: working prototype for finding out what we actually want.** Every
screen is clickable and wired together, but all data is mock — the app's
clock is frozen at *Tuesday June 30, 2026, 15:50*, mid-Round-of-16, with
Brazil–Morocco live at 2–1 in the 67th minute. Use it, notice what you reach
for (and what you never touch), and rip out the rest.

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

Deliberately **not** built yet (parked until the core proves itself): the
Electron menubar app, real push notifications, the match event timeline
(mock 16), and any live data source.

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
