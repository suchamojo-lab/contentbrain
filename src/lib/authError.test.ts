import { describe, expect, it } from "vitest";
import { authErrorMessage } from "./authError";

describe("authErrorMessage", () => {
  it("turns Convex password failures into a useful message", () => {
    expect(authErrorMessage(new Error("Uncaught Error: InvalidSecret"))).toBe(
      "That email or password doesn’t match.",
    );
    expect(authErrorMessage(new Error("Invalid credentials"))).toBe(
      "That email or password doesn’t match.",
    );
  });

  it("uses a safe fallback for unknown failures", () => {
    expect(authErrorMessage(null)).toBe(
      "We couldn't sign you in. Please try again.",
    );
  });

  it("explains an invalid reset code", () => {
    expect(authErrorMessage(new Error("Could not verify code"))).toBe(
      "That reset code is incorrect or has expired.",
    );
  });
});
