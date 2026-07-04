import { TeamBadge } from "@/components/TeamBadge";
import { getTeam } from "@/data/teams";
import { initials, onColor } from "@/lib/color";
import { favoriteIn, liveMatches, todaysMatches } from "@/lib/queries";
import { formatKickoff, formatToday, greeting, untilKickoff } from "@/lib/time";
import type { Match, Profile } from "@/types";

export function TodayScreen({ profile }: { profile: Profile }) {
  const live = liveMatches();
  const fixtures = todaysMatches(profile.teams).filter(
    (m) => m.status !== "live",
  );
  const liveLabel =
    live.length === 1 ? "1 match live now" : `${live.length} matches live now`;

  return (
    <div className="px-4 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {greeting()}
            {profile.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatToday()}
            {live.length > 0 && <> · {liveLabel}</>}
          </p>
        </div>
        <a
          href="#/you"
          aria-label="Your profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-num text-xs font-bold"
        >
          {initials(profile.name || "You")}
        </a>
      </header>

      <p className="section-label mt-6">Your teams</p>
      <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4">
        {profile.teams.map((code) => (
          <span
            key={code}
            className="flex shrink-0 items-center gap-2 rounded-full bg-card py-1.5 pl-2 pr-4 text-sm"
          >
            <TeamBadge code={code} />
            {getTeam(code).name}
          </span>
        ))}
      </div>

      {live.map((m) => (
        <LiveHero key={m.id} match={m} />
      ))}

      <p className="section-label mt-7">
        Today · {fixtures[0]?.stageLabel ?? "Fixtures"}
      </p>
      <div className="mt-3 flex flex-col gap-3 pb-6">
        {fixtures.map((m) => (
          <FixtureCard key={m.id} match={m} profile={profile} />
        ))}
      </div>
    </div>
  );
}

/** The big tappable live-match card. Blocks use KIT colors, not identity. */
function LiveHero({ match }: { match: Match }) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  return (
    <a
      href={`#/match/${match.id}`}
      className="mt-4 block rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/10 to-card p-4"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 font-bold text-destructive">
          <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
          LIVE · {match.minute}&apos;
        </span>
        <span className="text-muted-foreground">{match.stageLabel}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <KitBlock code={match.home} color={home.kit.primary} />
        <div className="text-center">
          <p className="font-num text-4xl font-bold tracking-wider">
            {match.score?.home}
            <span className="mx-1.5 text-muted-foreground">:</span>
            {match.score?.away}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {match.minute}&apos; · {match.period}
          </p>
        </div>
        <KitBlock code={match.away} color={away.kit.primary} />
      </div>
      <div className="mt-1 flex justify-between px-1 text-sm">
        <span>{home.name}</span>
        <span>{away.name}</span>
      </div>
    </a>
  );
}

function KitBlock({ code, color }: { code: string; color: string }) {
  return (
    <span
      className="flex h-14 w-16 items-center justify-center rounded-xl font-num text-sm font-bold"
      style={{ backgroundColor: color, color: onColor(color) }}
    >
      {code}
    </span>
  );
}

function FixtureCard({ match, profile }: { match: Match; profile: Profile }) {
  const yours = favoriteIn(match, profile);
  const finished = match.status === "ft";
  return (
    <a
      href={`#/match/${match.id}`}
      className={`block rounded-2xl bg-card p-4 ${
        yours.length > 0
          ? "border border-accent/40"
          : "border border-transparent"
      }`}
    >
      <div className="flex gap-4">
        <div className="w-14 shrink-0 pt-0.5 text-center">
          {finished ? (
            <p className="font-num text-sm font-bold text-muted-foreground">
              FT
            </p>
          ) : (
            <>
              <p className="font-num text-sm font-bold text-primary">
                {formatKickoff(match.kickoff)}
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                {untilKickoff(match.kickoff)}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          {(["home", "away"] as const).map((side) => (
            <div key={side} className="flex items-center gap-2.5">
              <TeamBadge code={match[side]} />
              <span className="flex-1 text-sm">
                {getTeam(match[side]).name}
              </span>
              <span className="font-num text-sm font-bold text-muted-foreground">
                {finished && match.score ? match.score[side] : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
      {yours.length > 0 && (
        <p className="mt-3 flex items-center gap-2 border-t border-border/60 pt-2.5 text-xs text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {yours.map((c) => getTeam(c).name).join(" · ")} ·{" "}
          {yours.length > 1 ? "your teams" : "one of your teams"}
        </p>
      )}
    </a>
  );
}
