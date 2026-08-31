import { useEffect, useState } from "react";
import type { ContentUniverse } from "../../lib/recommendation";
import type { WorkspaceData } from "../../features/workspace/useWorkspaceData";
import { navigateTo } from "../../routing/routes";
import { track } from "../../lib/analytics";
import { ContentBrainCardRail } from "./ContentBrainCardRail";

export type BrainTool =
  "idea" | "stronger" | "hook" | "story" | "plan" | "script" | "ask";
export interface BrainGeneration {
  id: string;
  tool: BrainTool;
  title: string;
  input: string;
  resultJson: string;
  createdAt: number;
}
type RunTool = (tool: BrainTool, input: string) => Promise<BrainGeneration>;

const tools: Array<{
  id: Exclude<BrainTool, "ask">;
  number: string;
  title: string;
  description: string;
  question?: string;
  placeholder?: string;
  inputRequired?: boolean;
}> = [
  {
    id: "idea",
    number: "IDEAS",
    title: "Find me an idea",
    description: "Give me ideas based on my Content Universe.",
    question: "Anything specific you want to create around?",
    placeholder: "Optional topic, question, or direction…",
  },
  {
    id: "stronger",
    number: "ANGLE",
    title: "Make this idea stronger",
    description: "Turn a rough thought into a sharper content angle.",
    question: "What's the rough idea?",
    placeholder: "I keep noticing that…",
    inputRequired: true,
  },
  {
    id: "hook",
    number: "HOOKS",
    title: "Improve my hook",
    description: "Give me stronger openings without changing the core idea.",
    question: "What's your current first line or idea?",
    placeholder: "Paste your first line…",
    inputRequired: true,
  },
  {
    id: "story",
    number: "STORIES",
    title: "Find a story",
    description:
      "Find a relevant story or experience from my Content Universe.",
  },
  {
    id: "script",
    number: "WRITING",
    title: "Improve my script",
    description:
      "Strengthen the hook, structure and clarity of an existing draft.",
    question: "Paste your script",
    placeholder: "Paste the complete draft here…",
    inputRequired: true,
  },
  {
    id: "plan",
    number: "PLANNING",
    title: "Plan my next 5 posts",
    description:
      "Turn my current content pillars into five useful content directions.",
  },
];

const labels: Record<string, string> = {
  originalThought: "Original thought",
  strongestAngle: "Strongest angle",
  whyThisFitsYou: "Why this fits you",
  directions: "3 directions",
  hooks: "Hooks",
  bestFormat: "Best format",
  whatsWorking: "What's working",
  whatsWeak: "What's weak",
  strongerHook: "Stronger hook",
  structureChanges: "Structure changes",
  improvedScript: "Improved script",
  answer: "Your brain's take",
  nextSteps: "Next steps",
  angle: "Angle",
  hook: "Hook",
  recommendedFormat: "Recommended format",
  whyItWorks: "Why it works",
  story: "Story",
  whyItConnects: "Why it connects",
  lesson: "Lesson",
  potentialHook: "Potential hook",
  slot: "Slot",
  contentType: "Content type",
  idea: "Idea",
  whyItFits: "Why it fits",
  format: "Format",
  contrarian: "Contrarian",
  storyLed: "Story-led",
  educational: "Educational",
};
const label = (key: string) =>
  labels[key] ??
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());

function ResultValue({ name, value }: { name: string; value: unknown }) {
  if (value == null || value === false) return null;
  if (typeof value === "string")
    return (
      <section
        className={`brain-result-field ${name === "improvedScript" || name === "answer" ? "is-long" : ""}`}
      >
        <small>{label(name)}</small>
        <p>{value}</p>
      </section>
    );
  if (Array.isArray(value))
    return (
      <section className="brain-result-field">
        <small>{label(name)}</small>
        <div className="brain-result-list">
          {value.map((item, index) =>
            typeof item === "object" && item ? (
              <article key={index}>
                {Object.entries(item as Record<string, unknown>).map(
                  ([key, nested]) => (
                    <ResultValue key={key} name={key} value={nested} />
                  ),
                )}
              </article>
            ) : (
              <p key={index}>{String(item)}</p>
            ),
          )}
        </div>
      </section>
    );
  if (typeof value === "object")
    return (
      <section className="brain-result-field">
        <small>{label(name)}</small>
        <div className="brain-result-directions">
          {Object.entries(value as Record<string, unknown>).map(
            ([key, nested]) => (
              <ResultValue key={key} name={key} value={nested} />
            ),
          )}
        </div>
      </section>
    );
  return null;
}

