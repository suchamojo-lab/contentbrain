import { FormEvent, useEffect, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { navigateTo } from "../../routing/routes";
import { authErrorMessage } from "../../lib/authError";
import { PublicSiteLayout } from "../site/PublicSiteLayout";

export function AuthPage({ mode }: { mode: "signUp" | "signIn" }) {
  const { signIn } = useAuthActions();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setError(""), [mode]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    form.set("flow", mode);
    try {
      await signIn("password", form);
    } catch (cause) {
      setError(authErrorMessage(cause));
      setBusy(false);
    }
  };
  if (mode === "signIn")
    return (
      <PublicSiteLayout session={{authenticated:false,hasUniverse:false}} headerMode="auth" showFooter={false}><main className="auth-page auth-page--simple">
        <section className="auth-panel">
          <span>EVERYTHING CONTENT</span>
          <h1>Welcome back.</h1>
          <p>Your Content Brain is waiting.</p>
          <form onSubmit={submit}>
            <label>
              EMAIL
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              PASSWORD
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                required
                placeholder="Your password"
              />
            </label>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}
            <button className="auth-submit" disabled={busy}>
              {busy ? "SIGNING IN…" : "SIGN IN →"}
            </button>
            <button
              className="auth-link"
              type="button"
              onClick={() => navigateTo("/forgot-password")}
            >
              Forgot password?
            </button>
          </form>
          <footer>
            <span>New here?</span>
            <button onClick={() => navigateTo("/signup")}>
              Build your Content Brain →
            </button>
          </footer>
        </section>
      </main></PublicSiteLayout>
    );
  return (
    <PublicSiteLayout session={{authenticated:false,hasUniverse:false}} headerMode="auth" showFooter={false}><main className="auth-page auth-page--workspace">
      <section className="auth-intro">
        <span>YOUR PRIVATE CONTENT WORKSPACE</span>
        <h1>Build from what only you know.</h1>
        <p>
          Save your Content Universe, ideas and drafts in one private workspace.
          Start with four answers. Add more context only when it helps.
        </p>
      </section>
      <section className="auth-panel">
        <div className="auth-switch" role="tablist" aria-label="Account action">
          <button role="tab" aria-selected="true">
            Create account
          </button>
          <button
            role="tab"
            aria-selected="false"
            onClick={() => navigateTo("/login")}
          >
            Sign in
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            YOUR NAME
            <input
              name="name"
              autoComplete="name"
              required
              placeholder="What should we call you?"
            />
          </label>
          <label>
            EMAIL
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            PASSWORD
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="At least 8 characters"
            />
          </label>
          {error ? (
            <p className="auth-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="auth-submit" disabled={busy}>
            {busy ? "PLEASE WAIT…" : "CREATE MY ACCOUNT →"}
          </button>
        </form>
        <p className="auth-note">
          Your saved answers stay connected to this account.
        </p>
      </section>
    </main></PublicSiteLayout>
  );
}
