import { useMemo, useState } from "react";
import { CompassMark } from "./components/CompassMark";
import { ProgressRail, compassSteps } from "./components/ProgressRail";
import { RecommendationView } from "./components/RecommendationView";
import { UniverseView } from "./components/UniverseView";
import { generateRecommendation, generateUniverse, type CompassAnswers, type ContentUniverse, type Recommendation } from "./lib/recommendation";

type View = "landing" | "compass" | "universe" | "idea" | "recommendation" | "locked";
type RequestType = "research" | "self" | "ai" | "expert" | "camera" | "editor" | "suchamojo";

interface SavedState {
  view: View;
  compassStep: number;
  answers: CompassAnswers;
  universe?: ContentUniverse;
  idea: string;
  recommendation?: Recommendation;
  selectedHook: number;
  lockedAt?: string;
  request?: RequestType;
  universeId?: string;
  ideaId?: string;
}

export interface ContentPersistence {
  saveUniverse: (input: { clientId: string; answers: CompassAnswers; universe: ContentUniverse }) => Promise<string>;
  saveIdea: (input: { clientId: string; universeId: string; text: string }) => Promise<string>;
  lockDirection: (input: { clientId: string; universeId: string; ideaId: string; topic: string; angle: string; hook: string; format: string; direction: string[] }) => Promise<string>;
}

const STORAGE_KEY = "everything-content:v1";
const CLIENT_KEY = "everything-content:client-id";
const emptyAnswers: CompassAnswers = { character: "", gifts: "", radiance: "", expression: "" };
const defaultState: SavedState = { view: "landing", compassStep: 0, answers: emptyAnswers, idea: "", selectedHook: 0 };

const prompts = [
  { eyebrow: "Character", title: "What experiences made you who you are?", help: "Share the parts of your background, career, businesses, turning points, or lessons that shape how you see the world.", placeholder: "I started my career in… The experience that changed how I work was…" },
  { eyebrow: "Own gifts", title: "What do people naturally come to you for?", help: "Think about the problems people trust you to solve or explain.", placeholder: "People usually ask me to help with…" },
  { eyebrow: "Radiance", title: "What can you not shut up about?", help: "Name the subjects you keep learning, teaching, or bringing into conversation.", placeholder: "I keep coming back to…" },
  { eyebrow: "Expression", title: "How do you express yourself best?", help: "Tell us what feels natural: talking to camera, writing, teaching, interviews, presentations, or conversations.", placeholder: "I am at my best when I…" },
];

function loadState(): SavedState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
  } catch {
    return defaultState;
  }
}

