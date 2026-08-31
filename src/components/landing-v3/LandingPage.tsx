import {useState} from "react";

const folders=[
 {name:"Your story",copy:"The experiences that shaped how you see the world.",question:"What changed the direction of your life?",output:"A story worth telling"},
 {name:"Your strengths",copy:"What people trust you to understand or solve.",question:"What do people call you for help with?",output:"An earned expertise area"},
 {name:"Your rabbit holes",copy:"The subjects you follow without being asked.",question:"What can you discuss for an hour?",output:"A curiosity thread"},
 {name:"Your convictions",copy:"What you believe, challenge or refuse to accept.",question:"What common advice do you disagree with?",output:"An original point of view"},
 {name:"Your people",copy:"Who you understand and want to help.",question:"Who should absolutely follow you?",output:"A clear audience need"},
 {name:"Your voice",copy:"How you naturally explain, teach and persuade.",question:"How do you explain ideas to a friend?",output:"A natural format"},
 {name:"Your proof",copy:"Results, failures and lessons that make you credible.",question:"What have you done repeatedly?",output:"A credible teaching angle"},
 {name:"Your direction",copy:"What you are becoming and want to be known for.",question:"What should your name mean in three years?",output:"A content mission"},
];
const inputs=["I left engineering to teach AI.","Spirituality improved how I work.","People ask me to simplify difficult technology.","Most productivity advice ignores the person using it."];
const outputs=[
 {type:"CORE THEME",title:"Practical AI for thoughtful professionals",source:"STRENGTHS + DIRECTION"},
 {type:"POINT OF VIEW",title:"Better systems beat working harder",source:"CONVICTIONS + PROOF"},
 {type:"STORY IDEA",title:"What leaving engineering taught me about learning",source:"STORY + STRENGTHS"},
 {type:"VIDEO IDEA",title:"Can ancient wisdom make you better at using AI?",source:"RABBIT HOLES + VOICE"},
];

export function LandingPage({onStart}:{onStart:()=>void}) {
 const [active,setActive]=useState(0);
 return <main className="product-landing">
  <nav className="product-nav"><a href="#top">SUCHAMOJO</a><div><a href="#method">HOW IT WORKS</a><a href="#demo">WHAT YOU GET</a></div><button onClick={onStart}>BUILD MY CONTENT BRAIN ↵</button></nav>
  <section className="product-hero" id="top"><img src="/suchamojo-content-world-v1.png" alt="A retro computer in a bright open field"/><div className="product-hero__veil"/><div className="product-hero__copy"><span>YOUR EXPERIENCES ARE THE RAW MATERIAL</span><h1>Turn everything<br/>you know into<br/><em>things worth creating.</em></h1><p>Your stories, expertise, opinions, questions and obsessions already contain hundreds of useful ideas. Suchamojo helps you find them, connect them and turn them into a content system that sounds like you.</p><div><button onClick={onStart}>BUILD MY CONTENT BRAIN <b>↵</b></button><a href="#method">SEE HOW IT WORKS ↓</a></div><small>TAKES ABOUT 10 MINUTES · START MESSY—WE’LL HELP YOU MAKE SENSE OF IT.</small></div></section>
  <section className="scatter-proof" id="method"><header><span>YOUR IDEAS AREN’T MISSING. THEY’RE SCATTERED.</span><h2>It’s all in there.<br/><em>Just not connected yet.</em></h2><p>A lesson buried in an old project. A story you keep telling friends. A strong opinion sitting in your notes. We bring the fragments together so you can see what only you can create.</p></header><div className="scatter-system" aria-label="Scattered material becoming a connected system"><span>A CAREER MISTAKE</span><span>A SAVED POST</span><span>AN UNUSUAL BELIEF</span><span>A CUSTOMER QUESTION</span><span>AN OBSESSION</span><strong>YOUR<br/>CONTENT<br/>BRAIN</strong><i/><i/><i/><i/><i/></div></section>
  <section className="folder-method"><header><span>EIGHT PARTS. ONE CONNECTED BRAIN.</span><h2>Map the material<br/><em>that makes you, you.</em></h2><p>Select a folder to see what you give us—and what you get back.</p></header><div className="folder-product"><div className="folder-product__rail" role="tablist" aria-label="Content brain folders">{folders.map((folder,index)=><button role="tab" aria-selected={active===index} className={active===index?"is-active":""} key={folder.name} onClick={()=>setActive(index)}><i>{String(index+1).padStart(2,"0")}</i><span><strong>{folder.name}</strong><small>{folder.copy}</small></span></button>)}</div><article className="folder-product__detail"><span>FOLDER {String(active+1).padStart(2,"0")}</span><h3>{folders[active].name}</h3><div><small>EXAMPLE QUESTION</small><p>“{folders[active].question}”</p></div><b>CONNECTS INTO</b><strong>{folders[active].output} →</strong><button onClick={onStart}>OPEN THIS FOLDER ↵</button></article></div></section>
  <section className="brain-demo" id="demo"><header><span>FROM RAW MATERIAL TO USEFUL IDEAS</span><h2>See what your brain<br/><em>can build.</em></h2><p>This example uses four answers from a fictional creator. Every output shows where it came from.</p></header><div className="brain-demo__grid"><div><b>WHAT HRISHIKESH TOLD US</b>{inputs.map((input,index)=><article key={input}><i>{String(index+1).padStart(2,"0")}</i><p>{input}</p></article>)}</div><div className="brain-demo__core" aria-hidden="true"><span>4 ANSWERS</span><strong>FINDING<br/>CONNECTIONS</strong><i>→</i></div><div><b>WHAT HIS BRAIN BUILT</b>{outputs.map((output)=><article key={output.title}><small>{output.type}</small><p>{output.title}</p><em>FROM: {output.source}</em></article>)}</div></div></section>
  <section className="product-trust"><div><span>YOU STAY IN CONTROL</span><h2>Your material.<br/>Your voice.</h2></div><ul><li><strong>Saved as you go</strong><span>Your progress stays on this device before you create an account.</span></li><li><strong>Editable</strong><span>Change your answers and rebuild your result.</span></li><li><strong>Exportable</strong><span>Copy or download your finished Content Brain.</span></li><li><strong>Built from you</strong><span>We find connections in your material. We do not replace your thinking.</span></li></ul></section>
  <section className="product-final"><span>YOUR NEXT IDEA IS ALREADY IN THERE.</span><h2>Stop asking,<br/><em>“What should I post?”</em></h2><p>Build a system that begins with what you already know—and becomes more useful every time you return.</p><button onClick={onStart}>BUILD MY CONTENT BRAIN <b>↵</b></button><small>ABOUT 10 MINUTES · SAVE, EDIT AND EXPORT YOUR RESULT</small></section>
  <button className="product-floating" onClick={onStart}>BUILD MY CONTENT BRAIN ↵</button>
 </main>;
}
