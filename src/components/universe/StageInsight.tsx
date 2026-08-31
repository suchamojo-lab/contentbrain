import { stageInsights } from "../../data/universeQuestions";
import { universeQuestions } from "../../data/universeQuestions";
import type { UniverseAnswers } from "../../lib/recommendation";

const resultNames=["","STORY MAP","SUPERPOWER MAP","CURIOSITY MAP","POV BANK","PEOPLE MAP","CREATIVE PERSONALITY","PROOF LOCKER","YOUR DIRECTION"];
const fallback=["A useful pattern is beginning to emerge.","This answer gives your Universe something real to work with.","Add more detail later to make this result sharper."];
const clean=(value:string)=>value.trim().replace(/\s+/g," ");

export function StageInsight({stage,answers,onContinue}:{stage:number;answers:UniverseAnswers;onContinue:()=>void}) {
 const insight=stageInsights[stage];
 const findings=universeQuestions.filter(question=>question.stage===stage).map(question=>clean(answers[question.key]??"")).filter(Boolean).map(value=>value.split(/[.!?\n]/)[0]).filter(Boolean).slice(0,3);
 const cards=[...findings,...fallback].slice(0,3);
 return <main className="stage-insight"><span>{resultNames[stage]} / SECTION COMPLETE</span><div className="insight-nodes" aria-hidden="true"><i/><i/><i/></div><h1>{insight.title}</h1><p>{insight.copy}</p><section className="section-findings" aria-label={`${resultNames[stage]} findings`}>{cards.map((item,index)=><article key={`${index}-${item}`}><small>FOUND {String(index+1).padStart(2,"0")}</small><strong>{item}</strong></article>)}</section><p className="section-result-note">This result comes only from this folder. Complete more folders and we’ll connect everything into your full Content Universe.</p><button className="button button--paper" onClick={onContinue}>{stage===8?"BUILD MY FULL CONTENT UNIVERSE →":"BACK TO MY UNIVERSE →"}</button></main>;
}