function getClientId() {
  const existing = localStorage.getItem(CLIENT_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(CLIENT_KEY, created);
  return created;
}

const testPersistence: ContentPersistence = {
  saveUniverse: async () => "test-universe",
  saveIdea: async () => "test-idea",
  lockDirection: async () => "test-direction",
};

export default function App({ persistence = testPersistence }: { persistence?: ContentPersistence }) {
  const [state, setState] = useState<SavedState>(loadState);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const clientId = useMemo(getClientId, []);

  const save = (next: SavedState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completed = useMemo(() => compassSteps.filter((step) => state.answers[step.key].trim()).map((step) => step.key), [state.answers]);

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    setError("");
  };

  const header = (
    <header className="site-header">
      <button className="wordmark" type="button" onClick={() => state.view === "landing" ? undefined : save({ ...state, view: state.lockedAt ? "locked" : "universe" })}>
        <CompassMark compact />
        <span>Everything<br />Content</span>
      </button>
      {state.view === "landing" ? <span className="header-note">For founders with something worth saying</span> : <button className="text-button" type="button" onClick={reset}>Start over</button>}
    </header>
  );

  if (state.view === "landing") {
    return <main className="page page--landing">{header}<section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><i /> A content decision tool for founders</span>
        <h1>Stop staring at a good idea. <em>Know what to create.</em></h1>
        <p>Turn what makes you credible—and one rough idea—into a clear angle, hook, format, and direction. Free, with no account needed.</p>
        <button className="primary-button primary-button--large" type="button" onClick={() => save({ ...state, view: "compass", compassStep: 0 })}>Build my Content Universe <span>→</span></button>
        <small>Four thoughtful prompts · About 5 minutes</small>
      </div>
      <div className="hero-compass">
        <CompassMark />
        <div className="orbit-note orbit-note--one"><span>01</span> What shaped you</div>
        <div className="orbit-note orbit-note--two"><span>02</span> What you know</div>
        <div className="orbit-note orbit-note--three"><span>03</span> What pulls you</div>
      </div>
    </section><section className="promise-strip"><span>One idea in</span><b>→</b><span>One clear direction out</span><p>No generic content calendar. No blank chat box. Just the decision in front of you.</p></section></main>;
  }

  if (state.view === "compass") {
    const current = compassSteps[state.compassStep];
    const prompt = prompts[state.compassStep];
    const answer = state.answers[current.key];
    const advance = async () => {
      if (answer.trim().length < 20) return setError("Add a little more detail so the recommendation has something real to work with.");
      setError("");
      if (state.compassStep < 3) save({ ...state, compassStep: state.compassStep + 1 });
      else {
        const universe = generateUniverse(state.answers);
        try {
          setSaving(true);
          const universeId = await persistence.saveUniverse({ clientId, answers: state.answers, universe });
          save({ ...state, universe, universeId, view: "universe" });
        } catch {
          setError("Your Content Universe could not be saved. Check that Convex is running, then try again.");
        } finally {
          setSaving(false);
        }
      }
    };
    return <main className="page page--app">{header}<div className="app-shell">
      <ProgressRail step={state.compassStep} />
      <section className="prompt-stage">
        <div className="prompt-top"><CompassMark active={current.key} completed={completed} compact /><span>{prompt.eyebrow} · {state.compassStep + 1} of 4</span></div>
        <form onSubmit={(event) => { event.preventDefault(); advance(); }}>
          <h1>{prompt.title}</h1><p>{prompt.help}</p>
          <label htmlFor="compass-answer" className="sr-only">{prompt.title}</label>
          <textarea id="compass-answer" value={answer} onChange={(event) => setState({ ...state, answers: { ...state.answers, [current.key]: event.target.value } })} placeholder={prompt.placeholder} aria-describedby={error ? "answer-error" : "answer-help"} autoFocus />
          <div className="field-meta"><span id={error ? "answer-error" : "answer-help"} className={error ? "field-error" : ""}>{error || "A few honest sentences are enough."}</span><span>{answer.length} characters</span></div>
          <div className="form-actions">{state.compassStep > 0 ? <button type="button" className="secondary-button" onClick={() => save({ ...state, compassStep: state.compassStep - 1 })}>← Back</button> : <span />}
            <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : state.compassStep === 3 ? "Create my Content Universe" : "Continue"} <span>→</span></button></div>
        </form>
      </section>
    </div></main>;
  }

  if (state.view === "universe" && state.universe) {
    return <main className="page page--app">{header}<section className="content-page">
      <div className="page-intro"><span className="eyebrow"><i /> Your Content Universe</span><h1>This is the ground you can create from.</h1><p>A concise view of your credibility, curiosity, stories, and natural ways of expressing them.</p></div>
      <UniverseView universe={state.universe} />
      <div className="sticky-action"><div><strong>Universe mapped.</strong><span>Now bring one real idea.</span></div><button className="primary-button" type="button" onClick={() => save({ ...state, view: "idea" })}>Find my content direction <span>→</span></button></div>
    </section></main>;
  }

  if (state.view === "idea" && state.universe) {
    const submitIdea = async () => {
      if (state.idea.trim().length < 12) return setError("Add the idea, argument, or rough script you actually want to work on.");
      if (!state.universeId) return setError("Your Content Universe is not connected to Convex. Start over and create it again.");
      const recommendation = generateRecommendation(state.answers, state.universe!, state.idea);
      try {
        setSaving(true);
        const ideaId = await persistence.saveIdea({ clientId, universeId: state.universeId, text: state.idea });
        setError(""); save({ ...state, recommendation, ideaId, view: "recommendation" });
      } catch {
        setError("Your idea could not be saved. Check that Convex is running, then try again.");
      } finally {
        setSaving(false);
      }
    };
    return <main className="page page--app">{header}<section className="idea-stage">
      <div className="idea-number">01</div><div className="idea-copy"><span className="eyebrow"><i /> Your next piece</span><h1>What do you want to create around?</h1><p>Paste an idea, an argument, a rough script, or text that sparked something. Messy is useful.</p></div>
      <form onSubmit={(event) => { event.preventDefault(); submitIdea(); }}><label htmlFor="content-idea">Your idea or rough script</label><textarea id="content-idea" value={state.idea} onChange={(event) => setState({ ...state, idea: event.target.value })} placeholder="I want to talk about…" autoFocus />
        {error ? <p className="field-error">{error}</p> : <div className="idea-hints"><span>Try a real idea you plan to publish</span><span>No URL needed</span></div>}
        <button className="primary-button primary-button--large" type="submit" disabled={saving}>{saving ? "Saving idea…" : "Show me what to create"} <span>→</span></button></form>
    </section></main>;
  }

  if (state.view === "recommendation" && state.recommendation) {
    const lock = async () => {
      if (!state.universeId || !state.ideaId) return setError("This direction is missing its saved Content Universe or idea. Start over and try again.");
      try {
        setSaving(true);
        await persistence.lockDirection({ clientId, universeId: state.universeId, ideaId: state.ideaId, topic: state.idea, angle: state.recommendation!.angle, hook: state.recommendation!.hooks[state.selectedHook], format: state.recommendation!.format, direction: state.recommendation!.direction });
        setError(""); save({ ...state, view: "locked", lockedAt: new Date().toISOString() });
      } catch {
        setError("This direction could not be locked. Check that Convex is running, then try again.");
      } finally {
        setSaving(false);
      }
    };
    return <main className="page page--app">{header}<section className="content-page content-page--result">
      <div className="result-intro"><div><span className="eyebrow"><i /> Your recommendation</span><h1>You have a direction.</h1><p>One angle, one format, and three ways in. Choose the opening that sounds most like you.</p></div><CompassMark compact completed={compassSteps.map((step) => step.key)} /></div>
      <RecommendationView recommendation={state.recommendation} selectedHook={state.selectedHook} onSelectHook={(selectedHook) => setState({ ...state, selectedHook })} />
      <div className="lock-bar"><div><span>Selected hook</span><strong>{state.recommendation.hooks[state.selectedHook]}</strong></div><button className="primary-button primary-button--inverse" type="button" disabled={saving} onClick={lock}>{saving ? "Locking…" : "Lock this direction"} <span>→</span></button></div>
      {error ? <p className="persistence-error" role="alert">{error}</p> : null}
    </section></main>;
  }

  if (state.view === "locked" && state.recommendation) {
    const options: Array<{ key: RequestType; label: string; detail: string }> = [
      { key: "self", label: "Create it myself", detail: "I have what I need" },
      { key: "ai", label: "Use my own AI", detail: "Take this direction into my usual tool" },
      { key: "expert", label: "Need a content expert", detail: "Get help shaping the piece" },
      { key: "camera", label: "Need a camera team", detail: "Plan a shoot with support" },
      { key: "editor", label: "Need an editor", detail: "Turn the raw material into a finished piece" },
      { key: "suchamojo", label: "Work with Suchamojo", detail: "Get strategy and execution help" },
    ];
    return <main className="page page--app">{header}<section className="locked-page">
      <div className="success-mark">✓</div><span className="eyebrow"><i /> Direction locked</span><h1>Your next content decision is made.</h1><p className="locked-hook">“{state.recommendation.hooks[state.selectedHook]}”</p>
      <section className="research-cta"><div><span>Go beyond the curated library</span><h2>Research this idea deeper</h2><p>See what is already working around this idea and get a stronger, internet-backed recommendation. For this early version, requests are fulfilled with human review.</p></div><button type="button" className={state.request === "research" ? "primary-button is-confirmed" : "primary-button"} onClick={() => save({ ...state, request: "research" })}>{state.request === "research" ? "Research request saved ✓" : "Request deeper research"}</button></section>
      <section className="execution-section"><div className="section-heading"><div><span className="section-label">Next step</span><h2>How do you want to create it?</h2></div>{state.request && state.request !== "research" ? <span className="saved-note">Choice saved</span> : null}</div>
        <div className="execution-grid">{options.map((option) => <button key={option.key} type="button" className={state.request === option.key ? "execution-option is-selected" : "execution-option"} onClick={() => save({ ...state, request: option.key })}><span>{option.label}</span><small>{option.detail}</small><i>{state.request === option.key ? "✓" : "→"}</i></button>)}</div></section>
      <button type="button" className="text-button restart-button" onClick={() => save({ ...state, view: "idea", idea: "", recommendation: undefined, selectedHook: 0, request: undefined, lockedAt: undefined })}>Try another idea →</button>
    </section></main>;
  }

  return <main className="page page--app">{header}<section className="empty-state"><h1>Your saved direction needs rebuilding.</h1><button className="primary-button" type="button" onClick={reset}>Start over</button></section></main>;
}
