# World Cup Companion — screen reference (16 images)

Interactive prototype reference for implementation. Design system: "Pitch UI" (shadcn/tweakcn theme,
Sometype Mono + Geist Mono + Arvo, 1rem radius, light+dark modes — all screens shown in dark).
Mobile screens are 392×812 (iPhone-style). Data is mock (June 30, 2026, Round of 16).

## Mobile app (Broadcast direction)
- 01-today.png — Home/schedule: greeting, favorite-team chips, LIVE hero card (match kit colors, not identity colors), today's fixtures (kick-off time or FT + score), favorites flagged
- 02-match-overview.png — Match focus, Overview tab: score header w/ kit swatches, Who to Watch player cards, win probability, Path to This Point per team, H2H, recent form
- 03-match-lineups.png — Lineups tab: formations on pitch
- 04-match-stats.png — Stats tab: possession/shots/xG bars + win-prob momentum sparkline
- 05-bracket.png — Knockout bracket R16→Final, horizontal scroll, live match outlined, TBD feeders
- 06-standings.png — Group standings (qualified rows tinted)
- 07-golden-boot.png — Top scorers, avatars, tap → player
- 08-player-pulisic.png — Player profile WITH photo: nation crest header, photo panel, club+league pills (tap → 09/10), stats line, HEADLINE blurb
- 11-player-reijnders.png — Player profile WITHOUT photo: jersey panel (surname + big squad number) fallback
- 09-club-ac-milan.png — Club focus: logo, league pill, all WC players from this club (cross-national)
- 10-league-serie-a.png — League focus: logo, players grouped by club
- 12-you-settings.png — Profile: your teams, notification toggles (persisted to localStorage), theme

## Other surfaces
- 13-menubar.png — Electron menubar companion (macOS): live score in the menu bar itself; dropdown = live match + win bar, next-up for your team, today list, latest-event ticker, goal-alerts toggle
- 14-lockscreen-alerts.png — Push notifications: kick-off soon, goal, full-time (all user-configurable)
- 15-onboarding.png — Team picker + alert prefs; Continue persists favorites to localStorage
- 16-parked-timeline.png — PARKED design (not in MVP): match event timeline. Keep out of build.

Key behaviors: team colors in a match context = that match's actual KIT colors (home/change),
not the flag/identity color. Favorites drive the Today ordering, "your team" flags, and alerts.
