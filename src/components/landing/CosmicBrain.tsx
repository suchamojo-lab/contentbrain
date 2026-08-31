import { useRef, type PointerEvent } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function CosmicBrain({ training = 0 }: { training?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--brain-x", `${((event.clientX - box.left) / box.width - .5) * 9}px`);
    event.currentTarget.style.setProperty("--brain-y", `${((event.clientY - box.top) / box.height - .5) * 7}px`);
  };
  return <div ref={ref} className="cosmic-brain" data-training={training} onPointerMove={move} onPointerLeave={() => { ref.current?.style.setProperty("--brain-x","0px"); ref.current?.style.setProperty("--brain-y","0px"); }}><img src="/content-brain-classic.jpg" alt="A sculptural Content Brain assembled from paper, memories, ideas and archive fragments" /><div className="brain-light" /><div className="brain-particles">{Array.from({ length: 14 },(_,index) => <i key={index} />)}</div></div>;
}
