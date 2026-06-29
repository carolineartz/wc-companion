import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KitCard } from "@/components/KitCard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getTeam } from "@/data/rosters";
import type { Profile } from "@/types";

const usa = getTeam("usa")!;
const pulisic = usa.players.find((p) => p.number === 10)!;
const profile: Profile = { name: "Dad", favoriteTeamIds: ["usa"] };

// KitCard renders inside a Sheet (its header uses Radix Dialog primitives).
function renderCard() {
  return render(
    <Sheet open>
      <SheetContent>
        <KitCard team={usa} player={pulisic} profile={profile} />
      </SheetContent>
    </Sheet>,
  );
}

describe("<KitCard />", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            briefing: "Captain and talisman for the USMNT.",
            club: "AC Milan",
            league: "Serie A",
            clubColors: ["#DA291C", "#000000"],
            position: "Winger",
          }),
      }),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the player's identity immediately, before the briefing loads", () => {
    renderCard();
    // Name (nameset) + number are static, not awaited.
    expect(screen.getByText("Christian Pulisic")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(usa.name)).toBeInTheDocument();
  });

  it("renders the live club, league, and briefing once fetched", async () => {
    renderCard();
    expect(await screen.findByText("AC Milan")).toBeInTheDocument();
    expect(screen.getByText("Serie A")).toBeInTheDocument();
    expect(screen.getByText(/captain and talisman/i)).toBeInTheDocument();
  });
});
