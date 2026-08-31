import { useEffect, useMemo, useRef, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { ContentUniverse } from "../../lib/recommendation";
import { StoryShareStudio } from "../share/StoryShareStudio";

export interface YapTopic { id: string; topic: string; whyYou: string; openingLine: string; bestFormat: string; source: string; saved: boolean; createdAt: number }
type Mode = "talkingPoints" | "hook" | "draft" | "think";

function StructuredResult({ json }: { json: string }) {
  let value: unknown;
  try { value = JSON.parse(json); } catch { value = json; }
  if (typeof value === "string") return <p>{value}</p>;
  if (!value || typeof value !== "object") return null;
  return <div className="yap-developed-result">{Object.entries(value as Record<string, unknown>).map(([key, item]) => <section key={key}><small>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</small>{Array.isArray(item) ? <ol>{item.map((entry, index) => <li key={index}>{typeof entry === "object" ? JSON.stringify(entry) : String(entry)}</li>)}</ol> : <p>{item == null ? "No saved personal story fits this idea yet." : String(item)}</p>}</section>)}</div>;
}

function YapCard({ item, index, universeJson, onSave, onAngle }: { item: YapTopic; index: number; universeJson: string; onSave: (item: YapTopic) => void; onAngle: (item: YapTopic) => void }) {
  const develop = useAction(api.yapIdeas.develop);
  const [mode, setMode] = useState<Mode | null>(null); const [busy, setBusy] = useState(false); const [result, setResult] = useState(""); const [answers, setAnswers] = useState<string[]>([]); const [error, setError] = useState("");
  const run = async (nextMode: Mode, followUpAnswers?: string[]) => { setMode(nextMode); setBusy(true); setError(""); setResult(""); try { setResult(await develop({ mode: nextMode, topic: { topic: item.topic, whyYou: item.whyYou, openingLine: item.openingLine, bestFormat: item.bestFormat, source: item.source }, universeJson, answers: followUpAnswers })); } catch (cause) { setError(cause instanceof Error ? cause.message : "Your Content Brain couldn’t finish that yet."); } finally { setBusy(false); } };
  const parsedQuestions = useMemo(() => { if (mode !== "think" || !result) return []; try { const parsed = JSON.parse(result) as { questions?: string[] }; return parsed.questions ?? []; } catch { return []; } }, [mode, result]);
  return <article className="yap-card">
    <header><span>YAP #{String(index + 1).padStart(2, "0")}</span><small>{item.source}</small></header>
    <h3>{item.topic}</h3>
    <dl><div><dt>WHY YOU</dt><dd>{item.whyYou}</dd></div><div><dt>START WITH</dt><dd>“{item.openingLine}”</dd></div><div><dt>BEST AS</dt><dd>{item.bestFormat}</dd></div></dl>
    <footer><button onClick={() => setMode(mode ? null : "talkingPoints")}>YAP ON THIS →</button><button className="is-quiet" onClick={() => onSave(item)}>{item.saved ? "SAVED ✓" : "SAVE"}</button><button className="is-quiet" onClick={() => onAngle(item)}>ANOTHER ANGLE</button></footer>
    {mode ? <section className="yap-creator"><header><span>HOW DO YOU WANT TO USE THIS?</span><button onClick={() => setMode(null)} aria-label="Close">×</button></header><div>{(["talkingPoints", "hook", "draft", "think"] as Mode[]).map((choice) => <button className={mode === choice ? "is-active" : ""} key={choice} onClick={() => void run(choice)}>{choice === "talkingPoints" ? "Give me talking points" : choice === "hook" ? "Give me a hook" : choice === "draft" ? "Draft it" : "Help me think"}</button>)}</div>
      {busy ? <p>Thinking with your Universe…</p> : null}{error ? <p role="alert">{error}</p> : null}{result ? <StructuredResult json={result}/> : null}
      {parsedQuestions.length ? <form onSubmit={(event) => { event.preventDefault(); void run("think", answers); }}>{parsedQuestions.map((question, questionIndex) => <label key={question}>{question}<textarea value={answers[questionIndex] ?? ""} onChange={(event) => setAnswers((current) => { const next = [...current]; next[questionIndex] = event.target.value; return next; })}/></label>)}<button disabled={answers.every((answer) => !answer?.trim())}>SHARPEN THIS IDEA →</button></form> : null}
    </section> : null}
  </article>;
}

export function YapIdeas({ universe, compact = false, savedStories = [] }: { universe: ContentUniverse; compact?: boolean; savedStories?: Array<{ title: string; story: string }> }) {
  const latest = useQuery(api.yapIdeaData.latest, { limit: compact ? 3 : 10 }); const generate = useAction(api.yapIdeas.generate); const develop = useAction(api.yapIdeas.develop); const setSaved = useMutation(api.yapIdeaData.setSaved);
  const autoRequested = useRef(false);
  const [generated, setGenerated] = useState<YapTopic[]>([]); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [expanded, setExpanded] = useState(!compact); const [share, setShare] = useState(false);
  const universeJson = useMemo(() => JSON.stringify({
    universe: {
      character: universe.character,
      gifts: universe.gifts,
      radiance: universe.radiance,
      expression: universe.expression,
      territory: universe.territory,
      contentPillars: universe.contentPillars,
      storyBank: universe.storyBank,
      ideaUniverse: universe.ideaUniverse,
    },
    savedStories,
  }), [savedStories, universe]);
  const rows: YapTopic[] = generated.length ? generated : (latest ?? []).map((item) => ({ ...item, id: String(item.id) }));
  const run = async () => { if (busy) return; setBusy(true); setError(""); try { const result = await generate({ universeJson }); setGenerated(result.map((item) => ({ ...item, id: String(item.id) }))); setExpanded(true); } catch (cause) { setError(cause instanceof Error ? cause.message : "Your Content Brain couldn’t find topics yet."); } finally { setBusy(false); } };
  useEffect(() => { if (compact && latest?.length === 0 && !autoRequested.current) { autoRequested.current = true; void run(); } }, [compact, latest]);
  const save = async (item: YapTopic) => { await setSaved({ id: item.id as Id<"yapTopics">, saved: !item.saved }); setGenerated((current) => current.map((row) => row.id === item.id ? { ...row, saved: !row.saved } : row)); };
  const angle = async (item: YapTopic) => { setBusy(true); setError(""); try { const json = await develop({ mode: "angle", topic: { topic: item.topic, whyYou: item.whyYou, openingLine: item.openingLine, bestFormat: item.bestFormat, source: item.source }, universeJson }); const replacement = JSON.parse(json) as Omit<YapTopic, "id"|"saved"|"createdAt">; setGenerated((current) => (current.length ? current : rows).map((row) => row.id === item.id ? { ...row, ...replacement } : row)); } catch (cause) { setError(cause instanceof Error ? cause.message : "Another angle wasn’t ready yet."); } finally { setBusy(false); } };
  const visible = expanded ? rows : rows.slice(0, 3);
  return <section className={`yap-ideas ${compact ? "is-compact" : ""}`}>
    <header><div><span>YOU HAVE A CONTENT UNIVERSE. NOW USE IT.</span><h2>WHAT SHOULD I YAP ABOUT?</h2><p>Specific thoughts pulled from what you know, lived, believe, and care about.</p></div>{rows.length ? <button onClick={() => void run()} disabled={busy}>{busy ? "LOOKING DEEPER…" : "GIVE ME 10 MORE →"}</button> : null}</header>
    {!rows.length ? <div className="yap-empty"><p>Find ten things you can talk about naturally and credibly right now.</p><button onClick={() => void run()} disabled={busy}>{busy ? "READING YOUR UNIVERSE…" : "WHAT SHOULD I YAP ABOUT? →"}</button></div> : <div className="yap-list">{visible.map((item, index) => <YapCard key={item.id} item={item} index={index} universeJson={universeJson} onSave={(row) => void save(row)} onAngle={(row) => void angle(row)}/>)}</div>}
    {error ? <p className="yap-error" role="alert">{error}</p> : null}
    {compact && rows.length ? <button className="yap-show-all" onClick={() => setExpanded((current) => !current)}>{expanded ? "SHOW 3" : "SHOW ME 10 →"}</button> : null}
    {rows.length >= 3 ? <button className="yap-share-trigger" onClick={() => setShare((current) => !current)}>SHARE MY YAP LIST →</button> : null}
    {share ? <StoryShareStudio universe={universe} yapTopics={rows.map((item) => item.topic)} initialTemplate="yaps"/> : null}
  </section>;
}
