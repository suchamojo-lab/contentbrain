import {useEffect,useRef,useState} from "react";
import type {ModuleSlug} from "../../data/universeModules";
import {TOPMATE_URL} from "../ResearchPaywall";
import {useReducedMotion} from "../../hooks/useReducedMotion";
import {EditorialBrainVisual} from "../editorial/EditorialBrainVisual";
import {visualAssets} from "../../content/visualAssets";
import {siteLinks} from "../../config/siteLinks";
import {PublicSiteLayout} from "../site/PublicSiteLayout";

const brainOutputs=[
 {type:"IDEA",text:"“Why personal branding feels performative”"},
 {type:"STORY",text:"“The career shift that changed how you think”"},
 {type:"HOOK",text:"“You don't need more content. You need something worth being known for.”"},
 {type:"CONTENT PILLAR",text:"“AI × Content × Expertise”"},
];
const brainContext=[
 {type:"STORY",text:"Small-town beginnings"},
 {type:"EXPERTISE",text:"Creator strategy"},
 {type:"INTEREST",text:"AI + content"},
 {type:"BELIEF",text:"Personal branding feels too performative"},
 {type:"MEMORY",text:"Leaving journalism"},
 {type:"REFERENCE",text:"Saved post"},
];
const features=[
 {name:"Find",status:"AVAILABLE",title:"Find ideas people already care about.",copy:"Start with a thought worth developing. Your Brain connects it to your expertise, stories and point of view.",question:"What’s the version of this only I can make?",items:["Relevant territory","A sharper angle","Why this belongs to you"]},
 {name:"Save",status:"AVAILABLE",title:"Save anything. Actually use it later.",copy:"Ideas, stories, notes, references and drafts live together in your Library. Cross-platform post importing is coming next.",question:"Your bookmarks shouldn’t be a graveyard.",items:["Stories","Notes","References","Drafts"]},
 {name:"Research",status:"COMING NEXT",title:"An hour of research. One question.",copy:"Research will connect current conversations to your Content Universe instead of starting from an anonymous prompt.",question:"Don’t just ask what’s interesting. Ask what’s interesting for you.",items:["Conversations","Audience questions","Your Brain’s take"]},
 {name:"Study",status:"COMING NEXT",title:"Chat with anything worth learning from.",copy:"Study a creator, post, video, PDF or transcript. Learn from the hook and structure without copying the output.",question:"How would this idea work in my voice?",items:["Why it worked","What to learn","How to make it yours"]},
 {name:"Create",status:"AVAILABLE",title:"Create with everything behind you.",copy:"Bring your Universe and saved sources into one creation flow. AI drafting, scheduling and publishing are coming next.",question:"Not another blank chat.",items:["Angle","Hook","Draft","Repurpose"]},
];
const proofSlots=[
 {name:"Anwesha",initials:"AN",label:"FOUND HER IDEAS",outcome:"Found ideas that actually felt like hers",quote:"Content Brain helped me connect things I already knew about myself, but had never turned into actual content ideas. The ideas felt much more personal than a normal AI prompt.",connect:["What she knew","What made it personal","Ideas worth creating"]},
 {name:"Payel",initials:"PA",label:"FOUND HER DIRECTION",outcome:"Turned her interests into a clear direction",quote:"I usually know what I care about, but not how to turn it into a clear content direction. Content Brain gave me angles that actually matched my interests and how I naturally communicate.",connect:["Her interests","Her expression","A clear direction"]},
 {name:"Arya",initials:"AR",label:"FOUND HIS POSITIONING",outcome:"Found what he could become known for",quote:"The biggest value was clarity. It showed me what I could become known for and gave me a much clearer direction for what to create next.",connect:["What he knows","What he could own","What to create next"]},
 {name:"Shubhi",initials:"SH",label:"CREATED FROM HERSELF",outcome:"Stopped starting from a blank page",quote:"Instead of starting from a blank page, I could start from my own stories, strengths and interests. The output felt closer to me, not like generic AI content.",connect:["Her stories","Her strengths","Her interests"]},
];
const featureVisuals={0:visualAssets.discoverBrain,1:visualAssets.libraryBrain,2:visualAssets.researchBrain,3:visualAssets.studyBrain,4:visualAssets.createBrain} as const;

function FeatureStoryCard({feature,index}:{feature:(typeof features)[number];index:number}){
 const root=useRef<HTMLElement>(null);const [visible,setVisible]=useState(false);
 useEffect(()=>{const node=root.current;if(!node)return;if(typeof IntersectionObserver==="undefined"){setVisible(true);return}const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)return;setVisible(true);observer.disconnect()},{threshold:.2,rootMargin:"0px 0px -12%"});observer.observe(node);return()=>observer.disconnect()},[]);
 return <article ref={root} className={visible?"is-visible":""}><span>{String(index+1).padStart(2,"0")} / {feature.name.toUpperCase()}</span><div className="pl5-mobile-preview"><header><small>{feature.status}</small></header><div className="pl5-feature-media">{index in featureVisuals?<EditorialBrainVisual asset={featureVisuals[index as keyof typeof featureVisuals]} className="pl5-feature-visual" mask="paper" radius="soft" parallax={0} eager/>:null}</div><div>{feature.items.map(value=><i key={value}>↗ {value}</i>)}</div></div><div className="pl5-feature-stack-copy"><h3>{feature.title}</h3><p>{feature.copy}</p><blockquote>{feature.question}</blockquote></div></article>
}

