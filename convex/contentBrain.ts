"use node";
import { getAuthUserId } from "@convex-dev/auth/server";
import { type Infer, v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { createGeminiProvider } from "./ai/gemini";
import { AiRateLimitError } from "./ai/types";
import { activationAnswers, activationUniverse, legacyUniverse } from "./contentBrainData";

function fingerprint(value: unknown) { let hash = 2166136261; for (const character of JSON.stringify(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619); return (hash >>> 0).toString(36); }
function validGuest(value?: string) { if (!value || value.length < 24 || value.length > 100) throw new Error("Invalid guest session"); return value; }

export const build = action({
  args: { guestSessionId: v.optional(v.string()), answers: activationAnswers },
  returns: v.object({ id: v.id("contentUniverses"), universe: legacyUniverse, activationUniverse, cached: v.boolean() }),
  handler: async (ctx, args): Promise<{ id: Id<"contentUniverses">; universe: Infer<typeof legacyUniverse>; activationUniverse: Infer<typeof activationUniverse>; cached: boolean }> => {
    const userId = await getAuthUserId(ctx); const clientId = userId ? undefined : validGuest(args.guestSessionId); const answersHash = fingerprint(args.answers);
    const cached: { id: Id<"contentUniverses">; universe: Infer<typeof legacyUniverse>; activationUniverse: Infer<typeof activationUniverse> } | null = await ctx.runQuery(internal.contentBrainData.findCached, { userId: userId ?? undefined, clientId, answersHash });
    if (cached) {
      if (userId)
        await ctx.scheduler.runAfter(
          0,
          internal.lifecycleEmailSender.sendUniverseComplete,
          { userId, universeId: cached.id },
        );
      return { ...cached, cached: true };
    }
    try {
      const generated = await createGeminiProvider().generateContentUniverse(args.answers);
      const universe = { thesis: generated.character.summary, positioning: generated.territory.positioning, audience: "People who connect with the user's stated experience and interests.", pillars: generated.contentPillars.map((item) => item.title), themes: generated.territory.territories.map((item) => item.title), stories: generated.storyBank.map((item) => item.title), expertise: generated.gifts.naturalStrengths, obsessions: generated.radiance.topics, formats: generated.expression.bestFormats, voice: [generated.expression.profile], ideas: generated.ideaUniverse.flatMap((group) => group.ideas) };
      const id: Id<"contentUniverses"> = await ctx.runMutation(internal.contentBrainData.saveGenerated, { userId: userId ?? undefined, clientId, answers: args.answers, answersHash, universe, activationUniverse: generated });
      if (userId)
        await ctx.scheduler.runAfter(
          0,
          internal.lifecycleEmailSender.sendUniverseComplete,
          { userId, universeId: id },
        );
      return { id, universe, activationUniverse: generated, cached: false };
    } catch (error) {
      if (error instanceof AiRateLimitError) throw error;
      throw new Error(error instanceof Error ? error.message : "We couldn't build that part of your brain yet.");
    }
  },
});
