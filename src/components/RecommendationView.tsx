import type { Recommendation } from "../lib/recommendation";

interface RecommendationViewProps {
  recommendation: Recommendation;
  selectedHook: number;
  onSelectHook: (index: number) => void;
}

export function RecommendationView({ recommendation, selectedHook, onSelectHook }: RecommendationViewProps) {
  return (
    <div className="recommendation-layout">
      <div className="recommendation-main">
        <section className="reason-panel">
          <span className="section-label">Why this fits you</span>
          <p>{recommendation.fit}</p>
        </section>
        <section className="angle-panel">
          <span className="section-label section-label--light">Recommended angle</span>
          <h2>{recommendation.angle}</h2>
          <div className="format-chip"><span>Best format</span>{recommendation.format}</div>
        </section>
        <section className="result-section">
          <div className="section-heading">
            <span className="section-label">Choose your opening</span>
            <span className="section-note">Pick one hook to lock with the direction</span>
          </div>
          <div className="hook-list">
            {recommendation.hooks.map((hook, index) => (
              <button key={hook} type="button" className={selectedHook === index ? "hook-option is-selected" : "hook-option"} onClick={() => onSelectHook(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{hook}</strong>
                <i aria-hidden="true">{selectedHook === index ? "✓" : "→"}</i>
              </button>
            ))}
          </div>
        </section>
        <section className="result-section">
          <span className="section-label">What to create</span>
          <ol className="direction-list">
            {recommendation.direction.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}
          </ol>
        </section>
      </div>
      <aside className="inspiration-panel">
        <span className="section-label">Relevant inspiration</span>
        <p className="inspiration-intro">Mock examples showing the report structure. Live sources have not been retrieved in this build.</p>
        {recommendation.inspiration.map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b className="trust-label">{item.provenance}</b>
            <h3>{item.title}</h3>
            <p>{item.pattern}</p>
            <dl><div><dt>Platform</dt><dd>{item.platform}</dd></div><div><dt>Creator</dt><dd>{item.creator}</dd></div><div><dt>Performance</dt><dd>{item.performance}</dd></div></dl>
            <p>{item.relevance}</p>
            {item.url ? <a href={item.url} target="_blank" rel="noreferrer">Inspect source →</a> : <small>{item.source}</small>}
          </article>
        ))}
      </aside>
    </div>
  );
}
