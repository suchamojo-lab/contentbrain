import {shareFormats,type ShareFormat} from "../components/share/storyCardData";

export const formatDimensions=(format:ShareFormat)=>({width:shareFormats[format].width,height:shareFormats[format].height});
export async function renderShareCardPng(element:HTMLElement,format:ShareFormat,filename:string){const {width,height}=formatDimensions(format);await document.fonts.ready;const {toPng}=await import("html-to-image");const dataUrl=await toPng(element,{width,height,canvasWidth:width,canvasHeight:height,pixelRatio:1,cacheBust:true,style:{transform:"none",transformOrigin:"top left"}});const blob=await(await fetch(dataUrl)).blob();return {dataUrl,blob,file:new File([blob],filename,{type:"image/png"})}}
export function downloadRenderedCard(dataUrl:string,filename:string){const link=document.createElement("a");link.download=filename;link.href=dataUrl;link.click()}
