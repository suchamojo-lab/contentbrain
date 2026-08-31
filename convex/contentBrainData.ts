import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const activationAnswers = v.object({ character: v.string(), naturalAuthority: v.string(), obsessions: v.string(), expressionFormats: v.array(v.string()), expressionNotes: v.string() });
const titledDescription = v.object({ title: v.string(), description: v.string() });
export const activationUniverse = v.object({
  character: v.object({ summary: v.string(), identitySignals: v.array(v.string()), characterTraits: v.array(v.string()), coreMotive: v.string() }),
  gifts: v.object({ naturalStrengths: v.array(v.string()), superpower: v.string() }),
  radiance: v.object({ topics: v.array(v.string()), interestingIntersections: v.array(v.object({ title: v.string(), insight: v.string() })) }),
  expression: v.object({ profile: v.string(), bestFormats: v.array(v.string()), lessNaturalFormats: v.array(v.string()) }),
  territory: v.object({ archetype: v.string(), positioning: v.string(), territories: v.array(titledDescription) }),
  contentPillars: v.array(v.object({ title: v.string(), why: v.string(), topics: v.array(v.string()) })),
  storyBank: v.array(v.object({ title: v.string(), source: v.string(), lesson: v.string(), potentialHook: v.string() })),
  ideaUniverse: v.array(v.object({ pillar: v.string(), ideas: v.array(v.string()) })),
});
export const legacyUniverse = v.object({ thesis: v.string(), positioning: v.string(), audience: v.string(), pillars: v.array(v.string()), themes: v.array(v.string()), stories: v.array(v.string()), expertise: v.array(v.string()), obsessions: v.array(v.string()), formats: v.array(v.string()), voice: v.array(v.string()), ideas: v.array(v.string()) });
const owner = { userId: v.optional(v.id("users")), clientId: v.optional(v.string()) };
const MODEL = "gemini-3.6-flash";
const SCHEMA_VERSION = "content-universe-v1";

export const findCached = internalQuery({
  args: { ...owner, answersHash: v.string() }, returns: v.union(v.null(), v.object({ id: v.id("contentUniverses"), universe: legacyUniverse, activationUniverse })),
  handler: async (ctx, args) => {
    const saved = args.userId ? await ctx.db.query("contentUniverses").withIndex("by_userId", (q) => q.eq("userId", args.userId)).order("desc").first() : await ctx.db.query("contentUniverses").withIndex("by_clientId", (q) => q.eq("clientId", args.clientId)).order("desc").first();
    if (!saved || saved.answersHash !== args.answersHash || saved.aiModel !== MODEL || saved.aiSchemaVersion !== SCHEMA_VERSION || !saved.activationUniverseV1) return null;
    return { id: saved._id, universe: { thesis: saved.universe.thesis ?? saved.universe.positioning, positioning: saved.universe.positioning, audience: saved.universe.audience, pillars: saved.universe.pillars, themes: saved.universe.themes, stories: saved.universe.stories, expertise: saved.universe.expertise ?? [], obsessions: saved.universe.obsessions ?? [], formats: saved.universe.formats, voice: saved.universe.voice ?? [], ideas: saved.universe.ideas ?? [] }, activationUniverse: saved.activationUniverseV1 };
  },
});

export const saveGenerated = internalMutation({
  args: { ...owner, answers: activationAnswers, answersHash: v.string(), universe: legacyUniverse, activationUniverse }, returns: v.id("contentUniverses"),
  handler: async (ctx, args) => {
    if (!args.userId && !args.clientId) throw new Error("Missing Content Brain owner");
    const existing = args.userId ? await ctx.db.query("contentUniverses").withIndex("by_userId", (q) => q.eq("userId", args.userId)).order("desc").first() : await ctx.db.query("contentUniverses").withIndex("by_clientId", (q) => q.eq("clientId", args.clientId)).order("desc").first();
    const storedAnswers = { character: args.answers.character, gifts: args.answers.naturalAuthority, obsessions: args.answers.obsessions, expression: [...args.answers.expressionFormats, args.answers.expressionNotes].filter(Boolean).join(". ") };
    const values = { answers: storedAnswers, answersHash: args.answersHash, aiModel: MODEL, aiSchemaVersion: SCHEMA_VERSION, universe: args.universe, activationUniverseV1: args.activationUniverse, updatedAt: Date.now() };
    if (existing) { await ctx.db.patch(existing._id, values); return existing._id; }
    return await ctx.db.insert("contentUniverses", { userId: args.userId, clientId: args.clientId, ...values, createdAt: Date.now() });
  },
});
