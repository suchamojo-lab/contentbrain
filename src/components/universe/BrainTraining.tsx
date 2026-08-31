import { CosmicBrain } from "../landing/CosmicBrain";

export function BrainTraining({ step,total=4 }: { step:number;total?:number }) {
  const visualStage=Math.max(1,Math.ceil((step/total)*4));
  return <aside className="brain-training" aria-label={`Content Universe progress: ${step} of ${total}`}><CosmicBrain training={visualStage}/><div className="training-status"><span>BUILDING YOUR CONTENT UNIVERSE</span><b>{String(Math.max(step,1)).padStart(2,"0")} / {String(total).padStart(2,"0")}</b><i><em style={{transform:`scaleX(${step/total})`}}/></i></div></aside>;
}
