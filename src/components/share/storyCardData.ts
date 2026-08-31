import type {ContentUniverse} from "../../lib/recommendation";

export const shareTemplates=["identity","brain","yaps","territory","superpower","insight"] as const;
export type ShareTemplate=typeof shareTemplates[number];
export type ShareFormat="story"|"post"|"landscape";
export type SharePlatform="instagram"|"linkedin"|"x";
export const shareFormats={story:{label:"Story 9:16",width:1080,height:1920},post:{label:"Post 4:5",width:1080,height:1350},landscape:{label:"Landscape 16:9",width:1600,height:900}} as const;

export interface SharePack{archetype:string;positioning:string;superpower:string;themes:string[];yapTopics:string[];territory:string[];actions:string[];insight:string}

export function clampWords(value:string,max:number){const words=value.trim().replace(/\s+/g," ").split(" ").filter(Boolean);return words.length<=max?words.join(" "):`${words.slice(0,max).join(" ").replace(/[.,;:]$/,"")}…`}
const unique=(values:(string|undefined)[])=>[...new Set(values.map(value=>value?.trim()).filter((value):value is string=>Boolean(value)))];

export function buildSharePack(universe:ContentUniverse,yapTopics:string[]=[]):SharePack{
 const pillars=universe.contentPillars.map(item=>item.title);
 const themes=unique([...universe.radiance.topics,...universe.territory.territories.map(item=>item.title),...pillars]).slice(0,4).map(item=>clampWords(item,5));
 const topicPool=unique([...yapTopics,...(universe.ideaUniverse??[]).flatMap(group=>group.ideas),...(universe.opportunities??[]).map(item=>item.title)]);
 const territory=unique([...universe.territory.territories.map(item=>item.title),...pillars,...themes]).slice(0,4).map(item=>clampWords(item,5));
 const actions=unique([...universe.gifts.naturalStrengths,...universe.contentPillars.flatMap(item=>item.topics),...(universe.personality?.styles??[])]).slice(0,4).map(item=>clampWords(item,7));
 const intersection=universe.radiance.interestingIntersections[0]?.title;
 const insight=intersection?`Your strongest ideas may live where ${intersection} overlap—not inside either subject alone.`:`You keep returning to ${themes.slice(0,3).join(", ")}. Their overlap may be where your most distinctive ideas live.`;
 return {archetype:clampWords(universe.territory.archetype,5),superpower:clampWords(universe.gifts.superpower,14),positioning:clampWords(universe.territory.positioning,22),themes:themes.length?themes:["Lived experience","Useful ideas","Clear thinking","Active curiosity"],yapTopics:topicPool.slice(0,5).map(item=>clampWords(item,12)),territory:territory.length?territory:["Expertise","Interests","Stories","Voice"],actions:actions.length?actions:["Explain complex things","Tell useful stories","Challenge generic advice","Make ideas easier to act on"],insight:clampWords(insight,35)};
}

export function captionFor(pack:SharePack,_template:ShareTemplate,platform:SharePlatform,url:string){
 if(platform==="instagram")return `Apparently I’m ${pack.archetype} 👀\nWhat’s in your Content Universe?\n${url}`;
 if(platform==="x")return `Apparently my Content Brain thinks I’m “${pack.archetype}.”\n\nHonestly… pretty accurate.\n\nWhat’s yours? ${url}`;
 return `Apparently my Content Universe says I’m “${pack.archetype}.”\n\nMy strongest territory sits around ${pack.themes.join(", ")}.\n\nThe interesting part: I answered only four questions.\n\nCurious what yours looks like → ${url}`;
}
