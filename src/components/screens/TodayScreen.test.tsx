import { render, screen } from "@testing-library/react";
import { DEFAULT_ALERTS } from "@/lib/profile";
import type { Profile } from "@/types";
import { TodayScreen } from "./TodayScreen";

const PROFILE: Profile = {
  name: "Alex",
  teams: ["USA", "BRA", "ARG"],
  alerts: DEFAULT_ALERTS,
  theme: "dark",
};

describe("TodayScreen", () => {
  it("greets by name and shows the live count", () => {
    render(<TodayScreen profile={PROFILE} />);
    expect(screen.getByText("Good afternoon, Alex")).toBeInTheDocument();
    expect(screen.getByText(/1 match live now/)).toBeInTheDocument();
  });

  it("shows the live hero with the current score", () => {
    render(<TodayScreen profile={PROFILE} />);
    expect(screen.getByText(/LIVE · 67'/)).toBeInTheDocument();
    const hero = screen.getByText(/LIVE · 67'/).closest("a");
    expect(hero).toHaveAttribute("href", "#/match/r16-bra-mar");
  });

  it("flags fixtures involving the user's teams", () => {
    render(<TodayScreen profile={PROFILE} />);
    expect(
      screen.getByText(/United States · one of your teams/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Argentina · one of your teams/),
    ).toBeInTheDocument();
  });
});
