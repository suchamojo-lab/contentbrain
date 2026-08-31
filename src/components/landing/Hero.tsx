import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { TOPMATE_URL } from "../ResearchPaywall";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { BrainTransition } from "./BrainTransition";
import { CosmicBrain } from "./CosmicBrain";
import { SoundControl } from "./SoundControl";

gsap.registerPlugin(useGSAP);

export function Hero({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [transitioning, setTransitioning] = useState(false);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    gsap.from(".cinematic-copy > *", { y: 34, opacity: 0, duration: 1.15, stagger: .09, ease: "power3.out" });
    gsap.from(".cosmic-brain", { scale: .94, opacity: 0, duration: 1.6, ease: "power2.out" });
    gsap.from(".saloon-action-dock", { y: 35, opacity: 0, duration: 1, delay: .7, ease: "power3.out" });
  }, { scope: root, dependencies: [reduced] });

  const start = () => {
    if (transitioning) return;
    if (reduced) return onComplete();
    setTransitioning(true);
    requestAnimationFrame(() => {
      const timeline = gsap.timeline({ onComplete });
      timeline.to(".cinematic-copy", { y: -80, opacity: 0, duration: .65, ease: "power2.in" })
        .to(".cosmic-brain", { scale: 1.35, xPercent: -16, yPercent: -7, duration: 1.05, ease: "power3.inOut" }, .3)
        .to(".brain-light", { opacity: 1, scale: 2.2, duration: .55 }, .72)
        .to(".brain-transition", { opacity: 1, duration: .25 }, .88)
        .fromTo(".brain-transition i", { x: 0, y: 0, scale: .3, opacity: 0 }, { x: () => gsap.utils.random(-700,700), y: () => gsap.utils.random(-450,350), scale: () => gsap.utils.random(.7,2.4), opacity: 1, duration: .8, stagger: .025, ease: "power3.out" }, .9)
        .to(".transition-copy", { opacity: 1, y: 0, duration: .5 }, 1.25)
        .to(root.current, { opacity: 0, duration: .35 }, 1.85);
    });
  };

  return <section ref={root} className={`cinematic-hero cinematic-hero--universe saloon-hero ${transitioning ? "is-transitioning" : ""}`}><header className="cinematic-nav saloon-nav"><a href="#top">EVERYTHING CONTENT</a><div className="saloon-live"><i /><span>CONTENT UNIVERSE</span><b>FREE</b></div><nav><a href="#story">HOW IT WORKS</a><a href={TOPMATE_URL} target="_blank" rel="noreferrer">BUILD WITH THE TEAM ↗</a></nav><SoundControl /></header><CosmicBrain /><div className="hero-space-texture" /><div className="cinematic-copy saloon-copy"><span>THE SECOND BRAIN BEHIND YOUR PERSONAL BRAND</span><h1>Build your<br /><em>Content Brain.</em></h1><p>Turn everything you know, notice, save and care about into a living system for what you should create next.</p></div><div className="saloon-action-dock"><div className="saloon-action-mark"><span>EC</span><i /></div><div className="saloon-action-copy"><strong>Build my Content Universe</strong><span>Your character, gifts, obsessions and expression—connected.</span><div><i /><i /><i /><i /></div></div><button onClick={start} aria-label="Build my Content Universe"><span>BEGIN</span><b>→</b></button></div><span className="saloon-helper">FREE · TAKES ABOUT 5 MINUTES · NO ACCOUNT NEEDED TO START</span>{transitioning ? <BrainTransition /> : null}</section>;
}
