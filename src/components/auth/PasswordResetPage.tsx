import { FormEvent, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { authErrorMessage } from "../../lib/authError";
import { navigateTo } from "../../routing/routes";
import { PublicSiteLayout } from "../site/PublicSiteLayout";

type ResetStep = "request" | { email: string };

export function PasswordResetPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<ResetStep>("request");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    form.set("flow", "reset");
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    try {
      await signIn("password", form);
      setStep({ email });
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === "request") return;
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    form.set("flow", "reset-verification");
    form.set("email", step.email);
    try {
      await signIn("password", form);
    } catch (cause) {
      setError(authErrorMessage(cause));
      setBusy(false);
    }
  };

  return (
    <PublicSiteLayout
      session={{ authenticated: false, hasUniverse: false }}
      headerMode="auth"
      showFooter={false}
    >
      <main className="auth-page auth-page--simple">
        <section className="auth-panel">
          <span>EVERYTHING CONTENT</span>
          <h1>{step === "request" ? "Reset your password." : "Check your email."}</h1>
          <p>
            {step === "request"
              ? "We’ll send an 8-digit reset code to your account email."
              : `Enter the code sent to ${step.email}.`}
          </p>

          {step === "request" ? (
            <form key="request" onSubmit={requestCode}>
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
              {error ? <p className="auth-error" role="alert">{error}</p> : null}
              <button className="auth-submit" disabled={busy}>
                {busy ? "SENDING…" : "SEND RESET CODE →"}
              </button>
            </form>
          ) : (
            <form key="verify" onSubmit={updatePassword}>
              <label>
                RESET CODE
                <input
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{8}"
                  required
                  placeholder="8-digit code"
                />
              </label>
              <label>
                NEW PASSWORD
                <input
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="At least 8 characters"
                />
              </label>
              {error ? <p className="auth-error" role="alert">{error}</p> : null}
              <button className="auth-submit" disabled={busy}>
                {busy ? "UPDATING…" : "UPDATE PASSWORD →"}
              </button>
              <button
                className="auth-link"
                type="button"
                onClick={() => {
                  setStep("request");
                  setError("");
                }}
              >
                Send a new code
              </button>
            </form>
          )}

          <footer>
            <button className="auth-link" onClick={() => navigateTo("/login")}>
              ← Back to sign in
            </button>
          </footer>
        </section>
      </main>
    </PublicSiteLayout>
  );
}
