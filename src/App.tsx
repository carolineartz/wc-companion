import { useEffect, useMemo, useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";

import type { Player, Profile } from "@/types";
import { TEAMS, getTeam } from "@/data/rosters";
import { loadProfile, saveProfile, clearProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { FirstRun } from "@/components/FirstRun";
import { Roster } from "@/components/Roster";
import { KitCard } from "@/components/KitCard";
import { Settings } from "@/components/Settings";

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [activeTeamId, setActiveTeamId] = useState<string>("");
  const [selected, setSelected] = useState<Player | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Keep the active team in sync with the profile's favorites.
  useEffect(() => {
    if (!profile) return;
    if (!profile.favoriteTeamIds.includes(activeTeamId)) {
      setActiveTeamId(profile.favoriteTeamIds[0]);
    }
  }, [profile, activeTeamId]);

  const team = useMemo(
    () => getTeam(activeTeamId) ?? getTeam(profile?.favoriteTeamIds[0] ?? ""),
    [activeTeamId, profile],
  );

  const handleSaveProfile = (p: Profile) => {
    saveProfile(p);
    setProfile(p);
  };

  const handleReset = () => {
    clearProfile();
    setProfile(null);
    setSettingsOpen(false);
    setActiveTeamId("");
  };

  if (!profile) {
    return <FirstRun onSave={handleSaveProfile} />;
  }

  const favorites = TEAMS.filter((t) => profile.favoriteTeamIds.includes(t.id));

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-6">
      <header className="mb-8 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            2026 · Watching Companion
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {team?.flag} {team?.name ?? "Squad"}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Hi, {profile.name} — tap a number or use the mic.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {favorites.length > 1 && (
            <Select value={team?.id} onValueChange={setActiveTeamId}>
              <SelectTrigger className="w-[10rem]" aria-label="Active team">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {favorites.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.flag} {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon />
          </Button>
        </div>
      </header>

      {team && <Roster team={team} onSelect={setSelected} />}

      {/* Player detail = the kit card, in a Sheet */}
      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          {team && selected && (
            <KitCard team={team} player={selected} profile={profile} />
          )}
        </SheetContent>
      </Sheet>

      <Settings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        profile={profile}
        onSave={handleSaveProfile}
        onReset={handleReset}
      />
    </div>
  );
}
