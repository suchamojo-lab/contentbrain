import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
const creatorType = v.object({
  creatorType: v.string(),
  whyYou: v.string(),
  whyYouShouldCreate: v.string(),
  createMore: v.array(v.string()),
  watchOutFor: v.string(),
  signatureStrength: v.string(),
});
const profileResult = v.union(
  v.null(),
  v.object({
    creatorType: v.union(v.null(), creatorType),
    creatorTypeGeneratedAt: v.union(v.null(), v.number()),
    brainViewFeedback: v.union(v.null(), v.string()),
    brainInsightFeedback: v.union(v.null(), v.string()),
  }),
);
export const readOwnedContext = internalQuery({
  args: { universeId: v.id("contentUniverses") },
  returns: v.union(
    v.null(),
    v.object({ context: v.string(), cached: v.union(v.null(), creatorType) }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const universe = await ctx.db.get(args.universeId);
    if (!universe || universe.userId !== userId) return null;
    const profile = await ctx.db
      .query("contentBrainProfiles")
      .withIndex("by_userId_and_universeId", (q) =>
        q.eq("userId", userId).eq("universeId", args.universeId),
      )
      .unique();
    return {
      context: JSON.stringify({
        answers: universe.answers,
        universe: universe.universe,
        contentUniverse:
          universe.activationUniverseV1 ?? universe.activationUniverse,
      }),
      cached: profile?.creatorType ?? null,
    };
  },
});
export const saveCreatorType = internalMutation({
  args: { universeId: v.id("contentUniverses"), result: creatorType },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You need to sign in first");
    const universe = await ctx.db.get(args.universeId);
    if (!universe || universe.userId !== userId)
      throw new Error("Content Universe not found");
    const existing = await ctx.db
      .query("contentBrainProfiles")
      .withIndex("by_userId_and_universeId", (q) =>
        q.eq("userId", userId).eq("universeId", args.universeId),
      )
      .unique();
    const now = Date.now();
    if (existing)
      await ctx.db.patch(existing._id, {
        creatorType: args.result,
        creatorTypeGeneratedAt: now,
        updatedAt: now,
      });
    else
      await ctx.db.insert("contentBrainProfiles", {
        userId,
        universeId: args.universeId,
        creatorType: args.result,
        creatorTypeGeneratedAt: now,
        updatedAt: now,
      });
    return null;
  },
});
export const mine = query({
  args: { universeId: v.id("contentUniverses") },
  returns: profileResult,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const row = await ctx.db
      .query("contentBrainProfiles")
      .withIndex("by_userId_and_universeId", (q) =>
        q.eq("userId", userId).eq("universeId", args.universeId),
      )
      .unique();
    return row
      ? {
          creatorType: row.creatorType ?? null,
          creatorTypeGeneratedAt: row.creatorTypeGeneratedAt ?? null,
          brainViewFeedback: row.brainViewFeedback ?? null,
          brainInsightFeedback: row.brainInsightFeedback ?? null,
        }
      : null;
  },
});
export const feedback = mutation({
  args: {
    universeId: v.id("contentUniverses"),
    kind: v.union(v.literal("brain_view"), v.literal("brain_insight")),
    value: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You need to sign in first");
    const universe = await ctx.db.get(args.universeId);
    if (!universe || universe.userId !== userId)
      throw new Error("Content Universe not found");
    const row = await ctx.db
      .query("contentBrainProfiles")
      .withIndex("by_userId_and_universeId", (q) =>
        q.eq("userId", userId).eq("universeId", args.universeId),
      )
      .unique();
    const update =
      args.kind === "brain_view"
        ? {
            brainViewFeedback:
              args.value === "confirmed"
                ? ("confirmed" as const)
                : ("needs_edit" as const),
          }
        : {
            brainInsightFeedback:
              args.value === "true"
                ? ("true" as const)
                : ("not_really" as const),
          };
    if (row) await ctx.db.patch(row._id, { ...update, updatedAt: Date.now() });
    else
      await ctx.db.insert("contentBrainProfiles", {
        userId,
        universeId: args.universeId,
        ...update,
        updatedAt: Date.now(),
      });
    return null;
  },
});
