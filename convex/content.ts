import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { activationUniverse } from "./contentBrainData";

const compassAnswers = v.object({
  character: v.string(), gifts: v.string(), expertise: v.string(), obsessions: v.string(),
  opinions: v.string(), audience: v.string(), expression: v.string(), positioning: v.string(),
});

const contentUniverse = v.object({
  thesis: v.string(), positioning: v.string(), audience: v.string(), pillars: v.array(v.string()),
  themes: v.array(v.string()), stories: v.array(v.string()), expertise: v.array(v.string()),
  obsessions: v.array(v.string()), formats: v.array(v.string()), voice: v.array(v.string()), ideas: v.array(v.string()),
});

async function requireUserId(ctx: Parameters<typeof getAuthUserId>[0]) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("You need to sign in first");
  return userId;
}

export const currentUser = query({
  args: {},
  returns: v.union(v.null(), v.object({
    id: v.id("users"), name: v.union(v.string(), v.null()),
    email: v.union(v.string(), v.null()), phone: v.union(v.string(), v.null()),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    return user ? { id: user._id, name: user.name ?? null, email: user.email ?? null, phone: user.phone ?? null } : null;
  },
});

const creatorProfile = v.object({
  linkedinUrl: v.string(),
  instagramHandle: v.string(),
  bio: v.string(),
});

export const getCreatorProfile = query({
  args: {},
  returns: v.union(v.null(), creatorProfile),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const profile = await ctx.db.query("creatorProfiles").withIndex("by_userId", (q) => q.eq("userId", userId)).unique();
    return profile ? {
      linkedinUrl: profile.linkedinUrl ?? "",
      instagramHandle: profile.instagramHandle ?? "",
      bio: profile.bio ?? "",
    } : null;
  },
});

export const saveCreatorProfile = mutation({
  args: creatorProfile.fields,
  returns: v.id("creatorProfiles"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db.query("creatorProfiles").withIndex("by_userId", (q) => q.eq("userId", userId)).unique();
    const values = {
      linkedinUrl: args.linkedinUrl.trim() || undefined,
      instagramHandle: args.instagramHandle.trim().replace(/^@/, "") || undefined,
      bio: args.bio.trim() || undefined,
      updatedAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, values);
      return existing._id;
    }
    return await ctx.db.insert("creatorProfiles", { userId, ...values });
  },
});

export const latestUniverse = query({
  args: {},
  returns: v.union(v.null(), v.object({ id: v.id("contentUniverses"), answers: compassAnswers, universe: contentUniverse, activationUniverse: v.union(v.null(), activationUniverse) })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const saved = await ctx.db.query("contentUniverses").withIndex("by_userId", (q) => q.eq("userId", userId)).order("desc").first();
    if (!saved) return null;
    return {
      id: saved._id,
      answers: {
        character: saved.answers.character ?? "",
        gifts: saved.answers.gifts ?? "",
        expertise: saved.answers.expertise ?? "",
        obsessions: saved.answers.obsessions ?? "",
        opinions: saved.answers.opinions ?? "",
        audience: saved.answers.audience ?? "",
        expression: saved.answers.expression ?? saved.answers.radiance ?? "",
        positioning: saved.answers.positioning ?? "",
      },
      universe: {
        thesis: saved.universe.thesis ?? saved.universe.positioning,
        positioning: saved.universe.positioning,
        audience: saved.universe.audience,
        pillars: saved.universe.pillars,
        themes: saved.universe.themes,
        stories: saved.universe.stories,
        expertise: saved.universe.expertise ?? saved.universe.pillars.slice(0, 3),
        obsessions: saved.universe.obsessions ?? [],
        formats: saved.universe.formats,
        voice: saved.universe.voice ?? ["Clear", "Human", "Direct"],
        ideas: saved.universe.ideas ?? [],
      },
      activationUniverse: saved.activationUniverseV1 ?? null,
    };
  },
});

export const saveUniverse = mutation({
  args: { answers: compassAnswers, universe: contentUniverse },
  returns: v.id("contentUniverses"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db.query("contentUniverses").withIndex("by_userId", (q) => q.eq("userId", userId)).order("desc").first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { answers: args.answers, universe: args.universe, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("contentUniverses", { userId, ...args, createdAt: now, updatedAt: now });
  },
});

export const saveIdea = mutation({
  args: { universeId: v.id("contentUniverses"), text: v.string() },
  returns: v.id("ideas"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const universe = await ctx.db.get(args.universeId);
    if (!universe || universe.userId !== userId) throw new Error("Content Universe not found");
    return await ctx.db.insert("ideas", { userId, ...args, submittedAt: Date.now() });
  },
});

export const lockDirection = mutation({
  args: {
    universeId: v.id("contentUniverses"), ideaId: v.id("ideas"), topic: v.string(), angle: v.string(),
    hook: v.string(), format: v.string(), direction: v.array(v.string()),
  },
  returns: v.id("lockedDirections"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const [universe, idea] = await Promise.all([ctx.db.get(args.universeId), ctx.db.get(args.ideaId)]);
    if (!universe || universe.userId !== userId) throw new Error("Content Universe not found");
    if (!idea || idea.userId !== userId || idea.universeId !== args.universeId) throw new Error("Idea not found");
    return await ctx.db.insert("lockedDirections", { userId, ...args, lockedAt: Date.now() });
  },
});

export const myCounts = query({
  args: {},
  returns: v.object({ universes: v.number(), ideas: v.number(), lockedDirections: v.number() }),
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const [universes, ideas, directions] = await Promise.all([
      ctx.db.query("contentUniverses").withIndex("by_userId", (q) => q.eq("userId", userId)).take(100),
      ctx.db.query("ideas").withIndex("by_userId", (q) => q.eq("userId", userId)).take(100),
      ctx.db.query("lockedDirections").withIndex("by_userId", (q) => q.eq("userId", userId)).take(100),
    ]);
    return { universes: universes.length, ideas: ideas.length, lockedDirections: directions.length };
  },
});
