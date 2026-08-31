export interface ArticleSection { heading:string; paragraphs:string[]; bullets?:string[] }
export interface Article { slug:string; title:string; summary:string; category:string; keyword:string; published:string; readingTime:string; sections:ArticleSection[] }

export const articles:Article[]=[
 {slug:"what-is-a-content-brain",title:"What Is a Content Brain?",summary:"A persistent system that remembers what makes your work yours—and helps you create from it.",category:"CONTENT SYSTEMS",keyword:"content brain",published:"August 31, 2026",readingTime:"6 min read",sections:[
  {heading:"What a Content Brain is",paragraphs:["A Content Brain connects your stories, expertise, opinions, ideas, references and research. It is not another place to store information. Its job is to help you use that information when you create."]},
  {heading:"Why blank AI chats are limiting",paragraphs:["A blank chat knows the prompt in front of it, but not the years behind you. You repeat your background, preferred voice and audience—or accept an answer that could belong to anyone."]},
  {heading:"Content Brain vs second brain",paragraphs:["A traditional second brain helps you collect and retrieve knowledge. A Content Brain adds creative context: what you want to be known for, the stories you can credibly tell and the formats that feel natural."]},
  {heading:"What goes inside",paragraphs:["Start with identity, then add useful material over time."],bullets:["Character and turning points","Expertise and questions people ask you","Beliefs, interests and observations","Stories, references and saved research","Ideas, drafts and finished work"]},
  {heading:"How it improves creation",paragraphs:["When context is connected, one rough thought can become a relevant angle, a story, a hook and a format without erasing your point of view."]},
  {heading:"How to start",paragraphs:["Build your Content Universe first. Four answers give the system enough context to find an initial direction. Add detail only when it becomes useful."]},
 ]},
 {slug:"personal-brand-without-feeling-fake",title:"How to Build a Personal Brand Without Feeling Fake",summary:"Start with identity and experience—not a performance copied from the internet.",category:"PERSONAL BRANDING",keyword:"how to build a personal brand",published:"August 31, 2026",readingTime:"7 min read",sections:[
  {heading:"Why personal branding feels performative",paragraphs:["It feels fake when the visible output comes before the person behind it. Borrowed hooks, borrowed opinions and borrowed confidence create a character you have to keep performing."]},
  {heading:"Start with what you already know",paragraphs:["List the problems people trust you to solve, the work you have done and the subjects you return to without being asked. That is stronger raw material than a list of trending topics."]},
  {heading:"Find your stories",paragraphs:["Look for transitions, difficult decisions, mistakes, unlikely lessons and moments when your view changed. A story does not need to be dramatic. It needs to be true and connected to an idea."]},
  {heading:"Find your point of view",paragraphs:["Ask what you believe that your field gets wrong, what advice you repeat and what trade-offs you refuse to hide. A useful point of view is specific enough to guide a decision."]},
  {heading:"Choose sustainable formats",paragraphs:["Use the way you already explain things well: conversation, writing, teaching, demonstration or analysis. Consistency becomes easier when the format fits you."]},
  {heading:"Create your Content Universe",paragraphs:["Connect character, gifts, interests and expression before choosing pillars. Your personal brand then becomes a clear body of work, not a costume."]},
 ]},
 {slug:"what-is-a-content-universe",title:"What Is a Content Universe?",summary:"A map of the experiences, strengths and ideas your content can grow from.",category:"CONTENT UNIVERSE",keyword:"content universe",published:"August 31, 2026",readingTime:"6 min read",sections:[
  {heading:"The four starting signals",paragraphs:["Character explains what shaped you. Own Gifts show what people trust you with. Radiance captures what gives you energy. Expression shows how you communicate naturally."]},
  {heading:"The deeper layers",paragraphs:["Stories add lived evidence. Expertise adds useful depth. Point of view makes the work distinct. Audience gives it relevance. Proof keeps claims honest. References teach the system your taste."]},
  {heading:"What the map produces",paragraphs:["The connected picture can reveal positioning, content pillars, a story bank, useful intersections, natural formats and initial idea directions."]},
  {heading:"It is not a fixed identity",paragraphs:["A Content Universe is a working map, not a label you must keep forever. It should change as your work, interests and audience change."]},
 ]},
 {slug:"never-run-out-of-content-ideas",title:"How to Never Run Out of Content Ideas",summary:"Stop asking for endless topics. Build better connections between what you know and what people need.",category:"CONTENT SYSTEMS",keyword:"content ideas",published:"August 31, 2026",readingTime:"5 min read",sections:[
  {heading:"The idea-generator trap",paragraphs:["A long list creates the feeling of abundance, but most entries have no relationship to your experience or audience. They are easy to generate and easy to ignore."]},
  {heading:"Use five sources",paragraphs:["Strong ideas usually connect at least two real sources."],bullets:["Your expertise","Your experiences","Audience questions","Daily observations","Current conversations"]},
  {heading:"Build connections, not lists",paragraphs:["Pair an audience problem with a lesson you learned. Connect a current change to a belief you hold. Use a saved reference to challenge an old assumption."]},
  {heading:"Use a Content Brain",paragraphs:["A Content Brain remembers these sources and brings the relevant ones back when you start with a rough thought."]},
 ]},
 {slug:"turn-expertise-into-content",title:"How to Turn Your Expertise Into Content",summary:"Turn questions, lessons, mistakes and proof into material people can understand and use.",category:"STORYTELLING",keyword:"turn expertise into content",published:"August 31, 2026",readingTime:"6 min read",sections:[
  {heading:"Start with questions",paragraphs:["Write down the questions clients, colleagues and friends repeatedly ask. Repetition is evidence that something familiar to you is valuable to someone else."]},
  {heading:"Separate lessons from claims",paragraphs:["A claim says what works. A lesson shows how you learned it. Include the decision, constraint, mistake or result that made the idea credible."]},
  {heading:"Create reusable source material",paragraphs:["Build small banks of frameworks, stories, opinions and proof. One source can support many posts without repeating the same wording."]},
  {heading:"Choose useful pillars",paragraphs:["A pillar should connect what you know, what your audience needs and what you want to become known for. If one side is missing, the pillar will be difficult to sustain."]},
 ]},
 {slug:"ai-personal-brand-without-sounding-like-ai",title:"How AI Can Help You Build a Personal Brand Without Sounding Like AI",summary:"Use AI to remember and connect your context—not replace your personality.",category:"AI + CONTENT",keyword:"AI personal branding",published:"August 31, 2026",readingTime:"7 min read",sections:[
  {heading:"Why AI content sounds generic",paragraphs:["The model often receives a topic and a format, but no lived context. It fills the gap with familiar patterns, broad claims and a voice averaged from the internet."]},
  {heading:"Give it context",paragraphs:["Useful context includes your experiences, expertise, beliefs, audience, natural expression and references. Facts should remain facts; strategic conclusions should be clearly treated as inferences."]},
  {heading:"Use stories and references differently",paragraphs:["Stories provide truth. References provide taste. AI can help connect them, but it should never invent an event or copy someone else's work."]},
  {heading:"Keep the human edit",paragraphs:["Review every factual claim, remove language you would never say and add the detail only you would know. AI can shape the material. You remain responsible for the published work."]},
 ]},
 {slug:"second-brain-for-content-creators",title:"The Second Brain for Content Creators",summary:"The difference between storing useful things and creating with them.",category:"CONTENT SYSTEMS",keyword:"second brain for content creators",published:"August 31, 2026",readingTime:"6 min read",sections:[
  {heading:"Notes apps store",paragraphs:["Notes apps are excellent archives, but the structure usually depends on you remembering what to search for and how two distant notes connect."]},
  {heading:"Bookmarks collect",paragraphs:["Bookmarks capture taste and curiosity. Without a retrieval habit, they become a graveyard of things you once intended to use."]},
  {heading:"Blank chats generate",paragraphs:["Chat tools can produce quickly, but a new conversation rarely carries your complete creative context."]},
  {heading:"A Content Brain connects",paragraphs:["A Content Brain combines identity, memory and creation. It can bring a relevant story or reference into today's idea because both live in the same system."]},
 ]},
 {slug:"content-system-for-founders",title:"A Simple Content System for Founders",summary:"A practical way to turn operating experience into a steady body of useful work.",category:"PERSONAL BRANDING",keyword:"content system for founders",published:"August 31, 2026",readingTime:"7 min read",sections:[
  {heading:"1. Positioning",paragraphs:["Choose the problem, audience and perspective you want your work to connect. Keep it broad enough to grow and specific enough to guide a decision."]},
  {heading:"2. Pillars",paragraphs:["Use three core pillars and one human pillar. Each should connect business relevance with material you can credibly sustain."]},
  {heading:"3. Story and idea banks",paragraphs:["Capture decisions, customer questions, mistakes, team moments and changed opinions while they are fresh."]},
  {heading:"4. Research",paragraphs:["Track the questions and conversations around your market. Research should sharpen your contribution, not tell you whom to copy."]},
  {heading:"5. A weekly rhythm",paragraphs:["Choose one thinking block, one creation block and one review block. A small repeatable system beats daily pressure to invent something new."]},
 ]},
];

export const articleBySlug=(slug:string)=>articles.find(article=>article.slug===slug);

