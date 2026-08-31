import {universeQuestions} from "./universeQuestions";
export const moduleSlugs=["story","superpowers","rabbit-holes","hot-takes","people","personality","proof","future"] as const;
export type ModuleSlug=typeof moduleSlugs[number];
export interface UniverseModule { slug:ModuleSlug;stage:number;number:string;title:string;message:string;emptyLabel:string;completeLabel:string; }
export const universeModules:UniverseModule[]=[
 {slug:"story",stage:1,number:"01",title:"Your Story",message:"Let’s steal a few stories from your life.",emptyLabel:"Not explored",completeLabel:"Story mapped"},
 {slug:"superpowers",stage:2,number:"02",title:"Your Superpowers",message:"What do people keep using you for?",emptyLabel:"Not explored",completeLabel:"Superpowers found"},
 {slug:"rabbit-holes",stage:3,number:"03",title:"Your Rabbit Holes",message:"What can you absolutely not shut up about?",emptyLabel:"Not explored",completeLabel:"Curiosity mapped"},
 {slug:"hot-takes",stage:4,number:"04",title:"Your Hot Takes",message:"Time to be slightly controversial.",emptyLabel:"Not explored",completeLabel:"POVs found"},
 {slug:"people",stage:5,number:"05",title:"Your People",message:"Who should become obsessed with your content?",emptyLabel:"Not explored",completeLabel:"Audience mapped"},
 {slug:"personality",stage:6,number:"06",title:"Content Personality",message:"How do you sound when nobody makes you create content?",emptyLabel:"Not explored",completeLabel:"Style found"},
 {slug:"proof",stage:7,number:"07",title:"Your Proof",message:"Okay. Flex a little.",emptyLabel:"Not explored",completeLabel:"Proof mapped"},
 {slug:"future",stage:8,number:"08",title:"Future Self",message:"Where are we taking all this?",emptyLabel:"Not explored",completeLabel:"Direction found"},
];
export const moduleForSlug=(slug?:string)=>universeModules.find((module)=>module.slug===slug);
export const questionsForModule=(slug:ModuleSlug,mode:"quick"|"deep"="deep")=>{const module=moduleForSlug(slug)!;const questions=universeQuestions.filter((question)=>question.stage===module.stage);return mode==="quick"?questions.slice(0,1):questions};
