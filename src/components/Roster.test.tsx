import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Roster } from "@/components/Roster";
import { getTeam } from "@/data/rosters";

const usa = getTeam("usa")!;

describe("<Roster />", () => {
  it("renders a tile for every player on the squad", () => {
    render(<Roster team={usa} onSelect={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /christian pulisic/i }),
    ).toBeInTheDocument();
    // One tile per seed player.
    const tiles = screen
      .getAllByRole("button")
      .filter((b) =>
        /matt turner|christian pulisic|tim weah/i.test(b.textContent ?? ""),
      );
    expect(tiles.length).toBe(3);
  });

  it("calls onSelect with the player when a tile is tapped", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Roster team={usa} onSelect={onSelect} />);

    await user.click(
      screen.getByRole("button", { name: /christian pulisic/i }),
    );

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ number: 10, name: "Christian Pulisic" }),
    );
  });

  it("jumps to a player by number", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Roster team={usa} onSelect={onSelect} />);

    await user.type(screen.getByLabelText(/jump to #/i), "10");
    await user.click(screen.getByRole("button", { name: /^go$/i }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ number: 10 }),
    );
  });

  it("shows an error and does not select for an unknown number", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Roster team={usa} onSelect={onSelect} />);

    await user.type(screen.getByLabelText(/jump to #/i), "99");
    await user.click(screen.getByRole("button", { name: /^go$/i }));

    expect(screen.getByText(/no #99 on this squad/i)).toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
