import { GoogleGenAI } from "@google/genai";
import type { AiProvider, BrainGenerationInput, BrainGenerationOutput,CreatorTypeOutput } from "./types";
import { AiRateLimitError } from "./types";

export const GEMINI_MODEL = "gemini-3.6-flash";
const REQUEST_TIMEOUT_MS = 45_000;
const strings = (minItems: number, maxItems: number) => ({ type: "array", minItems, maxItems, items: { type: "string" } }) as const;
const objectList = (minItems: number, maxItems: number, required: string[], properties: Record<string, unknown>) => ({ type: "array", minItems, maxItems, items: { type: "object", additionalProperties: false, required, properties } }) as const;
const universeSchema = {
  type: "object", additionalProperties: false,
  required: ["character", "gifts", "radiance", "expression", "territory", "contentPillars", "storyBank", "ideaUniverse"],
  properties: {
    character: { type: "object", additionalProperties: false, required: ["summary", "identitySignals", "characterTraits", "coreMotive"], properties: { summary: { type: "string" }, identitySignals: strings(4, 8), characterTraits: strings(3, 5), coreMotive: { type: "string" } } },
    gifts: { type: "object", additionalProperties: false, required: ["naturalStrengths", "superpower"], properties: { naturalStrengths: strings(3, 6), superpower: { type: "string" } } },
    radiance: { type: "object", additionalProperties: false, required: ["topics", "interestingIntersections"], properties: { topics: strings(3, 8), interestingIntersections: objectList(2, 4, ["title", "insight"], { title: { type: "string" }, insight: { type: "string" } }) } },
    expression: { type: "object", additionalProperties: false, required: ["profile", "bestFormats", "lessNaturalFormats"], properties: { profile: { type: "string" }, bestFormats: strings(2, 5), lessNaturalFormats: strings(1, 4) } },
    territory: { type: "object", additionalProperties: false, required: ["archetype", "positioning", "territories"], properties: { archetype: { type: "string" }, positioning: { type: "string" }, territories: objectList(3, 4, ["title", "description"], { title: { type: "string" }, description: { type: "string" } }) } },
    contentPillars: objectList(3, 4, ["title", "why", "topics"], { title: { type: "string" }, why: { type: "string" }, topics: strings(4, 7) }),
    storyBank: objectList(3, 8, ["title", "source", "lesson", "potentialHook"], { title: { type: "string" }, source: { type: "string" }, lesson: { type: "string" }, potentialHook: { type: "string" } }),
    ideaUniverse: objectList(3, 4, ["pillar", "ideas"], { pillar: { type: "string" }, ideas: strings(5, 8) }),
  },
} as const;
const creatorTypes=["THE IDEA TRANSLATOR","THE STORY-LED CREATOR","THE POINT-OF-VIEW CREATOR","THE CURIOUS EXPLORER","THE TEACHER","THE CONVERSATION CREATOR","THE SYSTEMS CREATOR","THE OPERATOR","THE CONNECTOR","THE TASTE-MAKER"] as const;
const creatorTypeSchema={type:"object",additionalProperties:false,required:["creatorType","whyYou","whyYouShouldCreate","createMore","watchOutFor","signatureStrength"],properties:{creatorType:{type:"string",enum:creatorTypes},whyYou:{type:"string"},whyYouShouldCreate:{type:"string"},createMore:strings(4,4),watchOutFor:{type:"string"},signatureStrength:{type:"string"}}} as const;

const nonEmpty = (value: unknown): value is string => typeof value === "string" && Boolean(value.trim());
function validate(value: unknown): BrainGenerationOutput {
  if (!value || typeof value !== "object") throw new Error("Gemini returned invalid JSON");
  const data = value as Record<string, unknown>;
  const requiredObjects = ["character", "gifts", "radiance", "expression", "territory"];
  if (requiredObjects.some((key) => !data[key] || typeof data[key] !== "object")) throw new Error("Gemini returned an incomplete Content Universe");
  const lists = ["contentPillars", "storyBank", "ideaUniverse"];
  if (lists.some((key) => !Array.isArray(data[key]) || !(data[key] as unknown[]).length)) throw new Error("Gemini returned an incomplete Content Universe");
  const stories = data.storyBank as Array<Record<string, unknown>>;
  if (stories.some((story) => !nonEmpty(story.source) || !nonEmpty(story.lesson) || !nonEmpty(story.potentialHook))) throw new Error("Gemini returned an ungrounded story");
  return data as unknown as BrainGenerationOutput;
}

