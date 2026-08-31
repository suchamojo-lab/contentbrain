import type {ShareFormat,SharePack,ShareTemplate} from "./storyCardData";

const indexOf:Record<ShareTemplate,string>={identity:"01",brain:"02",yaps:"03",territory:"04",superpower:"05",insight:"06"};
function BrainOrbit({template}:{template:ShareTemplate}){return <div className={`share-orbit share-orbit--${template}`} aria-hidden="true"><i/><i/><i/><span>CB</span></div>}
const Times=({items}:{items:string[]})=><div className="share-times">{items.map((item,index)=><span key={`${item}-${index}`}>{item}{index<items.length-1?<b>×</b>:null}</span>)}</div>;

export function ShareCardRenderer({data,template,format,interactive=false,onYap}:{data:SharePack;template:ShareTemplate;format:ShareFormat;interactive?:boolean;onYap?:(topic:string)=>void}){
 return <article data-share-card data-testid={`share-card-${template}`} className={`share-card share-card--${template} share-card--${format}`}>
  <div className="share-card__grain" aria-hidden="true"/><header><span>{indexOf[template]} / 06</span><b>MY CONTENT UNIVERSE</b></header><BrainOrbit template={template}/>
  <main>
   {template==="identity"?<><p>Apparently, my creative brain is:</p><div className="share-card__headline">{data.archetype}</div><section><small>MY SUPERPOWER</small><div className="share-card__subhead">{data.superpower}</div></section><section><small>I COULD BECOME KNOWN FOR…</small><div className="share-card__positioning">{data.positioning}</div></section></>:null}
   {template==="brain"?<><p>APPARENTLY MY BRAIN IS MOSTLY…</p><Times items={data.themes}/><blockquote>Not bad for 4 questions.</blockquote></>:null}
   {template==="yaps"?<><p>THINGS I SHOULD APPARENTLY</p><div className="share-card__headline">NEVER SHUT UP ABOUT</div><ol className="share-yaps">{data.yapTopics.map((topic,index)=><li key={`${topic}-${index}`}><b>{String(index+1).padStart(2,"0")}</b><span>{topic}</span>{interactive?<button onClick={()=>onYap?.(topic)}>Yap on this →</button>:null}</li>)}</ol></>:null}
   {template==="territory"?<><p>THE INTERSECTION I SHOULD OWN</p><Times items={["EXPERTISE","INTERESTS","STORIES","VOICE"]}/><div className="share-card__rule"/><Times items={data.territory}/><blockquote>THIS IS WHERE MY BEST IDEAS LIVE.</blockquote></>:null}
   {template==="superpower"?<><p>MY CONTENT SUPERPOWER</p><div className="share-card__headline">“{data.superpower}”</div><section><small>I SHOULD USE IT TO:</small><ul>{data.actions.map(item=><li key={item}>{item}</li>)}</ul></section></>:null}
   {template==="insight"?<><p>MY CONTENT BRAIN NOTICED SOMETHING…</p><div className="share-card__headline">“{data.insight}”</div><blockquote>What’s your brain hiding?</blockquote></>:null}
  </main>
  <footer><span>Built with Content Brain</span><strong>{template==="insight"?"Build yours →":"What’s in yours?"}</strong><b>everythingcontent</b></footer>
 </article>;
}

export type StoryTemplate=ShareTemplate;
