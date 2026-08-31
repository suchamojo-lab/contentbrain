import type { UniverseAnswers } from "../../lib/recommendation";
import { universeQuestions } from "../../data/universeQuestions";
import { UniverseQuestion } from "./UniverseQuestion";
import { BrainTraining } from "./BrainTraining";
import {useRef} from "react";
import {gsap} from "gsap";
export function ContentUniverse({step,answers,error,saving,onChange,onBack,onAdvance}:{step:number;answers:UniverseAnswers;error:string;saving:boolean;onChange:(key:string,value:string)=>void;onBack:()=>void;onAdvance:()=>void}) {
  const root=useRef<HTMLElement>(null);
  const prompt = universeQuestions[step]; const progress = Math.round((step / universeQuestions.length) * 100);
  const submit=()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return onAdvance();const card=root.current?.querySelector(".answer-file");if(!card)return onAdvance();gsap.timeline({onComplete:onAdvance}).fromTo(card,{opacity:0,scale:1,y:0,rotate:0},{opacity:1,scale:.72,y:-20,rotate:-4,duration:.22}).to(card,{x:"42vw",y:80,scale:.18,rotate:8,opacity:0,duration:.38,ease:"power2.in"}).to(".world-folder",{scale:1.05,duration:.12,yoyo:true,repeat:1},.28);};
  return <main ref={root} className="universe-experience universe-experience--v1"><div className="form-world" aria-hidden="true"/><div className="universe-progress"><span style={{width:`${progress}%`}} /></div><p className="universe-progress-copy">Your Universe · {progress}% mapped</p><BrainTraining step={step+1} total={universeQuestions.length}/><div className="world-folder" aria-hidden="true"><i>{String(prompt.stage).padStart(2,"0")}</i><strong>{prompt.stageTitle}</strong></div><UniverseQuestion prompt={prompt} value={answers[prompt.key] ?? ""} error={error} saving={saving} onChange={(value) => onChange(prompt.key,value)} onBack={onBack} onSubmit={submit} /></main>;
}
