export function StoryMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`story-mark ${compact ? "story-mark--compact" : ""}`} aria-hidden="true">
      <span className="story-mark__face">:)</span>
      <span className="story-mark__spark">✦</span>
    </span>
  );
}
