import { useEffect, useState } from "react";
import { BracketScreen } from "@/components/screens/BracketScreen";
import { ClubScreen } from "@/components/screens/ClubScreen";
import { LeagueScreen } from "@/components/screens/LeagueScreen";
import { MatchScreen } from "@/components/screens/MatchScreen";
import { Onboarding } from "@/components/screens/Onboarding";
import { PlayerScreen } from "@/components/screens/PlayerScreen";
import { StatsScreen } from "@/components/screens/StatsScreen";
import { TodayScreen } from "@/components/screens/TodayScreen";
import { YouScreen } from "@/components/screens/YouScreen";
import { TabBar } from "@/components/TabBar";
import { loadProfile, saveProfile } from "@/lib/profile";
import { navigate, useRoute } from "@/lib/router";
import type { Profile } from "@/types";

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const route = useRoute();

  // Theme lives on <html> so tokens flip app-wide.
  useEffect(() => {
    const theme = profile?.theme ?? "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  }, [profile?.theme]);

  const updateProfile = (p: Profile) => {
    saveProfile(p);
    setProfile(p);
  };

  // First run, or explicit "#/onboarding" (Edit from the You screen).
  if (!profile || route[0] === "onboarding") {
    return (
      <Onboarding
        initial={profile}
        onDone={(p) => {
          const firstRun = !profile;
          updateProfile(p);
          navigate(firstRun ? "/" : "/you");
        }}
      />
    );
  }

  return (
    <div className="mx-auto min-h-full w-full max-w-md">
      <main className="pb-24">
        <Screen route={route} profile={profile} onChange={updateProfile} />
      </main>
      <TabBar route={route} />
    </div>
  );
}

function Screen({
  route,
  profile,
  onChange,
}: {
  route: string[];
  profile: Profile;
  onChange: (p: Profile) => void;
}) {
  switch (route[0]) {
    case "match":
      return <MatchScreen id={route[1] ?? ""} />;
    case "bracket":
      return <BracketScreen />;
    case "stats":
      return <StatsScreen />;
    case "you":
      return <YouScreen profile={profile} onChange={onChange} />;
    case "player":
      return <PlayerScreen id={route[1] ?? ""} />;
    case "club":
      return <ClubScreen id={route[1] ?? ""} />;
    case "league":
      return <LeagueScreen id={route[1] ?? ""} />;
    default:
      return <TodayScreen profile={profile} />;
  }
}
