export type UniverseAnswers = Record<string, string>;
export type CompassKey = "character"|"gifts"|"expertise"|"obsessions"|"opinions"|"audience"|"expression"|"positioning";
export type CompassAnswers = Record<CompassKey,string>;
export interface ContentWorld { title: string; why: string; topics: string[]; experiences: string[]; audienceQuestions: string[]; ideas: string[]; }
export interface StoryOpportunity { title: string; happened: string; whyItMatters: string; lesson: string; angle: string; }
export interface PovOpportunity { belief: string; why: string; evidence: string; hook: string; directions: string[]; }
export interface ContentOpportunity { category: "Story" | "Teach" | "Opinion" | "Question" | "Rabbit hole"; title: string; }
export interface ContentUniverseV1 {
  character: { summary: string; identitySignals: string[]; characterTraits: string[]; coreMotive: string };
  gifts: { naturalStrengths: string[]; superpower: string };
  radiance: { topics: string[]; interestingIntersections: Array<{ title: string; insight: string }> };
  expression: { profile: string; bestFormats: string[]; lessNaturalFormats: string[] };
  territory: { archetype: string; positioning: string; territories: Array<{ title: string; description: string }> };
  contentPillars: Array<{ title: string; why: string; topics: string[] }>;
  storyBank: Array<{ title: string; source: string; lesson: string; potentialHook: string }>;
  ideaUniverse: Array<{ pillar: string; ideas: string[] }>;
}
export interface ContentUniverse extends ContentUniverseV1 {
  identity: string; positioning: string; mission: string; worlds: ContentWorld[]; stories: StoryOpportunity[]; povs: PovOpportunity[];
  expertise: { earned: string[]; lived: string[]; curiosity: string[] };
  audience: { profile: string; problems: string[]; goals: string[]; fears: string[]; misconceptions: string[]; aspirations: string[]; buyingTriggers: string[]; searches: string[]; asksAi: string[] };
  personality: { styles: string[]; primaryFormats: string[]; secondaryFormats: string[]; experimentalFormats: string[]; avoid: string[]; references: string[] };
  opportunities: ContentOpportunity[];
}
const clean = (value = "") => value.trim().replace(/\s+/g, " ");
const first = (value = "", fallback: string) => clean(value).split(/[.!?\n]/)[0] || fallback;
const list = (value = "") => value.split(/[,;\n]/).map(clean).filter(Boolean);
const answer = (answers: UniverseAnswers, ...keys: string[]) => keys.map((key) => answers[key]).filter(Boolean).join(" ");
const STOP = new Set(["about","after","again","also","because","been","being","from","have","into","just","people","really","that","their","them","then","there","these","they","this","those","through","want","what","when","where","which","with","would","your"]);
function keywords(value: string, limit = 12) { const counts = new Map<string, number>(); clean(value).toLowerCase().match(/[a-z][a-z-]{3,}/g)?.forEach((word) => { if (!STOP.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1); }); return [...counts].sort((a,b) => b[1]-a[1]).slice(0,limit).map(([word]) => word.replace(/\b\w/g,(letter) => letter.toUpperCase())); }
const pad = (items: string[], fallbacks: string[], count: number) => [...new Set([...items,...fallbacks])].slice(0,count);

