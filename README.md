# WC Companion · 2026

A dark, **floodlit-pitch** watching companion for the 2026 World Cup. Pick your
team, browse the squad as a grid of kit-number tiles, and tap (or _say_) a
number to open that player's **kit card** with a live, web-searched briefing —
who they are, their current club and league, and 2026 World Cup context.

Number-forward and monospace-for-data by design, so scores, tags, and shirt
numbers always line up.

## What it does

- **First-run profile** — set your name + favorite team(s); saved to
  `localStorage` (`companion.profile`). Editable anytime in Settings. This is
  the customization layer: a second person (hi, Dad) sets their own name and
  team with zero code.
- **Roster** — the selected team's squad as big kit-number tiles, sortable by
  number, with a number input to jump straight to a player.
- **Kit card** — opens in a sheet: flag + national team + position, a "shirt"
  block in the **national team's kit colors** (nameset over a large kit
  number), tappable **club** and **league** chips that open a short live
  summary, and a briefing paragraph underneath.
- **Voice** — a mic button (Web Speech API). Say "number ten" → it extracts
  `10`, resolves the player, and opens the kit card. Optionally reads the card
  aloud. Feature-detected; the button simply hides where unsupported.

Both a tile tap and a spoken number flow through the same core action,
`resolvePlayer(teamId, number)`.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** + **shadcn/ui** (`card`, `sheet`, `button`, `input`,
  `select`, `skeleton`)
- **Adobe Typekit** fonts in three roles — `spent-vf` (display: titles, names,
  kit numbers), `area-variable` (sans: UI + briefing prose), `calling-code`
  (mono: numbers, tags, scores)
- **Netlify** for hosting + serverless function
- **Anthropic Messages API** (server-side) with the **web search** tool for
  live club/league/form
- **Vitest** + **Testing Library** (jsdom) for unit and component tests
- **Biome** for linting + formatting

No router — simple view state. Seed rosters are hard-coded
(`src/data/rosters.ts`) so the app works end-to-end with no external API.

## How this was built with AI

- **Built with Claude Code, from my phone.** The whole skeleton — components,
  design tokens, serverless function, this README — was scaffolded by
  describing it to Claude Code and iterating.
- **The companion is Claude + live web search.** `netlify/functions/companion.ts`
  calls the Anthropic Messages API server-side (model `claude-opus-4-8`) with
  the `web_search` tool enabled, so a player's _current_ club, league, and form
  come from the live web — not from training data — and returns **structured
  JSON** (`briefing`, `club`, `league`, `clubColors`, `position`). The browser
  never sees the API key.
- **Voice is the browser's Web Speech API.** Speech recognition captures a
  jersey number; speech synthesis can read the card back. No model involved —
  it just feeds `resolvePlayer`.
- **The design was iterated as mockups** — the dark floodlit-pitch palette,
  the kit-card "shirt" block, and the number-forward, mono-for-data treatment
  came from refining locked mockups into the design tokens in
  `src/index.css` + `tailwind.config.js`.

## Make it yours (no coding required)

The app remembers one profile per device. To set yours:

1. Open the app. On first run, type **your name** and tap **your team(s)**,
   then **Start watching**.
2. Want to change it later? Tap the **gear icon** (top right) → update your
   name or teams → **Save changes**. **Reset profile** clears it and starts
   over.

That's it — no files to edit. (If you want a different national team than the
two seeded here, that needs a small code change in `src/data/rosters.ts`; see
below.)

## Run it locally

```bash
npm install
npm run dev          # app only (the companion function returns a fallback)
```

To exercise the live companion locally, use the Netlify CLI so the function and
its env var load together:

```bash
cp .env.example .env # then put your real ANTHROPIC_API_KEY in .env
npx netlify dev
```

## Tests, lint & types

[Vitest](https://vitest.dev) + Testing Library (jsdom) for tests,
[Biome](https://biomejs.dev) for lint + format, and `tsc` for types.

```bash
npm test            # run tests once
npm run test:watch  # watch mode
npm run test:coverage  # coverage report (text + html in ./coverage)

npm run lint        # biome check (lint + format + import order)
npm run lint:fix    # biome check --write (autofix)
npm run format      # biome format --write

npm run typecheck   # tsc -b (also runs inside npm run build)
```

What's covered today:

- **Logic units** — `parseJerseyNumber`, `resolvePlayer`, profile
  load/save/validate, and the companion response normalization (hex validation
  + neutral fallbacks, via a mocked `fetch`).
- **Component tests** (Testing Library + jsdom) — `ProfileForm` (validation +
  save payload), `Roster` (tile render, tap-to-select, jump-to-number), and
  `KitCard` (static identity renders immediately; club/league/briefing appear
  after the fetch resolves).

Test files live next to the code as `*.test.ts(x)`; shared setup is in
`src/test/setup.ts`. Biome is configured in `biome.json` (Tailwind CSS is
excluded since `@tailwind`/`@apply` aren't standard CSS).

## Deploy to Netlify

1. Push this repo to GitHub and "Add new site → Import" in Netlify.
2. Build settings are already in `netlify.toml` (build `npm run build`, publish
   `dist`, functions `netlify/functions`).
3. In **Site settings → Environment variables**, add `ANTHROPIC_API_KEY`.
4. Deploy. The companion function lives at `/.netlify/functions/companion`.

> The companion uses web search, which can be slow. If you see timeouts, raise
> the function timeout in your Netlify plan settings.

## Project map

```
index.html                      Typekit <link>, root mount
src/
  index.css                     design tokens (HSL shadcn vars) + font roles
  App.tsx                       view state: profile → roster → kit card
  types.ts                      shared domain types
  data/
    rosters.ts                  seed squads (USA + editable "Dad's Team")
    teamColors.ts               national kit palettes
  lib/
    resolvePlayer.ts            CORE ACTION (tile tap + voice share this)
    companion.ts                client calls to the serverless function
    numbers.ts                  "number ten" → 10
    profile.ts                  localStorage profile
  hooks/useVoice.ts             Web Speech API (feature-detected)
  components/                   FirstRun, Roster, KitCard, Settings, MicButton…
    ui/                         shadcn components
  test/setup.ts                 Vitest setup (jest-dom matchers, cleanup)
  **/*.test.ts(x)               co-located unit + component tests
netlify/functions/companion.ts  Anthropic + web search → structured JSON
biome.json                      lint + format config
.claude/                        SessionStart hook (installs deps in web sessions)
```

## Roadmap / deferred

- Swap the seed rosters for a live football API (squads change constantly).
- A custom MCP server for richer match-time context.
- More national teams + their kit palettes (currently USA, Argentina, Canada,
  Mexico, plus a neutral default).
