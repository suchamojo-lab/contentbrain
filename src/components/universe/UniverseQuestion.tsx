import type { UniversePrompt } from "../../data/universeQuestions";
export function UniverseQuestion({prompt,value,error,saving,onChange,onBack,onSubmit}:{prompt:UniversePrompt;value:string;error:string;saving:boolean;onChange:(value:string)=>void;onBack:()=>void;onSubmit:()=>void}) {
  const selected = value ? value.split(", ").filter(Boolean) : [];
  const toggle = (choice:string) => onChange((selected.includes(choice) ? selected.filter((item) => item !== choice) : [...selected,choice]).join(", "));
  return <section className="universe-question universe-question--v1">
    <header><span>YOUR UNIVERSE · {prompt.stageTitle.toUpperCase()}</span><i>STAGE {String(prompt.stage).padStart(2,"0")} / 08</i></header>
    <div className="question-copy"><p className="stage-intro">{prompt.stageIntro}</p><h1>{prompt.title}</h1><p>{prompt.help}</p></div>
    {prompt.kind === "multi" ? <div className="expression-choices">{prompt.choices?.map((choice) => <button type="button" key={choice} className={selected.includes(choice)?"is-selected":""} onClick={() => toggle(choice)}>{choice}<span>{selected.includes(choice)?"✓":"+"}</span></button>)}</div> : <label><span className="sr-only">{prompt.title}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={prompt.placeholder??"Write here…"} autoFocus /></label>}
    {error ? <p className="universe-error" role="alert">{error}</p> : null}
    <footer><button type="button" onClick={onBack}>← BACK</button><div>{prompt.optional ? <small>Optional</small> : null}<button type="button" className="add-brain-button" onClick={onSubmit} disabled={saving}>{saving?"BUILDING…":value.trim()?"ADD TO MY UNIVERSE ↵":"SKIP FOR NOW →"}</button></div></footer><div className="answer-file" aria-hidden="true"><small>ANSWER / {prompt.stageTitle}</small><p>{value.slice(0,90)||"Your answer"}</p></div>
  </section>;
}
