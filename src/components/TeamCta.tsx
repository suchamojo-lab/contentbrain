import { TOPMATE_URL } from "./ResearchPaywall";

export function TeamCta() {
  return <section className="team-cta"><span>DON’T WANT TO MAKE IT YOURSELF?</span><h2>You’ve got the direction.<br />Our team can help turn it into the actual content.</h2><p>Strategy · Research · Scripts · Production · Distribution</p><a className="button button--paper" href={TOPMATE_URL} target="_blank" rel="noreferrer">Create this with the Everything Content team →</a></section>;
}
