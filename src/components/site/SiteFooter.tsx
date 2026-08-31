import {siteLinks} from "../../config/siteLinks";
import {navigateTo} from "../../routing/routes";

const columns=[
 ["PRODUCT",[["Content Universe","/guides/content-universe"],["Workspace","/login"],["Features","/#feed"],["Early access","/#access"]]],
 ["LEARN",[["Resources","/resources"],["Blog","/blog"],["Content Universe guide","/guides/content-universe"],["Personal branding guide","/guides/personal-branding"]]],
 ["LEGAL",[["Privacy","/privacy"],["Terms","/terms"],["Contact","/contact"]]],
] as const;

export function SiteFooter(){return <footer className="site-footer"><div className="site-footer__inner"><div className="site-footer__spread"><div className="site-footer__brand"><button onClick={()=>navigateTo("/")}>EVERYTHING CONTENT</button><p>Build a body of work only you could make.</p><i className="site-footer__fragment" aria-hidden="true"/></div><div className="site-footer__links">{columns.slice(0,2).map(([title,links])=><FooterColumn key={title} title={title} links={links}/>) }<div className="site-footer__column"><small>CONNECT</small><a href={siteLinks.community} target="_blank" rel="noopener noreferrer">Community ↗</a><a href={siteLinks.topmate} target="_blank" rel="noopener noreferrer">Work with me ↗</a><a href={siteLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={siteLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div><FooterColumn title={columns[2][0]} links={columns[2][1]}/></div></div><p className="site-footer__bottom"><span>© 2026 Everything Content</span><span>Built by Suchamojo</span></p></div></footer>}
function FooterColumn({title,links}:{title:string;links:readonly (readonly [string,string])[]}){return <div className="site-footer__column"><small>{title}</small>{links.map(([label,path])=><button key={path} onClick={()=>navigateTo(path)}>{label}</button>)}</div>}
