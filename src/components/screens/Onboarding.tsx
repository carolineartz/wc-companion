import { Check } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/Switch";
import { TeamBadge } from "@/components/TeamBadge";
import { getTeam, PICKABLE_TEAMS } from "@/data/teams";
import { DEFAULT_ALERTS } from "@/lib/profile";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

/**
 * First-run team picker + alert prefs. Also reused as "Edit" from the You
 * screen — pass the existing profile and it starts prefilled.
 */
export function Onboarding({
  initial,
  onDone,
}: {
  initial: Profile | null;
  onDone: (p: Profile) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [teams, setTeams] = useState<string[]>(initial?.teams ?? []);
  const [alerts, setAlerts] = useState(initial?.alerts ?? DEFAULT_ALERTS);

  const toggleTeam = (code: string) =>
    setTeams((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );

  const save = () =>
    onDone({
      name: name.trim(),
      teams,
      alerts,
      theme: initial?.theme ?? "dark",
    });

  return (
    <div className="mx-auto min-h-full w-full max-w-md pb-28">
      <div className="px-4 pt-6">
        <div className="flex gap-2">
          {(["teams", "alerts", "done"] as const).map((step, i) => (
            <span
              key={step}
              className={cn(
                "h-1 flex-1 rounded-full",
                i < 2 ? "bg-primary" : "bg-secondary",
              )}
            />
          ))}
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold leading-tight">
          Follow your
          <br />
          World Cup
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pick the teams you care about. Your home screen, bracket and alerts
          revolve around them.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="mt-5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="mt-6 flex items-baseline justify-between">
          <p className="section-label">Pick your teams</p>
          <p className="text-xs text-primary">
            {teams.length} team{teams.length === 1 ? "" : "s"} selected
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {PICKABLE_TEAMS.map((code) => {
            const team = getTeam(code);
            const selected = teams.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggleTeam(code)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 text-left text-sm",
                  selected ? "bg-card" : "border-transparent bg-card",
                )}
                style={selected ? { borderColor: team.badge.bg } : undefined}
              >
                <TeamBadge code={code} />
                <span className="flex-1 truncate">{team.name}</span>
                {selected && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/80">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="section-label mt-7">Alerts</p>
        <div className="mt-3 flex flex-col rounded-2xl bg-card">
          <AlertRow
            title="Match starting soon"
            detail="15 min before kick-off"
            checked={alerts.kickoff}
            onChange={(v) => setAlerts({ ...alerts, kickoff: v })}
          />
          <AlertRow
            title="Goals"
            detail="Every goal in tracked matches"
            checked={alerts.goals}
            onChange={(v) => setAlerts({ ...alerts, goals: v })}
            divider
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-[max(env(safe-area-inset-bottom),1rem)] pt-6">
        <div className="mx-auto max-w-md px-4">
          <button
            type="button"
            disabled={teams.length === 0}
            onClick={save}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            Continue
            {teams.length > 0 &&
              ` · ${teams.length} team${teams.length === 1 ? "" : "s"} selected`}
          </button>
        </div>
      </div>
    </div>
  );
}

function AlertRow({
  title,
  detail,
  checked,
  onChange,
  divider = false,
}: {
  title: string;
  detail: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  divider?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-4",
        divider && "border-t border-border/60",
      )}
    >
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}
