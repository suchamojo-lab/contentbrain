import { brainSources } from "../../data/landingDemoData";

export function BrainVisualization() {
  return <div className="v3-brain" aria-label="Sources connecting into a Content Brain"><div className="v3-brain__core"><span>LEARNING</span><strong>CONTENT<br />BRAIN</strong><small>UNDERSTANDING YOUR WORLD</small></div>{brainSources.map((source,index) => <div className={`v3-brain__source v3-brain__source--${index + 1}`} key={source}><i />{source}</div>)}<svg aria-hidden="true" viewBox="0 0 100 70" preserveAspectRatio="none">{brainSources.map((_,index) => <line key={index} x1={index % 2 ? 92 : 8} y1={8 + index * 7} x2="50" y2="35" />)}</svg></div>;
}
