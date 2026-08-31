import {EditorialMark} from "../EditorialMark";
import {siteLinks} from "../../config/siteLinks";
import {navigateTo} from "../../routing/routes";

export type SiteSession={authenticated:boolean;name?:string;hasUniverse:boolean;onSignOut?:()=>void;onStartOver?:()=>void};
export type SiteHeaderMode="full"|"auth"|"onboarding";

const go=(path:string)=>()=>navigateTo(path);

export function SiteHeader({session,mode="full",theme="light"}:{session:SiteSession;mode?:SiteHeaderMode;theme?:"light"|"dark"}){
 const universePath=session.authenticated?(session.hasUniverse?"/app/universe":"/universe/start"):"/signup";
 const workspacePath=session.authenticated?"/app":"/login";
 const ctaLabel=session.authenticated?(session.hasUniverse?"Open workspace":"Finish my Universe"):"Build your brain";
 const ctaPath=session.authenticated?(session.hasUniverse?"/app":"/universe/start"):"/signup";
 return <header className={`site-header site-header--${theme}`}>
  <div className="site-header__inner">
   <button className="site-wordmark" onClick={go("/")} aria-label="Everything Content home"><EditorialMark/><span>Everything<br/>Content</span></button>
   {mode==="auth"?<button className="site-header__back" onClick={go("/")}>Back to site</button>:mode==="onboarding"?<div className="site-header__quiet">{session.authenticated?<button onClick={go("/app")}>Save &amp; exit</button>:<button onClick={go("/login")}>Sign in</button>}</div>:<>
    <nav className="site-header__nav" aria-label="Main navigation">
     <button onClick={go(universePath)}>Content Universe</button>
     {!session.authenticated||session.hasUniverse?<button onClick={go(workspacePath)}>Workspace</button>:null}
     <button onClick={()=>{if(location.pathname==="/")document.querySelector("#feed")?.scrollIntoView({behavior:"smooth"});else navigateTo("/#feed")}}>Features</button>
     <a href={siteLinks.community} target="_blank" rel="noopener noreferrer">Community</a>
    </nav>
    <div className="site-header__actions">
     {session.authenticated?<details className="site-account"><summary>{session.name||"Account"}</summary><div><button onClick={go("/app/settings")}>Settings</button>{session.onStartOver?<button onClick={session.onStartOver}>Start over</button>:null}{session.onSignOut?<button onClick={session.onSignOut}>Sign out</button>:null}</div></details>:<button className="site-sign-in" onClick={go("/login")}>Sign in</button>}
     <button className="site-header__cta" onClick={go(ctaPath)}>{ctaLabel}</button>
    </div>
    <details className="site-mobile-menu"><summary aria-label="Open navigation">Menu</summary><div><button onClick={go(universePath)}>Content Universe</button>{!session.authenticated||session.hasUniverse?<button onClick={go(workspacePath)}>Workspace</button>:null}<button onClick={go("/#feed")}>Features</button><a href={siteLinks.community} target="_blank" rel="noopener noreferrer">Community</a><button onClick={go("/resources")}>Resources</button><button onClick={go("/blog")}>Blog</button>{!session.authenticated?<button onClick={go("/login")}>Sign in</button>:null}<button className="site-header__cta" onClick={go(ctaPath)}>{ctaLabel}</button></div></details>
   </>}
  </div>
 </header>
}
