export interface BrainGenerationInput {
  character: string;
  naturalAuthority: string;
  obsessions: string;
  expressionFormats: string[];
  expressionNotes: string;
}

export interface BrainGenerationOutput {
  character: { summary: string; identitySignals: string[]; characterTraits: string[]; coreMotive: string };
  gifts: { naturalStrengths: string[]; superpower: string };
  radiance: { topics: string[]; interestingIntersections: Array<{ title: string; insight: string }> };
  expression: { profile: string; bestFormats: string[]; lessNaturalFormats: string[] };
  territory: { archetype: string; positioning: string; territories: Array<{ title: string; description: string }> };
  contentPillars: Array<{ title: string; why: string; topics: string[] }>;
  storyBank: Array<{ title: string; source: string; lesson: string; potentialHook: string }>;
  ideaUniverse: Array<{ pillar: string; ideas: string[] }>;
}
export interface CreatorTypeOutput {creatorType:string;whyYou:string;whyYouShouldCreate:string;createMore:string[];watchOutFor:string;signatureStrength:string}

export interface AiProvider { generateContentUniverse(input: BrainGenerationInput): Promise<BrainGenerationOutput>;generateCreatorType(context:string):Promise<CreatorTypeOutput> }
export class AiRateLimitError extends Error { constructor() { super("Gemini's free limit is busy right now. Your answers are safe—please try again in a few minutes."); this.name = "AiRateLimitError"; } }
