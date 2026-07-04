import { render, screen } from "@testing-library/react";
import { TournamentProvider } from "@/hooks/useTournament";
import { DEFAULT_ALERTS } from "@/lib/profile";
import { demoSource } from "@/lib/source";
import type { Profile } from "@/types";
import { TodayScreen } from "./TodayScreen";

const PROFILE: Profile = {
  name: "Alex",
  teams: ["USA", "BRA", "ARG"],
  alerts: DEFAULT_ALERTS,
  theme: "dark",
};

function renderToday() {
  return render(
    <TournamentProvider source={demoSource}>
      <TodayScreen profile={PROFILE} />
    </TournamentProvider>,
  );
}

describe("TodayScreen (demo source)", () => {
  it("greets by name and shows the live count", async () => {
    renderToday();
    expect(screen.getByText("Good afternoon, Alex")).toBeInTheDocument();
    expect(await screen.findByText(/1 match live now/)).toBeInTheDocument();
  });

  it("shows the live hero with the current score", async () => {
    renderToday();
    const label = await screen.findByText(/LIVE · 67'/);
    expect(label.closest("a")).toHaveAttribute("href", "#/match/r16-bra-mar");
  });

  it("flags fixtures involving the user's teams", async () => {
    renderToday();
    expect(
      await screen.findByText(/United States · one of your teams/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Argentina · one of your teams/),
    ).toBeInTheDocument();
  });
});