/** Deterministic local generation keeps the complete funnel usable without live AI. */
export function generateUniverse(answers: UniverseAnswers): ContentUniverse {
  const storyText = answer(answers,"story_early","story_journey","story_turning","story_lessons");
  const giftText = answer(answers,"power_asked","power_easy","power_results","power_teach");
  const curiosityText = answer(answers,"rabbit_topics","rabbit_sources","rabbit_energy","rabbit_learning");
  const proofText = answer(answers,"proof_results","proof_people","proof_numbers","proof_access");
  const audienceText = answer(answers,"people_who","people_wants","people_problem","people_truth");
  const futureText = answer(answers,"future_known","future_name","future_opportunities","future_success");
  const earned = pad(keywords(`${giftText} ${proofText}`,8),["Teaching","Problem Solving","Practical Implementation"],8);
  const lived = pad(keywords(storyText,8),["Career Change","Learning Through Experience","Building Systems"],8);
  const curiosity = pad(keywords(curiosityText,8),["Emerging Ideas","Future Trends","Continuous Learning"],8);
  const worldSeeds = pad([...earned.slice(0,3),...curiosity.slice(0,3)],["Lived Experience","Systems for Better Work","Ideas Worth Exploring","Lessons From Practice"],5);
  const audience = first(audienceText,"ambitious people trying to turn knowledge into useful work");
  const turning = first(answers.story_turning,"The moment experience changed how you work");
  const belief = first(answers.takes_belief,"Useful work comes from experience, not generic advice");
  const styles = list(answers.personality_style); const formats = list(answers.personality_formats);
  const groups: Array<[ContentOpportunity["category"],string[]]> = [
    ["Story",["The turning point that changed your direction","A failure that created a better system","The unexpected opportunity","What your early life taught you","A result that surprised you","The moment your worldview changed","A lesson earned the hard way","Behind a decision you are proud of","What becoming a beginner taught you","The experience you now see differently"]],
    ["Teach",earned.slice(0,5).flatMap((item) => [`A practical guide to ${item}`,`What experience taught you about ${item}`])],
    ["Opinion",[belief,"The common advice you disagree with","What your industry rewards incorrectly","A belief experience forced you to change","What beginners are told that is incomplete","Why tools are not the same as systems","The future shift people underestimate","What experts make unnecessarily difficult","The trade-off nobody discusses","The principle you refuse to compromise"]],
    ["Question",["What is my audience really struggling with?","What do people repeatedly ask me?","What result does my audience want fastest?","What are they afraid to admit?","What have they already tried?","What does success look like to them?","What do they misunderstand about the problem?","What should they stop doing?","What decision are they avoiding?","What would make them trust an answer?"]],
    ["Rabbit hole",curiosity.slice(0,5).flatMap((item) => [`What is changing inside ${item}?`,`A beginner’s field guide to ${item}`])],
  ];
  const characterSummary = first(answers.character || storyText,"A curious person turning lived experience into useful ideas.");
  const giftSummary = first(answers.gifts || giftText,"Making difficult things easier to understand");
  const radianceTopics = pad(list(answers.obsessions || curiosityText),curiosity,5);
  const chosenFormats = list((answers.expressionFormats ?? "").replaceAll(" | ", ","));
  const pillarSeeds = pad([...earned.slice(0,2),...radianceTopics.slice(0,2)],["Lived experience","Useful explanations","Active curiosity"],3);
  const v1:ContentUniverseV1={
    character:{summary:characterSummary,identitySignals:pad(keywords(answers.character,6),["Lived experience","Curiosity","Change"],5),characterTraits:pad(keywords(answers.character,4),["Curious","Practical","Thoughtful"],3),coreMotive:"Turn lived experience and curiosity into something useful for other people."},
    gifts:{naturalStrengths:earned.slice(0,5),superpower:`Turning messy situations into clear thinking about ${giftSummary.toLowerCase()}.`},
    radiance:{topics:radianceTopics,interestingIntersections:pad(radianceTopics,curiosity,3).map((topic,index)=>({title:`${earned[index]??"Experience"} × ${topic}`,insight:`Explore how your experience with ${earned[index]?.toLowerCase()??"practical work"} changes the way you see ${topic.toLowerCase()}.`}))},
    expression:{profile:first(answers.expressionNotes || answers.expression,"You communicate best through clear, structured explanations."),bestFormats:chosenFormats.length?chosenFormats:["Writing","Teaching"],lessNaturalFormats:["Formats that rely on a persona you have not chosen","High-volume trend content"]},
    territory:{archetype:`The ${earned[0]??"Practical"} Guide`,positioning:`Help people think more clearly about ${pillarSeeds.map((item)=>item.toLowerCase()).join(", ")}.`,territories:pillarSeeds.map((title)=>({title,description:`A grounded territory drawn from what you stated about your experience, gifts, and curiosity.`}))},
    contentPillars:pillarSeeds.map((title,index)=>({title,why:`This connects your stated ${index<2?"strengths":"interests"} with material you can explore honestly.`,topics:pad([earned[index],radianceTopics[index],lived[index]].filter(Boolean),["Lessons from experience","Practical decisions","Questions worth exploring"],4)})),
    storyBank:pad(list(answers.character),[characterSummary],3).map((source,index)=>({title:index===0?"The story that shaped your direction":`A lesson inside ${first(source,"your experience")}`,source,lesson:"Name what changed in how you think or act, without claiming more than the source supports.",potentialHook:`What ${first(source,"this experience").toLowerCase()} taught me.`})),
    ideaUniverse:pillarSeeds.map((pillar,index)=>({pillar,ideas:[`What people notice too late about ${pillar}`,`A lesson experience taught me about ${pillar}`,`The decision that changes how you approach ${pillar}`,`What I am still learning about ${pillar}`,`A practical way to think about ${pillar}`].map((idea)=>index?idea:idea)})),
  };
  return {
    ...v1,
    identity:`A thoughtful practitioner who connects ${earned[0]} with ${curiosity[0]} and turns lived experience into useful guidance.`,
    positioning:`You are a ${earned[0]}-led creator who speaks to ${audience.toLowerCase()} through practical experience, clear systems and a distinct point of view.`,
    mission:first(futureText,`Help ${audience.toLowerCase()} think clearly and make useful progress.`),
    worlds:worldSeeds.map((title,index) => ({ title, why:`This world sits at the intersection of your ${index < 3 ? "earned experience" : "active curiosity"}, personal story and what your audience needs next.`, topics:pad([earned[index],curiosity[index],lived[index]].filter(Boolean),["Practical systems","Lessons from experience","Future shifts"],4), experiences:[first(answers.story_journey,"Your path into this work"),turning], audienceQuestions:[`How can I apply ${title.toLowerCase()}?`,`What do most people misunderstand about ${title.toLowerCase()}?`], ideas:[`What experience taught me about ${title}`,`A practical system for ${title}`,`My unpopular view on ${title}`] })),
    stories:pad([turning,first(answers.story_early,"The early experience that shaped you"),first(answers.story_lessons,"The lesson you had to earn"),...lived],["The career pivot","The failure that changed how you work","The unexpected opportunity","The moment your worldview changed","Balancing ambition with real life","The first person who trusted your work","A difficult decision that paid off","Starting again as a beginner","The system you built for yourself","The result you did not expect","The advice you wish you had earlier"],14).map((title) => ({ title,happened:`A real moment from your journey around ${title.toLowerCase()}.`,whyItMatters:"It shows the lived experience behind your advice.",lesson:"Turn the experience into one principle your audience can use.",angle:`What ${title.toLowerCase()} taught me that theory could not.` })),
    povs:pad([belief,first(answers.takes_advice,"Common advice misses the real problem"),first(answers.takes_changed,"A belief you changed through experience"),first(answers.takes_future,"The shift your industry is underestimating")],["Systems beat scattered effort","Clarity matters more than more information","Experience should shape the advice","Practical use matters more than novelty","The right constraint improves creative work","Learning should produce a change in behaviour","Good tools cannot rescue unclear thinking","Consistency needs a system, not more motivation","The audience needs specificity, not more noise"],11).map((item) => ({ belief:item,why:"This belief appears repeatedly across your experiences and choices.",evidence:turning,hook:`I believe ${item.toLowerCase()}—and experience is why.`,directions:["Tell the origin story","Explain the opposing view","Give the audience a practical test"] })),
    expertise:{ earned,lived,curiosity },
    audience:{ profile:audience,problems:pad(keywords(answers.people_problem,4),["Too much scattered information","Unclear next steps"],4),goals:pad(keywords(answers.people_wants,4),["Clarity","Useful progress"],4),fears:["Falling behind","Wasting time on the wrong approach"],misconceptions:[first(answers.people_truth,"The visible problem is not always the real problem")],aspirations:[first(answers.people_wants,"Become confident and capable")],buyingTriggers:["A clear path","Proof from relevant experience"],searches:[`How to get better at ${earned[0]}`,`Best system for ${worldSeeds[0]}`],asksAi:[`Help me make a plan for ${worldSeeds[0]}`,`Explain ${curiosity[0]} in practical terms`] },
    personality:{ styles:styles.length?styles:["Teaching","Examples","Storytelling"],primaryFormats:formats.slice(0,2).length?formats.slice(0,2):["Writing","Talking to camera"],secondaryFormats:formats.slice(2,4).length?formats.slice(2,4):["Visual explainers"],experimentalFormats:formats.slice(4).length?formats.slice(4):["Interviews"],avoid:list(answers.personality_hate),references:list(answers.personality_refs) },
    opportunities:groups.flatMap(([category,titles]) => pad(titles,[`A useful direction from your ${category.toLowerCase()}`],10).map((title) => ({ category,title }))).slice(0,50),
  };
}
export function mergeGeneratedUniverse(generated: ContentUniverseV1, answers: UniverseAnswers): ContentUniverse {
  return { ...generateUniverse(answers), ...generated };
}
export interface Inspiration { title:string; pattern:string; source:string; platform:string; creator:string; url?:string; performance:string; relevance:string; provenance:"INFERENCE"|"VERIFIED"; }
export interface Recommendation { fit:string; angle:string; format:string; hooks:string[]; direction:string[]; inspiration:Inspiration[]; }
export function generateRecommendation(_answers:UniverseAnswers,universe:ContentUniverse,rawIdea:string):Recommendation { return { fit:`This fits ${universe.audience.profile}.`,angle:clean(rawIdea),format:universe.personality.primaryFormats[0],hooks:[`What most people miss about ${clean(rawIdea)}`],direction:["Open with a real moment","Explain the insight","Make it useful"],inspiration:[] }; }
