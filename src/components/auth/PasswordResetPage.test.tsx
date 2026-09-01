import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PasswordResetPage } from "./PasswordResetPage";

const signIn = vi.fn();

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signIn }),
}));

vi.mock("../site/PublicSiteLayout", () => ({
  PublicSiteLayout: ({ children }: { children: React.ReactNode }) => children,
}));

describe("PasswordResetPage", () => {
  beforeEach(() => signIn.mockReset().mockResolvedValue(undefined));

  it("requests a code and submits it with a new password", async () => {
    const user = userEvent.setup();
    render(<PasswordResetPage />);

    await user.type(screen.getByRole("textbox", { name: "EMAIL" }), "Me@Example.com");
    await user.click(screen.getByRole("button", { name: /send reset code/i }));

    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(1));
    const request = signIn.mock.calls[0][1] as FormData;
    expect(request.get("flow")).toBe("reset");
    expect(request.get("email")).toBe("Me@Example.com");

    expect(screen.getByText(/code sent to me@example.com/i)).toBeInTheDocument();
    const code = screen.getByRole("textbox", { name: "RESET CODE" });
    const password = screen.getByLabelText("NEW PASSWORD");
    await user.type(code, "12345678");
    await user.type(password, "new-password");
    expect(code).toHaveValue("12345678");
    expect(password).toHaveValue("new-password");
    fireEvent.submit(code.closest("form")!);

    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(2));
    const verification = signIn.mock.calls[1][1] as FormData;
    expect(verification.get("flow")).toBe("reset-verification");
    expect(verification.get("email")).toBe("me@example.com");
    expect(verification.get("code")).toBe("12345678");
    expect(verification.get("newPassword")).toBe("new-password");
  });
});
