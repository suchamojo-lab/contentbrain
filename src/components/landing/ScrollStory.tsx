import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TOPMATE_URL } from "../ResearchPaywall";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);
const scattered = ["Your experiences","Your expertise","Questions people ask","Things you care about","Posts you save","Creators you study","Industry trends"];
const universe = [["CHARACTER","What made you, you?","Background, career, turning points, failures and stories."],["GIFTS","What do people naturally come to you for?","The knowledge and help people already associate with you."],["OBSESSIONS","What can you not shut up about?","The ideas and questions you keep returning to."],["EXPRESSION","How do you naturally communicate?","Writing, talking, teaching, stories, interviews and opinions."]];
const outcomes = [["POSITIONING","What you should become known for."],["CONTENT PILLARS","The themes you can consistently own."],["AUDIENCE INTELLIGENCE","What your audience wants, fears and questions."],["YOUR POINT OF VIEW","The stories and beliefs that make the work yours."],["CONTENT INSPIRATION","Creators, formats and ideas worth studying."],["IDEA BANK","Ideas, hooks, questions and stories worth creating."]];
const sources = ["Saved Posts","Your Socials","Creators","Trends","Internet Research","Your Existing Content"];

export function ScrollStory({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => gsap.from(el,{ y:65,opacity:0,duration:1.1,ease:"power3.out",scrollTrigger:{ trigger:el,start:"top 82%" } }));
    gsap.fromTo(".scatter-list span",{ y:90,opacity:0 },{ y:0,opacity:1,stagger:.09,scrollTrigger:{ trigger:".scatter-section",start:"top 55%",end:"bottom 60%",scrub:1 } });
    gsap.fromTo(".universe-transfer i",{ scaleX:0 },{ scaleX:1,stagger:.15,scrollTrigger:{ trigger:".discover-section",start:"top 55%",end:"bottom 55%",scrub:1 } });
    gsap.fromTo(".learning-source",{ y:80,opacity:0 },{ y:0,opacity:1,stagger:.1,scrollTrigger:{ trigger:".learning-section",start:"top 65%",end:"center 55%",scrub:1 } });
  },{ scope:root,dependencies:[reduced] });
  return <section ref={root} className="scroll-story editorial-story" id="story">
    <section className="scatter-section"><header data-reveal><h2>You already have the ideas.<br /><em>They’re just scattered everywhere.</em></h2></header><div className="scatter-list">{scattered.map((item) => <span key={item}>{item}</span>)}</div><p data-reveal>Your Content Brain brings them together.</p></section>
    <section className="discover-section"><header data-reveal><span className="story-label">01 / DISCOVER YOUR UNIVERSE</span><h2>Before AI creates for you,<br /><em>it should understand you.</em></h2></header><div className="discover-stage"><div className="universe-transfer" aria-hidden="true"><div>YOU</div>{universe.map(([label]) => <i key={label} />)}<strong>CONTENT<br />BRAIN</strong></div><div className="universe-areas">{universe.map(([label,title,copy],index) => <article data-reveal key={label}><span>0{index + 1} / {label}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="training-section"><header data-reveal><span className="story-label">02 / TRAIN YOUR CONTENT BRAIN</span><h2>Now it starts<br /><em>connecting the dots.</em></h2></header><div className="brain-formula" data-reveal><div>{["Your expertise","Your experiences","Your audience","Your interests","Your point of view","What’s working now"].map((item,index) => <span key={item}>{item}{index < 5 ? <b>+</b> : null}</span>)}</div><i>=</i><strong>YOUR<br />CONTENT BRAIN</strong></div><p data-reveal>A living context layer that helps AI understand what you should talk about, why you should talk about it, and how only you can say it.</p></section>
    <section className="outcomes-section"><header data-reveal><span className="story-label">03 / KNOW WHAT TO CREATE</span><h2>Stop asking<br /><em>“What should I post?”</em></h2></header><div>{outcomes.map(([title,copy],index) => <article data-reveal key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div><p data-reveal>Not another list of generic AI ideas.<br /><strong>A content system built around you.</strong></p></section>
    <section className="learning-section"><header data-reveal><span className="story-label">YOUR BRAIN KEEPS LEARNING</span><h2>The internet becomes part<br /><em>of your Content Brain.</em></h2></header><div className="learning-orbit"><strong>YOU</strong>{sources.map((source,index) => <span className={`learning-source learning-source--${index + 1}`} key={source}>{source}</span>)}</div><blockquote data-reveal>Your AI should know your world<br />before it writes a word.</blockquote></section>
    <section className="context-section"><header data-reveal><span className="story-label">04 / CREATE WITH CONTEXT</span><h2>Drop in<br /><em>one idea.</em></h2></header><div className="context-example"><div className="context-idea">“I think founders are outsourcing their point of view to AI.”</div><div className="context-links">{["Personal context","Past ideas","Relevant stories","Internet research","Strong examples","Audience questions"].map((item) => <span key={item}>{item}</span>)}</div><div className="context-result"><span>CONTENT DIRECTION</span><strong>One thought in.<br />An entire research universe out.</strong></div></div></section>
    <section className="story-final" data-reveal><span className="story-label">YOUR CONTENT UNIVERSE STARTS WITH YOU</span><h2>You have more to say<br /><em>than you think.</em></h2><p>Build the brain that helps you find it.</p><div><button onClick={onStart}>BUILD MY CONTENT UNIVERSE →</button><a href={TOPMATE_URL} target="_blank" rel="noreferrer">BUILD WITH THE TEAM ↗</a></div></section>
  </section>;
}
