import { BarChart3, CalendarDays, GitBranch, UserRound } from "lucide-react";
import type { Route } from "@/lib/router";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "today", label: "Today", href: "#/", icon: CalendarDays },
  { id: "bracket", label: "Bracket", href: "#/bracket", icon: GitBranch },
  { id: "stats", label: "Stats", href: "#/stats", icon: BarChart3 },
  { id: "you", label: "You", href: "#/you", icon: UserRound },
] as const;

function activeTab(route: Route): string {
  const head = route[0] ?? "";
  if (head === "bracket" || head === "stats" || head === "you") return head;
  // Detail screens (match/player/club/league) keep Today lit, per the mocks.
  return "today";
}

export function TabBar({ route }: { route: Route }) {
  const active = activeTab(route);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {TABS.map(({ id, label, href, icon: Icon }) => (
          <a
            key={id}
            href={href}
            className={cn(
              "flex w-16 flex-col items-center gap-1 rounded-lg py-1 text-[11px]",
              active === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon
              className={cn("h-5 w-5", id === "bracket" && "rotate-90")}
              strokeWidth={active === id ? 2.4 : 2}
            />
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
