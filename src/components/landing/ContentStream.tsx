import { ContentCard, type StreamCard } from "./ContentCard";

const cards: StreamCard[] = [
  ["SAVED POST","The belief that changed","A note from your library"],["REEL","An idea in motion","00:42 · saved"],["CREATOR","The practical operator","Frameworks + proof"],["TREND","Trust is shifting","Audience signal"],["ARTICLE","Expertise after AI","Research document"],["HOOK","Most advice misses this","Opening line"],["SCRIPT","Start with the failure","Draft · 63 words"],["AUDIENCE","How do I begin?","Recurring question"],["SCREENSHOT","A useful pattern","Reference image"],["IDEA NOTE","Context beats prompts","Captured today"],["SEARCH","What people care about","Research query"],["TRANSCRIPT","The sentence worth saving","Interview · 38:12"],["YOUTUBE","Why this worked","Creator example"],["PDF","The future of expertise","12 highlights"],["STORY","The first real turning point","From your universe"],["FORMAT","Talking-head essay","Natural expression"],["OPINION","Generic content is a context problem","Point of view"],["BOOKMARK","Study this structure","Saved reference"],["QUESTION","What changed your mind?","Audience curiosity"],["DIRECTION","Teach through one moment","Recommended angle"],
].map(([type,title,detail]) => ({ type,title,detail }));

export function ContentStream({ layer, reverse = false }: { layer: number; reverse?: boolean }) {
  const doubled = [...cards.slice(layer * 3, layer * 3 + 10), ...cards.slice(layer * 3, layer * 3 + 10)];
  return <div className={`content-stream content-stream--${layer} ${reverse ? "is-reverse" : ""}`} aria-hidden="true"><div>{doubled.map((card,index) => <ContentCard key={`${card.title}-${index}`} card={card} index={index} />)}</div></div>;
}