function StartButton({onStart,children="Build my Content Universe →"}:{onStart:()=>void;children?:React.ReactNode}){return <button className="pl-primary" onClick={onStart}>{children}</button>}

function ContentBrainVisual(){
 const reduced=useReducedMotion();const root=useRef<HTMLDivElement>(null);const art=useRef<HTMLDivElement>(null);const inputs=useRef<(HTMLElement|null)[]>([]);const outputs=useRef<(HTMLElement|null)[]>([]);const result=useRef<HTMLElement>(null);const [activeInput,setActiveInput]=useState<number|null>(null);const [lockedInput,setLockedInput]=useState<number|null>(null);
 useEffect(()=>{const node=root.current;if(!node||reduced||!matchMedia("(pointer: fine)").matches)return;let frame=0,targetX=0,targetY=0,currentX=0,currentY=0;const layers=[...inputs.current.map(item=>({node:item,x:8,y:7})),{node:art.current,x:-4,y:-3},...outputs.current.map(item=>({node:item,x:7,y:6})),{node:result.current,x:5,y:4}];const render=()=>{currentX+=(targetX-currentX)*.06;currentY+=(targetY-currentY)*.06;layers.forEach(layer=>{layer.node?.style.setProperty("--parallax-x",`${currentX*layer.x}px`);layer.node?.style.setProperty("--parallax-y",`${currentY*layer.y}px`)});if(Math.abs(targetX-currentX)>.001||Math.abs(targetY-currentY)>.001)frame=requestAnimationFrame(render);else frame=0};const start=()=>{if(!frame)frame=requestAnimationFrame(render)};const move=(event:PointerEvent)=>{const bounds=node.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,((event.clientX-bounds.left)/bounds.width-.5)*2));targetY=Math.max(-1,Math.min(1,((event.clientY-bounds.top)/bounds.height-.5)*2));start()};const leave=()=>{targetX=0;targetY=0;start()};node.addEventListener("pointermove",move);node.addEventListener("pointerleave",leave);return()=>{node.removeEventListener("pointermove",move);node.removeEventListener("pointerleave",leave);if(frame)cancelAnimationFrame(frame)}},[reduced]);
 const outputFor=(input:number|null)=>input===3?0:input===4?1:input===1?2:null;const activeOutput=outputFor(activeInput);const positioningActive=activeInput!=null&&[0,1,2].includes(activeInput);const preview=(index:number)=>{if(lockedInput==null)setActiveInput(index)};const clearPreview=()=>{if(lockedInput==null)setActiveInput(null)};const toggle=(index:number)=>{const next=lockedInput===index?null:index;setLockedInput(next);setActiveInput(next)};
 return <div ref={root} className={`pl5-brain-stage is-ready is-interactive ${activeInput!=null?"is-exploring":""}`} onClick={()=>{setLockedInput(null);setActiveInput(null)}} onPointerLeave={clearPreview} aria-label="Explore how personal context becomes ideas, hooks, stories and positioning">
  <small className="pl5-brain-hint" aria-hidden="true">EXPLORE WHAT GOES IN →</small>
  <div className="pl5-context-inputs" aria-label="Sample personal context">{brainContext.map((context,index)=><button type="button" ref={node=>{inputs.current[index]=node}} className={activeInput===index?"is-active":""} aria-pressed={lockedInput===index} onPointerEnter={()=>preview(index)} onFocus={()=>preview(index)} onBlur={clearPreview} onClick={event=>{event.stopPropagation();toggle(index)}} key={context.type} style={{"--context-index":index} as React.CSSProperties}><small>{context.type}</small><p>{context.text}</p></button>)}</div>
  <div ref={art} className="pl5-hero-art-shell" aria-hidden="true"><EditorialBrainVisual asset={visualAssets.heroBrain} className="pl5-hero-art" mask="paper" parallax={0}/><i className="pl5-hero-art__pulse"/></div>
  <div className="pl5-brain-outputs" aria-label="Content Brain outputs">{brainOutputs.slice(0,3).map((output,index)=><article ref={node=>{outputs.current[index]=node}} className={activeOutput===index?"is-active":""} style={{"--o":index} as React.CSSProperties} key={output.type}><small>{output.type}</small><p>{output.text}</p></article>)}</div>
  <aside ref={result} className={`pl5-brain-result ${positioningActive?"is-active":""}`}><small>YOUR BRAIN FOUND SOMETHING</small><span>YOU COULD BECOME KNOWN FOR...</span><blockquote>“Turning what you know into content people actually care about.”</blockquote></aside>
 </div>
}