export function createGeminiProvider(): AiProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini is not configured yet. Add GEMINI_API_KEY to Convex and try again.");
  const client = new GoogleGenAI({ apiKey });
  return { async generateContentUniverse(input) {
    const prompt = `Build Content Universe V1 from four messy human answers. Find patterns and useful intersections; do not merely summarize.

HONESTY RULES — these override style:
- USER-STATED facts may appear only when directly supported by the answers below.
- AI-INFERRED conclusions must stay cautious and grounded. Never invent achievements, employers, clients, credentials, revenue, audience size, dates, numbers, life events, expertise, or proof.
- Every storyBank.source must be a short faithful phrase from the person's CHARACTER answer. If there are fewer than 3 distinct real events, use different truthful angles on the supplied material; never create an event.
- lessNaturalFormats must be framed as recommendations based on selected formats, never as facts about dislikes unless stated.
- Make the result specific, plain, editorial, and useful. Avoid inflated labels such as world-class, visionary, guru, or expert.

CHARACTER — messy story:
${input.character}

OWN GIFTS — what people come to them for:
${input.naturalAuthority}

RADIANCE — what gives them energy:
${input.obsessions}

EXPRESSION — chosen natural formats:
${input.expressionFormats.join(", ")}

EXPRESSION NOTES:
${input.expressionNotes || "No additional notes supplied."}`;
    try {
      const response = await Promise.race([
        client.models.generateContent({ model: GEMINI_MODEL, contents: prompt, config: { systemInstruction: "Return strict JSON matching the schema. Treat source text as evidence and strategic language as inference.", responseMimeType: "application/json", responseJsonSchema: universeSchema, maxOutputTokens: 6500, temperature: 0.25 } }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Gemini timed out. Please try again.")), REQUEST_TIMEOUT_MS)),
      ]);
      return validate(JSON.parse(response.text ?? ""));
    } catch (error) {
      const status = (error as { status?: number; code?: number }).status ?? (error as { code?: number }).code;
      const message = error instanceof Error ? error.message : "";
      if (status === 429 || status === 503 || /rate.?limit|quota|resource exhausted|high demand/i.test(message)) throw new AiRateLimitError();
      if (error instanceof SyntaxError) throw new Error("Gemini returned invalid JSON. Please try again.");
      throw error;
    }
  },async generateCreatorType(context){const prompt=`Classify this person into exactly ONE fixed content creator type using the complete saved Content Universe below.

Allowed types only:\n${creatorTypes.join("\n")}

Use evidence across character, gifts, radiance, expression, opinions, stories, expertise, proof and content pillars. Do not classify from one phrase. Do not invent personal facts. Keep whyYou under 30 words, whyYouShouldCreate under 24 words, watchOutFor under 16 words, signatureStrength under 10 words, and each createMore item under 5 words. Be specific without excessive flattery.\n\nCONTENT UNIVERSE:\n${context}`;try{const response=await Promise.race([client.models.generateContent({model:GEMINI_MODEL,contents:prompt,config:{systemInstruction:"Return strict JSON matching the schema. The creatorType must be one of the supplied enum values.",responseMimeType:"application/json",responseJsonSchema:creatorTypeSchema,maxOutputTokens:900,temperature:.15}}),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error("Gemini timed out. Please try again.")),REQUEST_TIMEOUT_MS))]);const value=JSON.parse(response.text??"") as CreatorTypeOutput;if(!creatorTypes.includes(value.creatorType as typeof creatorTypes[number])||!Array.isArray(value.createMore)||value.createMore.length!==4)throw new Error("Gemini returned an invalid creator type");return value}catch(error){const status=(error as {status?:number;code?:number}).status??(error as {code?:number}).code;const message=error instanceof Error?error.message:"";if(status===429||status===503||/rate.?limit|quota|resource exhausted|high demand/i.test(message))throw new AiRateLimitError();throw error}}
  };
}
