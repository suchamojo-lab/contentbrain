import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = String(params.email ?? "")
          .trim()
          .toLowerCase();
        if (!email) throw new Error("Email is required");
        const name = String(params.name ?? "").trim();
        if (params.flow === "signUp" && name.length < 2)
          throw new Error("Please enter your name");
        return { email, ...(name ? { name } : {}) };
      },
      validatePasswordRequirements(password) {
        if (password.length < 8)
          throw new Error("Password must be at least 8 characters");
      },
    }),
  ],
});