export function LandingExperience({onStart,authenticated,name,hasUniverse}:{onStart:(slug?:ModuleSlug)=>void;authenticated:boolean;name?:string;hasUniverse:boolean}){
 const earlyAccess=useRef<HTMLElement>(null);const login=()=>{history.pushState({},"","/login");dispatchEvent(new PopStateEvent("popstate"))};
 useEffect(()=>{const node=earlyAccess.current;if(!node||typeof IntersectionObserver==="undefined")return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){node.classList.add("is-visible");observer.disconnect()}},{threshold:.2});observer.observe(node);return()=>observer.disconnect()},[]);
 return <PublicSiteLayout session={{authenticated,name,hasUniverse}} className="public-landing-shell"><main className="public-landing public-landing--five">
  <section className="pl5-screen pl5-hero" id="top">
   <header><span>YOUR SECOND BRAIN FOR BUILDING A PERSONAL BRAND.</span><h1>Build your <em>content brain.</em></h1><h2>Everything you know, notice, and care about, remembered.</h2><p>So every time you create, you don’t start from zero.</p><div><StartButton onStart={()=>onStart()}/></div></header>
   <ContentBrainVisual/>
  </section>

  <section className="pl5-screen pl5-feed" id="feed">
   <header><span>FEED YOUR BRAIN. THEN DO MORE WITH IT.</span><h2>The internet is already<br/>full of ideas.</h2><p>Your Content Brain helps you find the ones that matter to you.</p></header>
   <div className="pl5-feature-story">
    <div className="pl5-feature-stack">{features.map((feature,index)=><FeatureStoryCard feature={feature} index={index} key={feature.name}/>)}</div>
   </div>
  </section>

  <section className="pl5-feature-final"><span>The point isn’t more AI.</span><h2>It’s AI that knows what to do with everything that makes you, you.</h2></section>

  <section className="pl5-screen pl5-proof" id="proof">
   <header><span>PEOPLE + PROOF</span><h2>What changed when people<br/><em>started using their Content Brain.</em></h2><p>Sometimes you don't need more ideas. You need to connect the ones already there.</p></header>
   <div>{proofSlots.map(slot=><article key={slot.name}><header><div className="pl5-proof-portrait" aria-label={`${slot.name} portrait placeholder`}>{slot.initials}</div><div><small>{slot.label}</small><h3>{slot.name}</h3></div></header><h4>{slot.outcome}</h4><blockquote>“{slot.quote}”</blockquote><footer><span>CONTENT BRAIN HELPED CONNECT:</span><div>{slot.connect.map((value,index)=><span key={value}>{value}{index<slot.connect.length-1?<i>+</i>:null}</span>)}</div></footer></article>)}</div>
  </section>

  <section className="pl5-screen pl5-human" id="human">
   <header><span>THE HUMAN LAYER</span><h2>A second brain helps you think.<br/><em>The right people help you move.</em></h2><p>You don’t have to figure it all out alone. Join the community for ideas, feedback, and people building alongside you. And when you need deeper help, work with us on your positioning, stories, and content system.</p></header>
   <div className="pl5-human-layout"><EditorialBrainVisual asset={visualAssets.humanLayerVisual} className="pl5-human-visual" mask="paper" parallax={5} fragments={[{label:"IDEA",content:"↗",x:"8%",y:"12%",rotate:-4,depth:1},{label:"FEEDBACK",content:"+",x:"72%",y:"16%",rotate:3,depth:1.3},{label:"STORY",content:"○",x:"68%",y:"78%",rotate:-2,depth:.8}]}/><div className="pl5-human-paths"><article><small>COMMUNITY</small><h3>Join people turning what they know into a body of work.</h3><p>Founders. Experts. Marketers. Writers. Operators. Creators.</p><a href={siteLinks.community}>Join the community <i>→</i></a></article><article><small>WORK WITH ME</small><h3>Sometimes you don't need another AI answer.</h3><p>You need someone to challenge the positioning, find the story, or tell you what isn't working.</p><ul><li>Personal branding</li><li>Content strategy</li><li>Storytelling</li><li>Content systems</li></ul><a href={TOPMATE_URL} target="_blank" rel="noreferrer">Book time with me <i>↗</i></a></article></div></div>
  </section>

  <section ref={earlyAccess} className="pl5-screen pl5-early" id="access"><div className="pl5-early-copy"><span>WE’RE JUST GETTING STARTED.</span><h2>Feed your brain.<br/><em>See what it finds.</em></h2><p>Build your Content Universe now.<br/>Get early access as research, saving, specialists and publishing unlock.</p><div className="pl5-access-list"><span>✓ Build your Content Universe</span><span>✓ Get early access to new features</span><span>✓ Join Everything Content updates</span></div><StartButton onStart={()=>onStart()}>Build my Universe + get early access <i>→</i></StartButton><button className="pl5-early-login" onClick={login}>Already have an account? Sign in →</button></div><div className="pl5-early-art"><EditorialBrainVisual asset={visualAssets.earlyAccessBrainVisual} className="pl5-final-visual" mask="paper" parallax={4}/><i className="pl5-early-fragment pl5-early-fragment--one" aria-hidden="true"/><i className="pl5-early-fragment pl5-early-fragment--two" aria-hidden="true"/></div>
  </section>
 </main></PublicSiteLayout>;
}
