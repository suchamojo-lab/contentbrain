import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TOPMATE_URL } from "../ResearchPaywall";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);
const universeItems = [
  ["Character","Your background, turning points, failures and stories."],
  ["Gifts","What people trust you for and what you understand unusually well."],
  ["Obsessions","The ideas and questions you cannot stop exploring."],
  ["Expression","How you naturally write, speak, teach and tell stories."],
] as const;
const signals = ["Personal context","Expertise","Audience insights","Saved posts","Creators","Internet research","Trends","Ideas + drafts"];
const results = ["Positioning","Content pillars","Audience intelligence","Unique point of view","Ideas worth creating","Hooks, angles + formats"];

export function LightfieldLanding({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [ideaActive, setIdeaActive] = useState(false);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    gsap.from(".lf-hero-copy > *",{ y:35,opacity:0,duration:.9,stagger:.08,ease:"power3.out" });
    gsap.from(".lf-product",{ y:80,opacity:0,duration:1.2,delay:.35,ease:"power3.out" });
    gsap.utils.toArray<HTMLElement>(".lf-reveal").forEach((el) => gsap.from(el,{ y:55,opacity:0,duration:1,scrollTrigger:{ trigger:el,start:"top 82%" } }));
  },{ scope:root,dependencies:[reduced] });

  return <main ref={root} className="lf-site" id="top">
    <nav className="lf-nav"><a href="#top" className="lf-logo"><i>EC</i><span>Everything Content</span></a><div><a href="#workflow">How it works</a><a href={TOPMATE_URL} target="_blank" rel="noreferrer">Build with the team</a><button onClick={onStart}>Build my Universe</button></div></nav>

    <section className="lf-hero"><div className="lf-hero-copy"><span>THE SECOND BRAIN BEHIND YOUR PERSONAL BRAND</span><h1>Build your<br />Content Brain.</h1><p>Turn everything you know, notice, save and care about into a living system for what you should create next.</p><button onClick={onStart} aria-label="Build my Content Universe">BUILD MY CONTENT UNIVERSE <b>→</b></button><small>Free · Takes about 5 minutes · No account needed to start</small></div>
      <div className="lf-product" aria-label="Interactive Content Brain preview"><header><div><i>EC</i><strong>Content Brain</strong></div><span><b /> Brain active</span><button>•••</button></header><aside><button className="is-active"><i>◆</i>Brain</button><button><i>○</i>Ideas</button><button><i>□</i>Research</button><button><i>⌁</i>Library</button><small>YOUR UNIVERSE</small>{universeItems.map(([title],index) => <button className={active === index ? "is-selected" : ""} onClick={() => setActive(index)} key={title}><i>0{index + 1}</i>{title}</button>)}</aside><section><header><div><span>YOUR CONTENT UNIVERSE</span><h2>Your AI should know your world<br />before it writes a word.</h2></div><button onClick={onStart}>Add context +</button></header><div className="lf-brain-grid"><article className="lf-profile"><span>CONTENT THESIS</span><p>You help experts turn lived knowledge into content people remember, trust and act on.</p><div><i>CREATOR-STATED</i><i>INFERENCE</i></div></article><article className="lf-universe-detail"><span>0{active + 1} / {universeItems[active][0].toUpperCase()}</span><h3>{universeItems[active][0]}</h3><p>{universeItems[active][1]}</p><button onClick={() => setActive((active + 1) % 4)}>Explore next →</button></article>{results.slice(0,4).map((item,index) => <article className="lf-mini" key={item}><span>0{index + 1}</span><strong>{item}</strong><small>{["Content systems for real expertise","Stories · Systems · AI","Founders and experts","Practical · Curious · Clear"][index]}</small></article>)}</div></section></div>
    </section>

    <section className="lf-manifesto lf-reveal"><span>YOUR CONTEXT IS THE DIFFERENCE</span><h2>A generic AI knows the internet.<br /><em>Your Content Brain knows you.</em></h2><p>Your experiences. Your expertise. The questions people ask you. Things you cannot stop talking about. Posts you save. Creators you study. Trends in your industry.</p></section>

    <section className="lf-workflow" id="workflow"><header className="lf-reveal"><span>01 / DISCOVER YOUR UNIVERSE</span><h2>Before AI creates for you,<br />it should understand you.</h2></header><div className="lf-workflow-demo lf-reveal"><aside>{universeItems.map(([title],index) => <button key={title} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}><span>0{index + 1}</span>{title}<b>→</b></button>)}</aside><section><span>TRAINING YOUR CONTENT BRAIN</span><div className="lf-question"><small>0{active + 1} / {universeItems[active][0].toUpperCase()}</small><h3>{["What made you, you?","What do people naturally come to you for?","What can you not shut up about?","How do you naturally communicate?"][active]}</h3><p>{universeItems[active][1]}</p><div>{universeItems[active][0] === "Expression" ? "Writing, talking, teaching, storytelling…" : "Add the experiences and details only you can provide…"}</div></div><footer><span>Context captured</span><i style={{ width:`${(active + 1) * 25}%` }} /></footer></section></div></section>

    <section className="lf-context"><header className="lf-reveal"><span>02 / TRAIN YOUR CONTENT BRAIN</span><h2>Now it starts connecting the dots.</h2><p>A living context layer that understands what you should talk about, why it matters, and how only you can say it.</p></header><div className="lf-signal-map lf-reveal"><div className="lf-signals">{signals.map((signal,index) => <span style={{ "--signal":index } as React.CSSProperties} key={signal}>{signal}</span>)}</div><strong>EVERYTHING<br />CONTENT<br /><i>BRAIN</i></strong><div className="lf-results">{results.map((result) => <span key={result}>{result}<b>✓</b></span>)}</div></div></section>

    <section className="lf-create"><header className="lf-reveal"><span>03 / CREATE WITH CONTEXT</span><h2>Drop in one idea.<br />Get an entire direction.</h2></header><div className={`lf-create-demo lf-reveal ${ideaActive ? "is-running" : ""}`}><div className="lf-inbox"><span>WHAT’S ON YOUR MIND?</span><p>“I think founders are outsourcing their point of view to AI.”</p><button onClick={() => setIdeaActive(true)}>{ideaActive ? "DIRECTION READY ✓" : "FIND MY DIRECTION →"}</button></div><div className="lf-thinking">{["Connecting your experience","Checking audience relevance","Finding useful references","Selecting your strongest angle"].map((item,index) => <span style={{ "--delay":index } as React.CSSProperties} key={item}><i />{item}</span>)}</div><article><span>RECOMMENDED DIRECTION</span><h3>AI does not make your content generic.<br />Missing context does.</h3><p>Use your experience helping experts communicate to show why personal context—not better prompts—is the real advantage.</p><div><i>3 hooks</i><i>Talking-head essay</i><i>Story → framework → proof</i></div></article></div></section>

    <section className="lf-final"><div className="lf-reveal"><span>YOUR CONTENT UNIVERSE STARTS WITH YOU</span><h2>You have more to say<br />than you think.</h2><p>Build the brain that helps you find it.</p><button onClick={onStart}>BUILD MY CONTENT UNIVERSE →</button><a href={TOPMATE_URL} target="_blank" rel="noreferrer">BUILD WITH THE TEAM ↗</a></div></section>
    <footer className="lf-footer"><span>Everything Content</span><p>The Content Brain for experts, founders and creators.</p><a href={TOPMATE_URL} target="_blank" rel="noreferrer">Contact ↗</a></footer>
  </main>;
}
