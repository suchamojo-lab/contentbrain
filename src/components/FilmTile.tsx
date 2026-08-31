import { useRef, type PointerEvent } from "react";

interface FilmTileProps { title: string; label: string; description?: string; video?: string; className?: string; index?: string; }

export function FilmTile({ title, label, description, video, className = "", index }: FilmTileProps) {
  const tileRef = useRef<HTMLElement>(null);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--film-x", `${((event.clientX - rect.left) / rect.width - .5) * 10}px`);
    event.currentTarget.style.setProperty("--film-y", `${((event.clientY - rect.top) / rect.height - .5) * 10}px`);
  };
  const reset = () => { tileRef.current?.style.setProperty("--film-x", "0px"); tileRef.current?.style.setProperty("--film-y", "0px"); };
  return <article ref={tileRef} className={`film-tile ${className}`} onPointerMove={move} onPointerLeave={reset}>
    <div className="film-media" aria-hidden="true">{video ? <video src={video} muted autoPlay loop playsInline preload="metadata" /> : null}<div className="film-fallback"><i /><i /><i /><span /></div></div>
    <div className="film-shade" /><div className="film-copy"><div className="film-meta"><span>{index}</span><span>{label}</span></div><h3>{title}</h3>{description ? <p>{description}</p> : null}</div>
  </article>;
}
