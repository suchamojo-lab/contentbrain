import { FormEvent, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen({ onBack }: { onBack: () => void }) {
  const { signIn } = useAuthActions();
  const [mode, setMode] = useState<"signUp" | "signIn">("signUp");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    form.set("flow", mode);
    try {
      await signIn("password", form);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "We couldn't sign you in. Please try again.";
      setError(message.includes("Invalid credentials") ? "That email or password doesn't match." : message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <button className="auth-back" onClick={onBack}>← Back</button>
      <section className="auth-intro">
        <span>EVERYTHING CONTENT / YOUR PRIVATE BRAIN</span>
        <h1>{mode === "signUp" ? "Your full Content Universe is ready." : "Welcome back."}</h1>
        <p>{mode === "signUp" ? "Create your free account to reveal it, save it and take it anywhere." : "Open your saved Content Universe."}</p>
      </section>
      <section className="auth-panel">
        <div className="auth-switch" role="tablist" aria-label="Account action">
          <button role="tab" aria-selected={mode === "signUp"} onClick={() => { setMode("signUp"); setError(""); }}>Create account</button>
          <button role="tab" aria-selected={mode === "signIn"} onClick={() => { setMode("signIn"); setError(""); }}>Sign in</button>
        </div>
        <form onSubmit={submit}>
          {mode === "signUp" ? <>
            <label>YOUR NAME<input name="name" autoComplete="name" required placeholder="What should we call you?" /></label>
          </> : null}
          <label>EMAIL<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
          <label>PASSWORD<input name="password" type="password" autoComplete={mode === "signUp" ? "new-password" : "current-password"} minLength={8} required placeholder="At least 8 characters" /></label>
          {error ? <p className="auth-error" role="alert">{error}</p> : null}
          <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : mode === "signUp" ? "Create my account →" : "Sign in →"}</button>
        </form>
        <p className="auth-note">Your answers are saved. No extra onboarding after this.</p>
      </section>
    </main>
  );
}
