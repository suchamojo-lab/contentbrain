"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { GoogleGenAI } from "@google/genai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { GEMINI_MODEL } from "./ai/gemini";
import { yapTopic } from "./yapIdeaData";

const TIMEOUT_MS = 45_000;
const topicResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["topics"],
  properties: {
    topics: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["topic", "whyYou", "openingLine", "bestFormat", "source"],
        properties: {
          topic: { type: "string" },
          whyYou: { type: "string" },
          openingLine: { type: "string" },
          bestFormat: { type: "string" },
          source: { type: "string" },
        },
      },
    },
  },
} as const;
const developmentMode = v.union(v.literal("talkingPoints"), v.literal("hook"), v.literal("draft"), v.literal("think"), v.literal("angle"));

async function generateJson(prompt: string, maxOutputTokens = 5000, responseJsonSchema?: object) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini is not configured yet.");
  const client = new GoogleGenAI({ apiKey });
  const response = await Promise.race([
    client.models.generateContent({ model: GEMINI_MODEL, contents: prompt, config: { responseMimeType: "application/json", responseJsonSchema, temperature: 0.45, maxOutputTokens } }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Gemini timed out. Please try again.")), TIMEOUT_MS)),
  ]);
  try { return JSON.parse(response.text ?? "") as unknown; } catch { throw new Error("Gemini returned an incomplete result. Please try again."); }
}

export const generate = action({
  args: { universeJson: v.string() },
  returns: v.array(v.object({ id: v.id("yapTopics"), ...yapTopic.fields, saved: v.boolean(), createdAt: v.number() })),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You need to sign in first");
    if (args.universeJson.length > 150_000) throw new Error("Content Universe is too large");
    let universe: unknown;
    try { universe = JSON.parse(args.universeJson); } catch { throw new Error("Your saved Content Universe could not be read"); }
    const previous: string[] = await ctx.runQuery(internal.yapIdeaData.previousTopics, { userId });
    const prompt = `Create exactly 10 specific thoughts this person can talk about naturally and credibly right now.

RULES:
- A topic must be a complete, arguable thought, not a category label.
- Ground every topic in something they know, experienced, believe, or care about.
- Never invent stories, clients, credentials, results, beliefs, or private facts.
- The storyBank source strings and savedStories.story strings are the ONLY evidence of events that actually happened to this person.
- Character, gifts, radiance, territory, pillars, and ideaUniverse are AI-inferred identity outputs. They can inspire a thought, but never prove that an event, failure, client result, habit, or past behaviour happened.
- Never write a first-person opening that claims a personal event unless that event appears clearly in storyBank.source or savedStories.story.
- source must name the exact supplied signal that triggered the idea, in plain customer-facing language. Never label an inferred idea as “Lived Experience” or “Story”.
- Explore intersections and unused evidence. Do not repeat or lightly reword anything in PREVIOUS TOPICS.
- openingLine must sound ready to say aloud. whyYou must explain the personal fit in one sentence.
- bestFormat should be practical, such as Talking-head video, Written post, Carousel, or Newsletter.

PREVIOUS TOPICS:
${JSON.stringify(previous)}

CONTENT UNIVERSE AND SAVED STORIES:
${JSON.stringify(universe)}`;
    const raw = await generateJson(prompt, 5000, topicResponseSchema);
    const data = raw as { topics?: Array<Record<string, unknown>> };
    if (!Array.isArray(data.topics) || data.topics.length !== 10) throw new Error("Gemini did not return 10 Yap Topics. Please try again.");
    const topics = data.topics.map((item) => ({ topic: String(item.topic ?? "").trim(), whyYou: String(item.whyYou ?? "").trim(), openingLine: String(item.openingLine ?? "").trim(), bestFormat: String(item.bestFormat ?? "").trim(), source: String(item.source ?? "").trim() }));
    if (topics.some((item) => Object.values(item).some((value) => !value))) throw new Error("Gemini returned an incomplete Yap Topic. Please try again.");
    const batchId = crypto.randomUUID();
    const ids: Id<"yapTopics">[] = await ctx.runMutation(internal.yapIdeaData.saveBatch, { userId, batchId, topics });
    const createdAt = Date.now();
    return topics.map((topic, index) => ({ id: ids[index], ...topic, saved: false, createdAt }));
  },
});

export const develop = action({
  args: { mode: developmentMode, topic: yapTopic, universeJson: v.string(), answers: v.optional(v.array(v.string())) },
  returns: v.string(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You need to sign in first");
    const tasks = {
      talkingPoints: `Return {"coreThought":"","talkingPoints":[3-5 strings],"personalStory":"" or null,"example":"","endingThought":""}. Use a personal story only when it exists verbatim in the supplied context. Do not write a full script.`,
      hook: `Return {"hooks":[{"style":"Direct|Contrarian|Curiosity|Personal|Observation","line":""}]}. Return exactly five hooks, one per style.`,
      draft: `Return {"draft":"","format":""}. Follow the person's Expression profile: talking means conversational script, writing means written post, teaching means structured explainer.`,
      think: args.answers?.length ? `Use the person's answers to sharpen the topic. Return {"sharpenedThought":"","whatTheyReallyThink":"","nextMove":""}.` : `Return {"questions":[2-3 short, useful questions]}. Ask about their real opinion, lived example, and what people should do instead.`,
      angle: `Return {"topic":"","whyYou":"","openingLine":"","bestFormat":"","source":""}. Find a meaningfully different angle grounded in another supplied signal.`,
    } as const;
    const result = await generateJson(`You are helping a person develop one Yap Topic without replacing their thinking with generic content.
Never invent personal facts. Keep language natural, direct, and specific.

TASK:
${tasks[args.mode]}

TOPIC:
${JSON.stringify(args.topic)}

FOLLOW-UP ANSWERS:
${JSON.stringify(args.answers ?? [])}

CONTENT UNIVERSE:
${args.universeJson}`);
    return JSON.stringify(result);
  },
});
