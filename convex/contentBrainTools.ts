"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { GoogleGenAI } from "@google/genai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { brainTool } from "./contentBrainToolData";
import { GEMINI_MODEL } from "./ai/gemini";

const REQUEST_TIMEOUT_MS = 45_000;

const instructions: Record<string, string> = {
  idea: `Return {"ideas":[5 items]}. Each item: {"title":"","angle":"","whyThisFitsYou":"","hook":"","recommendedFormat":""}. Make all five meaningfully different.`,
  stronger: `Return {"originalThought":"","strongestAngle":"","whyThisFitsYou":"","directions":{"contrarian":"","storyLed":"","educational":""},"hooks":[3 strings],"bestFormat":""}.`,
  hook: `Return {"hooks":[{"type":"CLEANER|CURIOSITY|CONTRARIAN|STORY-LED","hook":"","whyItWorks":""}]}. Return exactly one of each type. Avoid clickbait.`,
  story: `Return {"stories":[up to 3 items]}. Each item: {"story":"","whyItConnects":"","lesson":"","potentialHook":""}. Use ONLY events or experiences stated in the supplied Universe storyBank sources or character. If none are relevant, return {"stories":[],"needsMoreContext":true}. Never invent a personal story.`,
  plan: `Return {"posts":[exactly 5 items]}. Each item: {"slot":"DAY 1" through "DAY 5","contentType":"","idea":"","hook":"","whyItFits":"","format":""}. Vary the pillar and content type where the Universe supports it.`,
  script: `Return {"whatsWorking":[strings],"whatsWeak":[strings],"strongerHook":"","structureChanges":[strings],"improvedScript":""}. Preserve the person's point of view and natural voice.`,
  ask: `Answer the request using the person's Universe. Return {"answer":"","whyThisFitsYou":"","nextSteps":[up to 3 strings]}. Be useful and direct.`,
};

function resultTitle(tool: string, input: string, parsed: Record<string, unknown>) {
  if (tool === "idea") return "5 ideas from your brain";
  if (tool === "plan") return "Your next 5 posts";
  if (tool === "story") return "Stories from your brain";
  if (tool === "hook") return "Stronger hooks";
  if (tool === "script") return "Your improved script";
  if (tool === "stronger") return String(parsed.strongestAngle || "A stronger angle").slice(0, 100);
  return input.slice(0, 100) || "Content Brain answer";
}

export const run = action({
  args: { tool: brainTool, input: v.string(), universeJson: v.string() },
  returns: v.object({ id: v.id("brainGenerations"), title: v.string(), resultJson: v.string() }),
  handler: async (ctx, args): Promise<{ id: Id<"brainGenerations">; title: string; resultJson: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You need to sign in first");
    const input = args.input.trim();
    if (!input && !["idea", "story", "plan"].includes(args.tool)) throw new Error("Add a thought first");
    if (args.universeJson.length > 150_000) throw new Error("Content Universe is too large");
    let universe: unknown;
    try { universe = JSON.parse(args.universeJson); } catch { throw new Error("Your saved Content Universe could not be read"); }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini is not configured yet. Add GEMINI_API_KEY to Convex and try again.");
    const prompt = `You are the user's personal Content Brain. Use the complete saved Content Universe below as context. Do not ask them to repeat their background.

GROUNDING RULES:
- Treat the Universe as the only source of personal facts.
- Never invent achievements, clients, numbers, events, credentials, opinions, or stories.
- Strategic suggestions may be inferred, but explain why they fit using supplied context.
- Keep the user's natural expression style. Avoid generic AI language and inflated claims.

TOOL TASK:
${instructions[args.tool]}

USER INPUT:
${input || "Use the saved Content Universe to complete this task."}

COMPLETE SAVED CONTENT UNIVERSE:
${JSON.stringify(universe)}`;
    const client = new GoogleGenAI({ apiKey });
    const response = await Promise.race([
      client.models.generateContent({ model: GEMINI_MODEL, contents: prompt, config: { responseMimeType: "application/json", temperature: 0.35, maxOutputTokens: args.tool === "script" ? 5000 : 3200 } }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Gemini timed out. Please try again.")), REQUEST_TIMEOUT_MS)),
    ]);
    const resultJson = response.text ?? "";
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(resultJson) as Record<string, unknown>; } catch { throw new Error("Gemini returned an incomplete result. Please try again."); }
    const title = resultTitle(args.tool, input, parsed);
    const id: Id<"brainGenerations"> = await ctx.runMutation(internal.contentBrainToolData.save, { userId, tool: args.tool, input, title, resultJson });
    return { id, title, resultJson };
  },
});
