import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Onboarding } from "./Onboarding";

describe("Onboarding", () => {
  it("disables Continue until at least one team is picked", () => {
    render(<Onboarding initial={null} onDone={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Continue/ })).toBeDisabled();
  });

  it("saves the picked teams and name", async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(<Onboarding initial={null} onDone={onDone} />);

    await user.type(screen.getByPlaceholderText(/Your name/), "Alex");
    await user.click(screen.getByRole("button", { name: /Brazil/ }));
    await user.click(screen.getByRole("button", { name: /United States/ }));
    await user.click(
      screen.getByRole("button", { name: /Continue · 2 teams selected/ }),
    );

    expect(onDone).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Alex",
        teams: ["BRA", "USA"],
        theme: "dark",
      }),
    );
  });

  it("starts prefilled when editing an existing profile", () => {
    render(
      <Onboarding
        initial={{
          name: "Alex",
          teams: ["POR"],
          alerts: {
            kickoff: true,
            goals: true,
            yourTeamsOnly: true,
            fullTime: false,
          },
          theme: "dark",
        }}
        onDone={vi.fn()}
      />,
    );
    expect(screen.getByDisplayValue("Alex")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Continue · 1 team selected/ }),
    ).toBeEnabled();
  });
});
