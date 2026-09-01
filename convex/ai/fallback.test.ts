import { describe, expect, it } from "vitest";
import { generateFallbackUniverse } from "./fallback";

describe("generateFallbackUniverse", () => {
  it("builds a complete, grounded Universe without an API key", () => {
    const result = generateFallbackUniverse({
      character: "I left agency work to build a calmer creative practice.",
      naturalAuthority: "People ask me to simplify content strategy.",
      obsessions: "creative systems, storytelling, and useful AI",
      expressionFormats: ["Writing", "Talking to camera"],
      expressionNotes: "I like clear explanations with real examples.",
    });

    expect(result.character.summary).toContain("left agency work");
    expect(result.contentPillars.length).toBeGreaterThanOrEqual(3);
    expect(result.storyBank.length).toBeGreaterThan(0);
    expect(result.ideaUniverse.every((group) => group.ideas.length > 0)).toBe(
      true,
    );
  });
});
