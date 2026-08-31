import { useState } from "react";

const nodes = [
  ["Positioning", "What you should be known for."],
  ["Content pillars", "The territories you can return to consistently."],
  ["Audience", "The people, tensions and questions your work serves."],
  ["Point of view", "The beliefs and observations that make the work yours."],
  ["Stories", "Moments from your life that nobody else can tell."],
  ["Expertise", "What experience has taught you beyond the books."],
  ["Ideas", "Specific directions ready to become content."],
  ["Formats", "The ways you naturally communicate best."],
] as const;

export function UniverseConstellation() {
  const [active, setActive] = useState(0);
  return <div className="universe-map">
    <svg aria-hidden="true" viewBox="0 0 100 70" preserveAspectRatio="none"><path d="M50 35 18 13M50 35 42 9M50 35 78 15M50 35 87 38M50 35 74 60M50 35 45 63M50 35 17 55M50 35 10 34" /></svg>
    <div className="universe-map__core"><span>YOUR</span><strong>CONTENT<br />BRAIN</strong></div>
    {nodes.map(([title, copy], index) => <button key={title} className={`universe-node universe-node--${index + 1} ${active === index ? "is-active" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{title}</span></button>)}
    <aside><span>{String(active + 1).padStart(2,"0")} / 08</span><h3>{nodes[active][0]}</h3><p>{nodes[active][1]}</p></aside>
  </div>;
}
