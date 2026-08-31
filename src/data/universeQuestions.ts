export type PromptKind="text"|"multi";
export interface UniversePrompt { key:string;stage:number;stageTitle:string;stageIntro:string;title:string;help:string;kind?:PromptKind;choices?:string[];optional?:boolean;placeholder?:string; }
const stage=(stage:number,stageTitle:string,stageIntro:string,prompts:Array<Omit<UniversePrompt,"stage"|"stageTitle"|"stageIntro">>)=>prompts.map((prompt)=>({...prompt,stage,stageTitle,stageIntro}));
export const universeQuestions:UniversePrompt[]=[
 ...stage(1,"Your Story","Let’s steal a few stories from your life.",[
  {key:"story_early",title:"Take me back. What were you like before your current career happened?",help:"Where did you grow up? What kind of kid or student were you? What were you obsessed with?"},
  {key:"story_journey",title:"What are 3 moments that changed the direction of your life?",help:"Could be a job, rejection, failure, random opportunity, person you met, or a big decision.",placeholder:"1.\n2.\n3."},
  {key:"story_turning",title:"Tell us about something that went badly but taught you a lot.",help:"A failure, bad decision, embarrassing moment, business mistake, or career setback."},
  {key:"story_lessons",title:"What have you done that your 18-year-old self would find unbelievable?",help:"Big wins count. Weird experiences count too."},
 ]),
 ...stage(2,"Your Superpowers","What do people keep using you for?",[
  {key:"power_asked",title:"Your friend calls you at 11 PM because they need help. What are they probably asking you about?",help:"Think about the problems people naturally trust you to solve."},
  {key:"power_easy",title:"What can you do in 20 minutes that takes other people 2 hours?",help:"Something that feels easy to you might actually be your unfair advantage."},
  {key:"power_results",title:"If you’re stuck with ________, call me.",help:"Finish the sentence in your own words.",placeholder:"If you’re stuck with…, call me."},
  {key:"power_teach",title:"What have you done enough times that you now have your own way of doing it?",help:"Could be hiring, storytelling, sales, investing, fitness, leadership, design, content, anything."},
 ]),
 ...stage(3,"Your Rabbit Holes","What can you absolutely not shut up about?",[
  {key:"rabbit_topics",title:"Open your imaginary YouTube history. What topics keep showing up?",help:"List the subjects you return to again and again."},
  {key:"rabbit_sources",title:"What topic could someone accidentally trap you into discussing for an hour?",help:"Finish this: “Don’t get me started on...”",placeholder:"Don’t get me started on…"},
  {key:"rabbit_learning",title:"What are you learning right now just because you’re curious?",help:"It does not have to be related to your work."},
  {key:"rabbit_energy",title:"What change happening in the world makes you think, “This is going to be huge”?",help:"Finish this: “I think people are underestimating...”",placeholder:"I think people are underestimating…"},
 ]),
 ...stage(4,"Your Hot Takes","Time to be slightly controversial.",[
  {key:"takes_advice",title:"What advice does everyone in your industry repeat that you secretly think is wrong?",help:"Finish this: “Everyone says you should..., but I think...”",placeholder:"Everyone says you should…, but I think…"},
  {key:"takes_belief",title:"What are people making way more complicated than it needs to be?",help:"Finish this: “People overcomplicate...”",placeholder:"People overcomplicate…"},
  {key:"takes_changed",title:"What do you believe now that you completely disagreed with 5 years ago?",help:"Finish this: “I used to think..., now I think...”",placeholder:"I used to think…, now I think…"},
  {key:"takes_future",title:"Put you in a room with 100 people from your industry. What opinion would start an argument?",help:"Finish this: “My potentially unpopular opinion is...”",placeholder:"My potentially unpopular opinion is…"},
 ]),
 ...stage(5,"Your People","Who are we trying to make obsessed with your content?",[
  {key:"people_who",title:"Picture one person who should absolutely follow you. Who are they?",help:"What do they do? What stage are they at?"},
  {key:"people_problem",title:"What are they Googling, asking ChatGPT, or complaining to their friends about?",help:"Use the real words they would type or say."},
  {key:"people_wants",title:"What do they want badly, but haven’t figured out yet?",help:"Finish this: “They really want to..., but...”",placeholder:"They really want to…, but…"},
  {key:"people_truth",title:"What do they think their problem is, and what do YOU think the real problem is?",help:"Separate the visible problem from the deeper one.",placeholder:"They think the problem is:\n\nBut I think the real problem is:"},
 ]),
 ...stage(6,"Your Content Personality","How do you sound when nobody is forcing you to create content?",[
  {key:"personality_style",title:"You have to explain your favourite idea to a friend. What do you naturally do?",help:"Choose any.",kind:"multi",choices:["Tell a story","Give examples","Teach step by step","Debate","Make jokes","Draw or visualise it","Send references","Go on a passionate rant","Something else"]},
  {key:"personality_formats",title:"Which type of content feels easiest for you to create?",help:"Choose any.",kind:"multi",choices:["Talking to camera","Writing","Teaching","Interviews","Podcast conversations","Presentations","Visual explainers","Behind-the-scenes","Commentary"]},
  {key:"personality_hate",title:"Which type of content makes you think, “Please never make me do this”?",help:"Tell us what you want the system to avoid."},
  {key:"personality_refs",title:"Name 3 creators, founders, writers, or people whose communication style you love.",help:"And tell us what you like about each.",placeholder:"1.\nWhy:\n\n2.\nWhy:\n\n3.\nWhy:"},
 ]),
 ...stage(7,"Your Proof","Okay, flex a little.",[
  {key:"proof_results",title:"What are 3 things you’ve done that you’re genuinely proud of?",help:"Big, small, professional or personal—they all count.",placeholder:"1.\n2.\n3."},
  {key:"proof_numbers",title:"What numbers, results, or outcomes can you point to?",help:"Could be revenue, audience, years of experience, customers, projects, people trained, growth, results, or transformations."},
  {key:"proof_people",title:"What kind of people, clients, or companies have trusted you to solve something important?",help:"Describe who trusted you and what was at stake."},
  {key:"proof_access",title:"What have you seen from the inside that most people only talk about from the outside?",help:"Finish this: “I’ve had a front-row seat to...”",placeholder:"I’ve had a front-row seat to…"},
 ]),
 ...stage(8,"Your Future Self","What are we building all this towards?",[
  {key:"future_known",title:"Three years from now, someone introduces you at an event. What do you want them to say?",help:"Finish this: “You should meet them. They’re the person who...”",placeholder:"You should meet them. They’re the person who…"},
  {key:"future_name",title:"What 3 things do you want your name to become associated with?",help:"Choose the ideas, categories or outcomes you want to own.",placeholder:"1.\n2.\n3."},
  {key:"future_opportunities",title:"What do you want content to bring into your life?",help:"Choose any.",kind:"multi",choices:["Customers","Speaking opportunities","Community","Career opportunities","Investors","Talent","Authority","Partnerships","Book opportunities","Audience","Collaborations","Something else"]},
  {key:"future_success",title:"If your content worked ridiculously well for the next 12 months, what would change?",help:"Finish this: “A year from now, I would love to see...”",placeholder:"A year from now, I would love to see…"},
 ]),
];
export const stageInsights:Record<number,{title:string;copy:string}>={
 1:{title:"Something is already forming.",copy:"We’ve found potential stories, turning points and lessons in your answers."},2:{title:"Expertise detected.",copy:"Your repeatable strengths are separating from everything you merely know about."},3:{title:"Your curiosity has a shape.",copy:"These rabbit holes can add energy without pretending to be expertise."},4:{title:"Your point of view is taking shape.",copy:"A strong creator does more than explain—they have something clear to believe."},5:{title:"We know who should care.",copy:"Your Universe can now connect what you know with what your people need."},6:{title:"Your natural expression is mapped.",copy:"We’ll recommend formats that fit you and avoid the ones you hate."},7:{title:"Proof separated from potential.",copy:"We can now distinguish what you have done from what you are exploring."},8:{title:"Your Content Universe is taking shape.",copy:"We’re now turning your Stories + Expertise + Interests + Opinions + Audience + Proof + Personality + Goals into your personal Content Universe."},
};
