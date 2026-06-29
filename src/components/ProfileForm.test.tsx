import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProfileForm } from "@/components/ProfileForm";

describe("<ProfileForm />", () => {
  it("blocks submit and shows an error when the name is empty", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ProfileForm submitLabel="Start watching" onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /start watching/i }));

    expect(screen.getByText(/add your name/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("requires at least one team", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ProfileForm submitLabel="Start watching" onSave={onSave} />);

    await user.type(screen.getByLabelText(/your name/i), "Dad");
    await user.click(screen.getByRole("button", { name: /start watching/i }));

    expect(screen.getByText(/pick at least one team/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("saves the trimmed name and selected team", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<ProfileForm submitLabel="Start watching" onSave={onSave} />);

    await user.type(screen.getByLabelText(/your name/i), "Dad");
    await user.click(screen.getByRole("button", { name: /united states/i }));
    await user.click(screen.getByRole("button", { name: /start watching/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      name: "Dad",
      favoriteTeamIds: ["usa"],
    });
  });

  it("pre-fills from an existing profile", () => {
    render(
      <ProfileForm
        submitLabel="Save changes"
        initial={{ name: "Dad", favoriteTeamIds: ["usa"] }}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/your name/i)).toHaveValue("Dad");
    expect(
      screen.getByRole("button", { name: /united states/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
