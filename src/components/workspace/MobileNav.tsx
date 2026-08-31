import type {WorkspacePath} from "../../routing/routes";import {navigateTo} from "../../routing/routes";
const items:[WorkspacePath,string,string][]=[["/app","Home","⌂"],["/app/chat","Brain","✦"],["/app/universe","Universe","✣"],["/app/library","Library","▤"]];
export function MobileNav({current}:{current:WorkspacePath}){return <nav className="mobile-workspace-nav" aria-label="Mobile workspace">{items.map(([path,label,mark])=><button key={path} className={current===path?"is-active":""} onClick={()=>navigateTo(path)}><i>{mark}</i><span>{label}</span></button>)}</nav>}
