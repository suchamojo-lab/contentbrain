import type { CompassKey } from "../lib/recommendation";

export const compassSteps: Array<{ key: CompassKey; short: string }> = [
  { key: "character", short: "Character" },
  { key: "gifts", short: "Own gifts" },
  { key: "obsessions", short: "Obsessions" },
  { key: "expression", short: "Expression" },
];

export function ProgressRail({ step }: { step: number }) {
  return (
    <nav className="progress-rail" aria-label="Content Universe progress">
      <span className="progress-kicker">Your IP Compass</span>
      <ol>
        {compassSteps.map((item, index) => (
          <li key={item.key} className={index === step ? "is-current" : index < step ? "is-complete" : ""}>
            <span className="progress-number">{index < step ? "✓" : index + 1}</span>
            <span>{item.short}</span>
          </li>
        ))}
      </ol>
      <p>{step + 1} of 4</p>
    </nav>
  );
}
