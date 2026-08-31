export function BrainTransition() {
  return <div className="brain-transition" aria-hidden="true"><div className="transition-flash" /><div className="transition-copy">LET’S FIND OUT<br />WHAT MAKES YOU, YOU.</div>{Array.from({ length: 10 },(_,index) => <i key={index} />)}</div>;
}
