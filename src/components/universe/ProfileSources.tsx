import { useEffect, useState } from "react";
import type { UniverseAnswers } from "../../lib/recommendation";

export interface CreatorProfile {
  linkedinUrl: string;
  instagramHandle: string;
  bio: string;
}

const EMPTY_PROFILE: CreatorProfile = { linkedinUrl: "", instagramHandle: "", bio: "" };

export function ProfileSources({ answers, initialProfile, canSave, onBack, onContinue }: {
  answers: UniverseAnswers;
  initialProfile?: CreatorProfile | null;
  canSave: boolean;
  onBack: () => void;
  onContinue: (profile: CreatorProfile) => Promise<void>;
}) {
  const [profile, setProfile] = useState(initialProfile ?? EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const known = Object.values(answers).filter((answer) => answer?.trim()).length;

  useEffect(() => { if (initialProfile) setProfile(initialProfile); }, [initialProfile]);

  const submit = async () => {
    setSaving(true);
    setError("");
    try { await onContinue(profile); }
    catch {
      setError("We couldn’t save those links. Your Content Brain answers are still safe.");
      setSaving(false);
    }
  };

  return <main className="profile-sources">
    <header className="sources-nav"><button onClick={onBack}>← BACK</button><span>CONTENT BRAIN / QUICK START</span><i>{known ? `${known} ANSWERS FOUND ✓` : "NEW BRAIN"}</i></header>
    <section className="sources-layout">
      <div className="sources-copy">
        <span>START WITH WHAT ALREADY EXISTS</span>
        <h1>Bring your<br/><em>world with you.</em></h1>
        <p>Your existing Brain answers stay in place. Add any public profiles that help describe your work, then fill the gaps inside your Universe.</p>
        <div className="known-note"><b>{known}</b><span>pieces of context already in your Content Brain</span></div>
      </div>
      <form className="sources-file" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <div className="sources-file__tab">PROFILE SOURCES</div>
        <header><span>OPTIONAL CONTEXT</span><i>01 / 01</i></header>
        <label><span>LinkedIn profile</span><input type="url" inputMode="url" placeholder="https://linkedin.com/in/your-name" value={profile.linkedinUrl} onChange={(event) => setProfile({ ...profile, linkedinUrl: event.target.value })}/><small>Saved as a source link. Automatic import needs LinkedIn approval.</small></label>
        <label><span>Instagram</span><div className="handle-input"><b>@</b><input type="text" autoCapitalize="none" placeholder="yourhandle" value={profile.instagramHandle.replace(/^@/, "")} onChange={(event) => setProfile({ ...profile, instagramHandle: event.target.value })}/></div><small>Add a public creator or business account.</small></label>
        <label><span>Short bio</span><textarea rows={4} placeholder="What do you do, and who do you help?" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })}/></label>
        {error ? <p className="sources-error" role="alert">{error}</p> : null}
        <footer><span>{canSave ? "SAVED TO YOUR ACCOUNT" : "SAVED ON THIS DEVICE"}</span><button type="submit" disabled={saving}>{saving ? "SAVING…" : "CONTINUE TO MY UNIVERSE ↵"}</button></footer>
      </form>
    </section>
  </main>;
}
