import type { CompassKey } from "../lib/recommendation";

const points: Array<{ key: CompassKey; label: string; x: number; y: number }> = [
  { key: "character", label: "Character", x: 100, y: 16 },
  { key: "gifts", label: "Own gifts", x: 184, y: 100 },
  { key: "obsessions", label: "Obsessions", x: 100, y: 184 },
  { key: "expression", label: "Expression", x: 16, y: 100 },
];

interface CompassMarkProps {
  active?: CompassKey;
  completed?: CompassKey[];
  compact?: boolean;
}

export function CompassMark({ active, completed = [], compact = false }: CompassMarkProps) {
  return (
    <div className={`compass-mark ${compact ? "compass-mark--compact" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" role="img">
        <circle className="compass-ring" cx="100" cy="100" r="68" />
        <path className="compass-axis" d="M100 32V168M32 100H168" />
        <path className="compass-needle" d="M100 47L113 100L100 153L87 100Z" />
        <circle className="compass-center" cx="100" cy="100" r="6" />
        {points.map((point) => (
          <g key={point.key} className={active === point.key ? "is-active" : completed.includes(point.key) ? "is-complete" : ""}>
            <circle className="compass-point" cx={point.x} cy={point.y} r="7" />
          </g>
        ))}
      </svg>
      {compact ? null : points.map((point) => (
        <span key={point.key} className={`compass-label compass-label--${point.key}`}>{point.label}</span>
      ))}
    </div>
  );
}
