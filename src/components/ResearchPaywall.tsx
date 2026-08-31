import {siteLinks} from "../config/siteLinks";
export const TOPMATE_URL = siteLinks.topmate;

export function ResearchPaywall({ onPreview }: { onPreview: () => void }) {
  return <section className="paywall"><div className="paywall-copy"><span className="editorial-kicker">FOUNDING BETA</span><h1>Stop guessing whether the idea will work.</h1><p>We’ll find relevant content around your idea and connect it with your Content Universe.</p><div className="price"><strong>₹999</strong><span>/ Content Direction</span></div><a className="button button--paper" href={TOPMATE_URL} target="_blank" rel="noreferrer">Unlock Content Research →</a><small>Payment opens securely on Topmate. This app does not show a fake payment success state.</small><button className="text-link" onClick={onPreview}>Preview the mock result shell →</button></div><div className="report-includes"><span>THE REPORT INCLUDES</span>{["Relevant content examples and source links","Hooks, formats and patterns","Similar creators and open opportunities","Three angles for your idea","One recommended content direction"].map((item,index) => <p key={item}><i>{String(index + 1).padStart(2,"0")}</i>{item}</p>)}</div></section>;
}
