import { generateUniverse } from "../../src/lib/recommendation";
import type { BrainGenerationInput, BrainGenerationOutput } from "./types";

export const FALLBACK_MODEL = "grounded-local-v1";

export function generateFallbackUniverse(
  input: BrainGenerationInput,
): BrainGenerationOutput {
  const universe = generateUniverse({
    character: input.character,
    gifts: input.naturalAuthority,
    obsessions: input.obsessions,
    expressionFormats: input.expressionFormats.join(" | "),
    expressionNotes: input.expressionNotes,
  });
  return {
    character: universe.character,
    gifts: universe.gifts,
    radiance: universe.radiance,
    expression: universe.expression,
    territory: universe.territory,
    contentPillars: universe.contentPillars,
    storyBank: universe.storyBank,
    ideaUniverse: universe.ideaUniverse,
  };
}