function BrainResult({
  generation,
  onDevelop,
  onBuild,
}: {
  generation: BrainGeneration;
  onDevelop: (text: string) => void;
  onBuild: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(generation.resultJson);
  } catch {
    parsed = { answer: generation.resultJson };
  }
  const needsStory =
    parsed.needsMoreContext === true ||
    (Array.isArray(parsed.stories) && parsed.stories.length === 0);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <section className="brain-tool-result" aria-live="polite">
      <header>
        <div>
          <span>CONTENT BRAIN RESULT</span>
          <h2>{generation.title}</h2>
        </div>
        <small>
          {new Date(generation.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </small>
      </header>
      {needsStory ? (
        <div className="brain-story-empty">
          <h3>Your brain needs a little more story context.</h3>
          <p>
            Add one real experience so it can find the right story without
            making anything up.
          </p>
          <button onClick={() => navigateTo("/app/train")}>
            ADD A STORY →
          </button>
        </div>
      ) : (
        <div className="brain-result-body">
          {Object.entries(parsed)
            .filter(([key]) => key !== "needsMoreContext")
            .map(([key, value]) => (
              <ResultValue key={key} name={key} value={value} />
            ))}
        </div>
      )}{" "}
      {!needsStory ? (
        <footer>
          <span>SAVED TO BRAIN ✓</span>
          <button className="is-quiet" onClick={copy}>
            {copied ? "COPIED ✓" : "COPY"}
          </button>
          {generation.tool === "idea" ? (
            <button
              className="is-quiet"
              onClick={() => onDevelop(generation.resultJson)}
            >
              DEVELOP →
            </button>
          ) : null}
          <button onClick={() => onBuild(generation.resultJson)}>
            CREATE FROM THIS →
          </button>
        </footer>
      ) : null}
    </section>
  );
}

export function WorkspaceHome({
  data,
  universe,
  universeId,
  runTool,
  recent,
}: {
  data: WorkspaceData;
  universe?: ContentUniverse;
  universeId?: string;
  runTool: RunTool;
  recent: BrainGeneration[];
}) {
  const [active, setActive] = useState<BrainTool | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BrainGeneration | null>(null);
  useEffect(() => {
    const prefill = sessionStorage.getItem("suchamojo:content-brain-prefill");
    if (!prefill) return;
    sessionStorage.removeItem("suchamojo:content-brain-prefill");
    setActive("ask");
    setInput(prefill);
  }, []);
  const selected = tools.find((tool) => tool.id === active);
  const scrollToWorkbench = () => {
    const workbench = document.querySelector(".brain-tool-workbench");
    if (
      workbench instanceof HTMLElement &&
      typeof workbench.scrollIntoView === "function"
    )
      workbench.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const open = (tool: BrainTool, prefill = "") => {
    setActive(tool);
    setInput(prefill);
    setResult(null);
    setError("");
    requestAnimationFrame(scrollToWorkbench);
  };
  const submit = async () => {
    if (!active || busy) return;
    track("content_brain_used", { tool: active });
    setBusy(true);
    setError("");
    try {
      const generated = await runTool(active, input);
      setResult(generated);
      const firstKey = "suchamojo:first-content-generated";
      if (!localStorage.getItem(firstKey)) {
        localStorage.setItem(firstKey, "1");
        track("first_content_generated", { tool: active });
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Your Content Brain couldn't finish that yet. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const build = (text: string) => {
    sessionStorage.setItem("suchamojo:create-seed", text);
    navigateTo("/app/create");
  };
  const combined = [
    ...recent,
    ...data.drafts.map((draft) => ({
      id: draft.id,
      tool: "script" as BrainTool,
      title: draft.title,
      input: "",
      resultJson: JSON.stringify({ answer: draft.body }),
      createdAt: draft.updatedAt,
    })),
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
  const setup = [
    {
      label: "Build your Content Universe",
      done: Boolean(universe),
      action: () => navigateTo("/app/universe"),
    },
    {
      label: "Create your first idea",
      done: recent.some((item) => item.tool === "idea"),
      action: () => open("idea"),
    },
    {
      label: "Add one story",
      done: Boolean(
        universe?.storyBank?.length ||
        data.library.some((item) => item.type === "Story"),
      ),
      action: () => navigateTo("/app/train"),
    },
    {
      label: "Save one reference",
      done: data.library.some((item) => item.type === "Link"),
      action: () => navigateTo("/app/discover"),
    },
  ];
  const completed = setup.filter((item) => item.done).length;
  const nextSetup = setup.findIndex((item) => !item.done);
  const activeSetup = nextSetup === -1 ? -1 : nextSetup;
  return (
    <div className="workspace-home brain-action-home">
      <header className="brain-action-head">
        <span>YOUR CONTENT BRAIN</span>
        <h1>What are you working on?</h1>
        <p>Start with an idea, a script, a story, or nothing at all.</p>
      </header>
      {completed < 4 ? (
        <section className="workspace-setup-strip">
          <header>
            <span>YOUR BRAIN IS READY</span>
            <button onClick={setup[activeSetup]?.action}>
              CONTINUE SETUP →
            </button>
          </header>
          <div>
            {setup.map((item) => (
              <span key={item.label} className={item.done ? "is-done" : ""}>
                {item.done ? "✓" : "○"} {item.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}
      <section className="brain-tool-section">
        <span>START WITH A JOB</span>
        <div
          className="brain-tool-grid"
          role="region"
          aria-label="Content Brain tools"
        >
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={active === tool.id ? "is-active" : ""}
              onClick={() => open(tool.id)}
            >
              <span>{tool.number}</span>
              <i>→</i>
              <h2>{tool.title}</h2>
              <p>{tool.description}</p>
            </button>
          ))}
          <button
            onClick={() =>
              open(
                "ask",
                "What should I yap about? Give me ten specific topics grounded in my Content Universe.",
              )
            }
          >
            <span>YAP</span>
            <i>→</i>
            <h2>What should I yap about?</h2>
            <p>Find topics you can talk about naturally and credibly.</p>
          </button>
          <button
            className="is-identity"
            onClick={() =>
              document
                .querySelector(".content-brain-card-rail")
                ?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
          >
            <span>IDENTITY</span>
            <i>→</i>
            <h2>What kind of content creator am I?</h2>
            <p>Open your fixed creator type and turn it into ideas.</p>
          </button>
        </div>
      </section>
      {active && active !== "ask" ? (
        <section className="brain-tool-workbench">
          <header>
            <div>
              <span>{selected?.number} · CONTENT BRAIN TOOL</span>
              <h2>{selected?.title}</h2>
            </div>
            <button
              onClick={() => {
                setActive(null);
                setResult(null);
              }}
              aria-label="Close tool"
            >
              ×
            </button>
          </header>
          {selected?.question ? (
            <>
              <label htmlFor="tool-input">{selected.question}</label>
              <textarea
                id="tool-input"
                autoFocus
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={selected.placeholder}
              />
            </>
          ) : (
            <p className="brain-tool-ready">
              Your saved Content Universe is ready. No background to explain
              again.
            </p>
          )}
          <footer>
            <small>USES YOUR COMPLETE SAVED CONTENT UNIVERSE</small>
            <button
              disabled={
                busy || Boolean(selected?.inputRequired && !input.trim())
              }
              onClick={submit}
            >
              {busy ? "THINKING WITH YOUR BRAIN…" : "USE MY CONTENT BRAIN →"}
            </button>
          </footer>
          {error ? (
            <p className="brain-tool-error" role="alert">
              {error}
            </p>
          ) : null}
          {result ? (
            <BrainResult
              generation={result}
              onDevelop={(text) => open("stronger", text)}
              onBuild={build}
            />
          ) : null}
        </section>
      ) : null}
      <section className="brain-anything">
        <span>ASK YOUR CONTENT BRAIN</span>
        <div>
          <textarea
            value={active === "ask" ? input : ""}
            onFocus={() => {
              if (active !== "ask") open("ask");
            }}
            onChange={(event) => {
              setActive("ask");
              setInput(event.target.value);
            }}
            placeholder="Drop an idea, question, story, or rough script..."
          />
          <button
            disabled={busy || active !== "ask" || !input.trim()}
            onClick={submit}
          >
            {busy && active === "ask" ? "THINKING…" : "THINK WITH MY BRAIN →"}
          </button>
        </div>
        {active === "ask" && error ? (
          <p className="brain-tool-error" role="alert">
            {error}
          </p>
        ) : null}
        {active === "ask" && result ? (
          <BrainResult
            generation={result}
            onDevelop={(text) => open("stronger", text)}
            onBuild={build}
          />
        ) : null}
      </section>
      {universe && universeId ? (
        <ContentBrainCardRail
          universe={universe}
          universeId={universeId}
          onCreate={(seed, tool = "idea") => open(tool, seed)}
        />
      ) : null}
      <section className="brain-recent">
        <header>
          <span>RECENT WORK</span>
        </header>
        {combined.length ? (
          <div className="brain-recent-list">
            {combined.map((item) => (
              <button
                key={`${item.tool}-${item.id}`}
                onClick={() => {
                  setActive(item.tool);
                  setInput(item.input);
                  setResult(item);
                  setError("");
                  requestAnimationFrame(scrollToWorkbench);
                }}
              >
                <span>{item.tool.toUpperCase()}</span>
                <strong>{item.title || "Untitled"}</strong>
                <small>{new Date(item.createdAt).toLocaleDateString()}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="brain-recent-empty">
            <p>Your recent ideas and drafts will show up here.</p>
            <button onClick={() => open("idea")}>FIND AN IDEA →</button>
          </div>
        )}
      </section>
    </div>
  );
}
