import { Check } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEAMS } from "@/data/rosters";
import { getTeamColors } from "@/data/teamColors";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

interface ProfileFormProps {
  initial?: Profile;
  submitLabel: string;
  onSave: (profile: Profile) => void;
}

/**
 * Customization layer. A second user sets their own name + favorite team(s)
 * with zero code — used both on first run and in Settings.
 */
export function ProfileForm({
  initial,
  submitLabel,
  onSave,
}: ProfileFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [selected, setSelected] = useState<string[]>(
    initial?.favoriteTeamIds ?? [],
  );
  const [error, setError] = useState<string | null>(null);

  const toggleTeam = (id: string) => {
    setError(null);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Add your name");
      return;
    }
    if (selected.length === 0) {
      setError("Pick at least one team");
      return;
    }
    onSave({ name: name.trim(), favoriteTeamIds: selected });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Your name
        </label>
        <Input
          id="name"
          placeholder="e.g. Dad"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Favorite team(s)
        </span>
        <div className="grid grid-cols-2 gap-2">
          {TEAMS.map((team) => {
            const active = selected.includes(team.id);
            const accent = getTeamColors(team.id).accent;
            return (
              <button
                key={team.id}
                type="button"
                onClick={() => toggleTeam(team.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left transition-colors",
                  active
                    ? "border-primary bg-card"
                    : "border-border bg-transparent hover:bg-card",
                )}
                style={active ? { borderColor: accent } : undefined}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden className="text-xl">
                    {team.flag}
                  </span>
                  <span className="font-display text-sm font-semibold uppercase tracking-wide">
                    {team.name}
                  </span>
                </span>
                {active && (
                  <Check className="h-4 w-4" style={{ color: accent }} />
                )}
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          The first team you pick is the one shown on the roster.
        </p>
      </div>

      {error && <p className="font-mono text-xs text-destructive">{error}</p>}

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
