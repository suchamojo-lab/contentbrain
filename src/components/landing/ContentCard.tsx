export interface StreamCard { type: string; title: string; detail: string; }

export function ContentCard({ card, index }: { card: StreamCard; index: number }) {
  return <article className={`stream-card stream-card--${index % 5}`}><span>{card.type}</span><div className="stream-thumbnail"><i /><i /><i /></div><h3>{card.title}</h3><p>{card.detail}</p></article>;
}
