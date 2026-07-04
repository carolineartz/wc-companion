import { Switch } from "@/components/Switch";
import { TeamBadge } from "@/components/TeamBadge";
import { getTeam } from "@/data/teams";
import { initials } from "@/lib/color";
import type { Profile } from "@/types";

const ALERT_ROWS: {
  key: keyof Profile["alerts"];
  title: string;
  detail: string;
}[] = [
  {
    key: "kickoff",
    title: "Match starting soon",
    detail: "15 min before kick-off",
  },
  { key: "goals", title: "Goals", detail: "Every goal in tracked matches" },
  {
    key: "yourTeamsOnly",
    title: "Your teams only",
    detail: "Mute everything else",
  },
  {
    key: "fullTime",
    title: "Final whistle",
    detail: "Result when a match ends",
  },
];

export function YouScreen({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (p: Profile) => void;
}) {
  const setAlert = (key: keyof Profile["alerts"], value: boolean) =>
    onChange({ ...profile, alerts: { ...profile.alerts, [key]: value } });

  return (
    <div className="px-4 pb-6 pt-6">
      <header className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 font-num text-base font-bold text-primary">
          {initials(profile.name || "You")}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold">
            {profile.name || "You"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Following {profile.teams.length} team
            {profile.teams.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <p className="section-label mt-7">Your teams</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.teams.map((code) => (
          <span
            key={code}
            className="flex items-center gap-2 rounded-full bg-card py-1.5 pl-2 pr-4 text-sm"
          >
            <TeamBadge code={code} />
            {getTeam(code).name}
          </span>
        ))}
        <a
          href="#/onboarding"
          className="flex items-center rounded-full border border-dashed border-border px-4 py-1.5 text-sm text-muted-foreground"
        >
          Edit
        </a>
      </div>

      <p className="section-label mt-7">Push notifications</p>
      <div className="mt-3 flex flex-col rounded-2xl bg-card">
        {ALERT_ROWS.map(({ key, title, detail }, i) => (
          <div
            key={key}
            className={`flex items-center justify-between gap-3 p-4 ${
              i > 0 ? "border-t border-border/60" : ""
            }`}
          >
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
            </div>
            <Switch
              checked={profile.alerts[key]}
              onChange={(v) => setAlert(key, v)}
              label={title}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 px-1 text-[11px] text-muted-foreground">
        Prototype: preferences are saved, but no real pushes are sent yet.
      </p>

      <p className="section-label mt-7">Appearance</p>
      <div className="mt-3 flex items-center justify-between rounded-2xl bg-card p-4">
        <div>
          <p className="text-sm font-bold">Theme</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {profile.theme === "dark" ? "Dark mode" : "Light mode"}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...profile,
              theme: profile.theme === "dark" ? "light" : "dark",
            })
          }
          className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold"
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          Switch
        </button>
      </div>
    </div>
  );
}
