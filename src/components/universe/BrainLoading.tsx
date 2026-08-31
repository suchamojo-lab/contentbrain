import {useEffect,useState} from "react";
import {EditorialBrainVisual} from "../editorial/EditorialBrainVisual";
import {visualAssets} from "../../content/visualAssets";

const messages=[
 "Finding the stories inside your experiences…",
 "Connecting what you know with what you care about…",
 "Turning your natural gifts into useful content territory…",
 "Building a creative starting point that sounds like you…",
];

export function BrainLoading(){
 const [message,setMessage]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setMessage(current=>(current+1)%messages.length),1800);return()=>window.clearInterval(timer)},[]);
 return <main className="brain-loading" role="status" aria-live="polite">
  <section>
   <div className="brain-loading__map">
    <EditorialBrainVisual asset={visualAssets.universeBrain} className="brain-loading__art" mask="circle" parallax={4}/>
    <div className="brain-loading__signals" aria-hidden="true"><i>CHARACTER</i><i>OWN GIFTS</i><i>RADIANCE</i><i>EXPRESSION</i></div>
    <span aria-hidden="true"><small>CONTENT</small>UNIVERSE</span>
   </div>
   <div className="brain-loading__copy">
    <span>BUILDING YOUR CONTENT UNIVERSE</span>
    <h1>Your answers are<br/><em>becoming a point of view.</em></h1>
    <p className="brain-loading__message">{messages[message]}</p>
    <blockquote><strong>Generic AI starts with an empty box.</strong><br/>Your Content Universe gives AI your stories, expertise, interests and natural voice. That context is what keeps the next idea from becoming more AI slop.</blockquote>
    <small>KEEP THIS TAB OPEN · YOUR UNIVERSE WILL OPEN AUTOMATICALLY</small>
   </div>
  </section>
 </main>;
}
