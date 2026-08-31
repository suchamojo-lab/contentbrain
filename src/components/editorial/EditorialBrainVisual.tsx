import {useEffect,useRef} from "react";
import type {CSSProperties,ReactNode} from "react";
import type {EditorialVisualAsset} from "../../content/visualAssets";
import {useReducedMotion} from "../../hooks/useReducedMotion";

export interface EditorialFragment {
  label?: string;
  content: ReactNode;
  className?: string;
  x: string;
  y: string;
  rotate?: number;
  depth?: number;
}

interface EditorialBrainVisualProps {
  asset: EditorialVisualAsset;
  className?: string;
  caption?: string;
  fragments?: EditorialFragment[];
  grain?: boolean;
  mask?: "none"|"paper"|"portrait"|"circle";
  radius?: "none"|"soft"|"round";
  parallax?: number;
  eager?: boolean;
}

export function EditorialBrainVisual({asset,className="",caption,fragments=[],grain=true,mask="paper",radius="none",parallax=8,eager=asset.preload}:EditorialBrainVisualProps){
 const root=useRef<HTMLElement>(null);const reduced=useReducedMotion();
 useEffect(()=>{const node=root.current;if(!node||reduced||!parallax)return;const move=(event:PointerEvent)=>{if(event.pointerType==="touch")return;const bounds=node.getBoundingClientRect();node.style.setProperty("--editorial-x",`${((event.clientX-bounds.left)/bounds.width-.5)*parallax}px`);node.style.setProperty("--editorial-y",`${((event.clientY-bounds.top)/bounds.height-.5)*parallax}px`)};const reset=()=>{node.style.setProperty("--editorial-x","0px");node.style.setProperty("--editorial-y","0px")};node.addEventListener("pointermove",move);node.addEventListener("pointerleave",reset);return()=>{node.removeEventListener("pointermove",move);node.removeEventListener("pointerleave",reset)}},[parallax,reduced]);
 return <figure ref={root} className={`editorial-brain-visual mask-${mask} radius-${radius} ${grain?"has-grain":""} ${className}`}>
  <picture><source media="(max-width: 700px)" srcSet={asset.mobileSrc??asset.src}/><img src={asset.src} alt={asset.alt} width="1672" height="941" loading={eager?"eager":"lazy"} fetchPriority={eager?"high":"auto"} decoding="async" style={{"--editorial-position":asset.position??"center","--editorial-mobile-position":asset.mobilePosition??asset.position??"center"} as CSSProperties}/></picture>
  {fragments.length?<div className="editorial-brain-fragments" aria-hidden="true">{fragments.map((fragment,index)=><span className={fragment.className??""} key={`${fragment.label??"fragment"}-${index}`} style={{"--fragment-x":fragment.x,"--fragment-y":fragment.y,"--fragment-r":`${fragment.rotate??0}deg`,"--fragment-depth":fragment.depth??1} as CSSProperties}>{fragment.label?<small>{fragment.label}</small>:null}{fragment.content}</span>)}</div>:null}
  {grain?<i className="editorial-brain-grain" aria-hidden="true"/>:null}
  {caption?<figcaption>{caption}</figcaption>:null}
 </figure>;
}
