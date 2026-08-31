export function ContentDirectionDemo() {
  return <div className="direction-demo">
    <div className="direction-demo__idea"><span>YOUR IDEA</span><p>“ChatGPT is making personal brands more generic.”</p></div>
    <div className="direction-demo__sources" aria-label="Inputs used by your Content Brain">
      {[["CREATOR-STATED","Your experience"],["CREATOR-STATED","Your audience"],["CREATOR-STATED","Your point of view"],["VERIFIED","Internet research"]].map(([label,title]) => <article key={title}><span>{label}</span><strong>{title}</strong></article>)}
    </div>
    <div className="direction-demo__result"><span>INFERENCE / RECOMMENDATION</span><h3>Generic content is not an AI problem.<br />It is a context problem.</h3><p>Show founders why a model needs their lived experience, beliefs and audience context before it can create something worth following.</p><div><i>3 hooks</i><i>Talking-head essay</i><i>Story → framework → example</i></div></div>
  </div>;
}
